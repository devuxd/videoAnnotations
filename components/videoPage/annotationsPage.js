import React, { useState, useEffect, useRef } from "react";
import AnnotationsVis from "./components/annotationsVis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import AnnotationEditForm from "./components/annotationEditForm";
import AnnotationAddForm from "./components/annotationAddForm";
import AnnotationsTitles from "./components/annotationsTitles";
import AnnotationBox from "./components/annotationsBox";

//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  // Stats:
  // 1: showAnnotations -> show only main annotations.
  // 2: showAnnotations&Edit -> when one of the main annotations got clicked show edit form.
  // 3: showAnnotations&Add -> when add annotation button cliked show the add forms.
  // 4 : showSubAnnotations -> when show sub-annotations button clicked, show all sub annotations for the selected annotations.
  // 5 : showSubAnnotations&Edit -> when one of the sub-annotation got clicked show edit form for the selected subAnnotation.
  // 6 : showSubAnnotations&Add -> when the add sub-annotations got clicked, show the add sub-annotation form.
  const [selectedAnnotationState, changeSelectedAnnotationState] = useState(
    "showAnnotations"
  );
  const annotationTitles = useRef();
  const subAnnotationTitles = useRef();
  const [windowWidth, changeWindowWidth] = useState(0);
  const trackingTime = useRef(null);
  const [videoProgress, changeVideoProgress] = useState(0);
  const [selectedAnnotationId, changeSelectedAnnotationId] = useState(null);
  const [selectedSubAnnotationId, changeSelectedSubAnnotationId] = useState(
    null
  );

  annotationTitles.current = Array.from(
    new Set(props.annotations.map(annotation => annotation.title))
  );
  const titles = props.annotations
    .map(annotation => annotation.subAnnotations?.map(({ title }) => title))
    .flat();
  subAnnotationTitles.current = Array.from(new Set(titles));

  useEffect(() => {
    changeWindowWidth(document.getElementById("YTplayer").offsetWidth);
    window.addEventListener("resize", () =>
      changeWindowWidth(document.getElementById("YTplayer").offsetWidth)
    );
    return () =>
      window.removeEventListener("resize", () =>
        changeWindowWidth(document.getElementById("YTplayer").offsetWidth)
      );
  });
  useEffect(() => {
    if (
      props.subAnnotationProgressState === "show" &&
      selectedAnnotationState === "showSubAnnotations&Edit"
    ) {
      trackingTime.current = setInterval(
        () => changeVideoProgress(props.getVideoProgress()),
        100
      );
    } else {
      clearInterval(trackingTime.current);
    }
    return () => clearInterval(trackingTime.current);
  }, [props.subAnnotationProgressState]);
  // ***

  const getSelectedAnnotation = () =>
    props.annotations.find(({ id }) => id === selectedAnnotationId);
  const getSelectedSubAnnotation = () =>
    getSelectedAnnotation().subAnnotations.find(
      ({ id }) => id === selectedSubAnnotationId
    );

  // *** Click handlers
  // handel the click on annotation and sub-annotation
  const onAnnotationClick = annotation => {
    document.getElementById("video-annotations").scrollIntoView();
    props.player.seekTo(annotation.duration.start.inSeconds);
    changeSelectedAnnotationState("showAnnotations&Edit");
    changeSelectedAnnotationId(annotation.id);
  };

  // handel sub-annotation click
  const onSubAnnotationClick = subAnnotatio => {
    props.player.seekTo(
      getSelectedAnnotation().duration.start.inSeconds +
        subAnnotatio.duration.start.inSeconds
    );
    changeSelectedAnnotationState("showSubAnnotations&Edit");
    changeSelectedSubAnnotationId(subAnnotatio.id);
  };
  // ***

  // when one of the sub-annotation updated -> propagate this update to local state and the main state maintained by [videoId].js
  const updateSubAnnotations = newSubAnnotation => {
    const subAnnotations = getSelectedAnnotation().subAnnotations.map(
      subAnnotation =>
        subAnnotation.id === newSubAnnotation.id
          ? newSubAnnotation
          : subAnnotation
    );
    const updatedAnnotation = { ...getSelectedAnnotation(), subAnnotations };
    props.updateAnnotations(updatedAnnotation);
  };

  // when one of the annotation updated -> propagate the update to the main state maintained by [videoId].js
  const updateSelectedAnnotation = newAnnotation => {
    const { subAnnotations } = getSelectedAnnotation();
    const updatedAnnotation = { ...newAnnotation, subAnnotations };
    props.updateAnnotations(updatedAnnotation);
  };

  const addNewAnnotation = newAnnotation => {
    const annotation = { ...newAnnotation, subAnnotations: [] };
    onAnnotationClick(annotation);
    props.addAnnotation(annotation);
  };
  // adding annotation start with only adding title and start time and then call editSubAnnotation to let the user continue
  const addNewSubAnnotation = newSubAnnotation => {
    const selectedAnnotation = getSelectedAnnotation();
    const newAnnotation = {
      ...selectedAnnotation,
      subAnnotations: [...selectedAnnotation.subAnnotations, newSubAnnotation]
    };

    onSubAnnotationClick(newSubAnnotation);
    changeSelectedAnnotationId(newAnnotation.id);
    props.updateAnnotations(newAnnotation);
  };

  const deleteAnotation = () => {
    changeSelectedAnnotationId(null);
    changeSelectedAnnotationState("showAnnotations");
    props.deleteAnotation(getSelectedAnnotation());
  };

  const deleteSubAnotation = () => {
    const selectedAnnotation = getSelectedAnnotation();
    const selectedSubAnnotation = getSelectedSubAnnotation();
    changeSelectedAnnotationState("showSubAnnotations");
    const subAnnotations = selectedAnnotation.subAnnotations.filter(
      subAnnotation => subAnnotation.id !== selectedSubAnnotation.id
    );
    const updatedAnnotation = { ...selectedAnnotation, subAnnotations };
    changeSelectedSubAnnotationId(null);
    props.updateAnnotations(updatedAnnotation);
  };

  // show the annotation or the sub-annotation and never both
  const getAnnotationsSection = () => {
    if (selectedAnnotationState == "showAnnotations&Edit")
      return getEditAnnotation();

    if (selectedAnnotationState.startsWith("showSubAnnotations"))
      return getSubAnnotations();
  };

  // this show up when an annotation got selected.
  const getEditAnnotation = () => {
    return (
      <>
        <div
          style={{
            display: "grid",
            justifyContent: "right",
            alignContent: "end",
            gridTemplateColumns: "20px"
          }}
        >
          <button
            style={{
              display: "inline-block",
              padding: "0px",
              width: "0px",
              height: "7px",
              border: "0px",
              color: "darkred",
              position: "relative",
              bottom: "12px",
              left: "10px",
              outline: "0px"
            }}
            title="close annotation"
            onClick={() => {
              changeSelectedAnnotationState("showAnnotations");
              changeSelectedAnnotationId(null);
            }}
          >
            <FontAwesomeIcon style={{ width: "15px" }} icon={faWindowClose} />
          </button>
        </div>
        <AnnotationEditForm
          selectedAnnotation={getSelectedAnnotation()}
          getCurrentTime={props.player.getCurrentTime}
          update={updateSelectedAnnotation}
          offsetTime={0}
          seekTo={props.player.seekTo}
          annotationTitles={annotationTitles.current}
          kye={selectedAnnotationId}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40% 30%"
          }}
        >
          <div
            style={{
              gridColumnStart: "2",
              gridColumnEnd: "2",
              alignSelf: "flex-start",
              justifySelf: "end"
            }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                changeSelectedAnnotationState("showSubAnnotations")
              }
            >
              <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  alignContent: "center",
                  gridTemplateColumns: "20px 250px 20px",
                  height: "15px"
                }}
              >
                <p style={{ display: "inline-block", margin: "0 auto" }}>
                  <FontAwesomeIcon
                    style={{ width: "15px" }}
                    icon={faArrowLeft}
                  />
                </p>
                Show sub-annotations
                <p style={{ display: "inline-block", margin: "0 auto" }}>
                  <FontAwesomeIcon
                    style={{ width: "15px" }}
                    icon={faArrowRight}
                  />
                </p>
              </div>
            </button>
          </div>
          <div
            style={{
              gridColumnStart: "3",
              gridColumnEnd: "3",
              alignSelf: "end",
              justifySelf: "end"
            }}
          >
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => deleteAnotation()}
            >
              Delete annotation
            </button>
          </div>
        </div>
      </>
    );
  };

  const getSubAnnotations = () => {
    return (
      <>
        <AnnotationsVis
          annotationData={getSelectedAnnotation().subAnnotations}
          key={
            JSON.stringify(getSelectedAnnotation().subAnnotations) + windowWidth
          }
          annotationLength={
            getSelectedAnnotation().duration.end.inSeconds -
            getSelectedAnnotation().duration.start.inSeconds
          }
          annotationStart={getSelectedAnnotation().duration.start.time}
          onAnnotationClick={onSubAnnotationClick}
          divId={"#sub-annotations"}
          windowWidth={windowWidth}
          colorScheme={props.colorScheme.secondColor}
        >
          <div
            className="progress"
            style={{
              height: "4px",
              display:
                props.subAnnotationProgressState === "hide" ? "table" : "flex"
            }}
          >
            <div
              className="progress-bar bg-danger"
              style={{
                width: `${((videoProgress -
                  getSelectedAnnotation().duration.start.inSeconds) /
                  (getSelectedAnnotation().duration.end.inSeconds -
                    getSelectedAnnotation().duration.start.inSeconds)) *
                  100}%`
              }}
            ></div>
          </div>
          <div id="sub-annotations"></div>
        </AnnotationsVis>
        {selectedAnnotationState === "showSubAnnotations&Edit" &&
          getSelectedSubAnnotation() && (
            <AnnotationBox
              selectedAnnotationId={selectedSubAnnotationId}
              boxStyle={{
                border: "3px solid",
                maxWidth: "500px",
                backgroundColor: "white"
              }}
              windowWidth={windowWidth}
            >
              <AnnotationEditForm
                getCurrentTime={props.player.getCurrentTime}
                selectedAnnotation={getSelectedSubAnnotation()}
                update={updateSubAnnotations}
                offsetTime={getSelectedAnnotation().duration.start.inSeconds}
                seekTo={props.player.seekTo}
                annotationTitles={subAnnotationTitles.current}
                key={selectedSubAnnotationId}
              />
              <div
                style={{
                  display: "grid",
                  justifyContent: "end",
                  alignContent: "end",
                  height: "40px"
                }}
              >
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteSubAnotation()}
                >
                  Delete sub-annotation
                </button>
              </div>
            </AnnotationBox>
          )}
        {selectedAnnotationState === "showSubAnnotations&Add" && (
          <AnnotationAddForm
            player={props.player}
            addNewSubAnnotation={addNewSubAnnotation}
            offsetTime={getSelectedAnnotation().duration.start.inSeconds}
            annotationTitles={subAnnotationTitles.current}
            newAnnotationId={`${selectedAnnotationId}_${
              getSelectedAnnotation().subAnnotations.length
            }_${Math.floor(Math.random(10) * 10000)}`}
            defaultStartTime={
              getSelectedAnnotation().subAnnotations[
                getSelectedAnnotation().subAnnotations.length - 1
              ]?.duration.end.time ??
              getSelectedAnnotation().duration.start.time
            }
            colorScheme={props.colorScheme.secondColor}
            annotationDefualtLength={
              getSelectedAnnotation().duration.end.inSeconds
            }
          />
        )}
      </>
    );
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 75% 15%",
          gridTemplateRows: "30px 350px 150px"
        }}
      >
        <div
          className="card-text"
          id={`annotations-badges`}
          disabled
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "1",
            gridRowStart: "2",
            gridRowEnd: "2",
            alignSelf: "flex-start",
            justifySelf: "center"
          }}
        >
          <AnnotationsTitles
            key={getSelectedAnnotation()}
            titles={annotationTitles.current}
            selectedTitle={getSelectedAnnotation()?.title}
            colorScheme={props.colorScheme.mainColor}
          />
        </div>
        <div
          style={{
            gridColumnStart: "2",
            gridColumnEnd: "2",
            gridRowStart: "1",
            gridRowEnd: "1"
          }}
        >
          <AnnotationsVis
            annotationData={props.annotations}
            annotationLength={props.videoLength}
            annotationStart={"0:00:00"}
            onAnnotationClick={onAnnotationClick}
            divId={"#video-annotations"}
            key={JSON.stringify(props.annotations) + windowWidth}
            windowWidth={windowWidth}
            colorScheme={props.colorScheme.mainColor}
          >
            <div
              id="video-annotations"
              name="video-annotations"
              style={{ marginLeft: "10px", marginRight: "10px" }}
            ></div>
          </AnnotationsVis>
        </div>
        <div
          style={{
            gridColumnStart: "3",
            gridColumnEnd: "3",
            gridRowStart: "1",
            gridRowEnd: "1",
            justifySelf: "center",
            alignSelf: "start"
          }}
        >
          <button
            type="button"
            className="btn btn btn-outline-secondary btn-sm"
            onClick={() => {
              changeSelectedAnnotationState("showAnnotations&Add");
              props.changeSelectedAnnotation(null);
            }}
          >
            Add annotation
          </button>
        </div>
        <div
          style={{
            gridColumnStart: "2",
            gridColumnEnd: "2",
            gridRowStart: "2",
            gridRowEnd: "2"
          }}
        >
          {getSelectedAnnotation() && (
            <AnnotationBox
              selectedAnnotationId={selectedAnnotationId}
              boxStyle={
                selectedAnnotationState.startsWith("showAnnotations")
                  ? { border: "3px solid", maxWidth: "500px" }
                  : { borderTop: "3px solid", left: "0px" }
              }
              windowWidth={windowWidth}
              key={windowWidth}
            >
              {getAnnotationsSection()}
            </AnnotationBox>
          )}

          {selectedAnnotationState === "showAnnotations&Add" && (
            <AnnotationAddForm
              player={props.player}
              addNewSubAnnotation={addNewAnnotation}
              offsetTime={0}
              annotationTitles={annotationTitles.current}
              newAnnotationId={
                (props.annotations[props.annotations.length - 1]?.id ?? 10) + 1
              }
              defaultStartTime={
                props.annotations[props.annotations.length - 1]?.duration.end
                  .time
              }
              colorScheme={props.colorScheme.mainColor}
              annotationDefualtLength={props.videoLength}
            />
          )}
        </div>

        {selectedAnnotationState.startsWith("showSubAnnotations") && (
          <>
            <div
              className="card-text"
              id={`sub-annotations-badges`}
              disabled
              style={{
                gridColumnStart: "1",
                gridColumnEnd: "1",
                gridRowStart: "2",
                gridRowEnd: "span 3",
                alignSelf: "end",
                justifySelf: "start",
                fontSize: ".71em"
              }}
            >
              <AnnotationsTitles
                key={selectedSubAnnotationId}
                titles={subAnnotationTitles.current}
                selectedTitle={getSelectedSubAnnotation()?.title}
                colorScheme={props.colorScheme.secondColor}
              />
            </div>
            <div
              style={{
                gridColumnStart: "3",
                gridColumnEnd: "3",
                gridRowStart: "2",
                gridRowEnd: "2",
                justifySelf: "center",
                alignSelf: "center"
              }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm "
                onClick={() => {
                  changeSelectedAnnotationState("showSubAnnotations&Add");
                }}
                disabled={selectedAnnotationState === "showSubAnnotations&Add"}
              >
                Add sub-annotation
              </button>
              <br />
              <br />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm "
                onClick={() =>
                  changeSelectedAnnotationState("showAnnotations&Edit")
                }
              >
                Close sub-annotations
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default AnnotationsPage;
