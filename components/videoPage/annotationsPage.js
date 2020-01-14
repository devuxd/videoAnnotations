import React, { useState, useEffect } from "react";
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
import { mainColor, secondColor } from "../../API/color";
import { secondsToStringFormat } from "../../API/time";
//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  // *** States ***
  // keep track of the selected annotation and sub-annotation.
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  useEffect(() => {
    changeAnnotationTitles(
      Array.from(new Set(props.annotations.map(annotation => annotation.title)))
    );
    changesubAnnotationTitles(
      Array.from(
        new Set(selectedAnnotation?.subAnnotations.map(({ title }) => title))
      )
    );
  }, [selectedAnnotation]);

  const [selectedSubAnnotation, changeSelectedSubAnnotation] = useState(null);

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
  const [annotationTitles, changeAnnotationTitles] = useState([]);
  const [subAnnotationTitles, changesubAnnotationTitles] = useState([]);
  const [windowWidth, changeWindowWidth] = useState(0);
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
  // ***

  // *** Click handlers
  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    document.getElementById("video-annotations").scrollIntoView();
    changeSelectedAnnotationState("showAnnotations&Edit");
    changeSelectedAnnotation(selectedAnnotation);
    props.player.seekTo(selectedAnnotation.duration.start.inSeconds);
  };

  // handel sub-annotation click
  const onSubAnnotationClick = newSelectedSubAnnotation => {
    props.player.seekTo(
      selectedAnnotation.duration.start.inSeconds +
        newSelectedSubAnnotation.duration.start.inSeconds
    );
    changeSelectedSubAnnotation(newSelectedSubAnnotation);
    changeSelectedAnnotationState("showSubAnnotations&Edit");
  };
  // ***

  // when one of the sub-annotation updated -> propagate this update to local state and the main state maintained by [videoId].js
  const updateSubAnnotations = newSubAnnotation => {
    const subAnnotations = selectedAnnotation.subAnnotations.map(
      subAnnotation =>
        subAnnotation.id === newSubAnnotation.id
          ? newSubAnnotation
          : subAnnotation
    );
    saveAnnotationChange({ ...selectedAnnotation, subAnnotations });
  };

  // when one of the annotation updated -> propagate the update to the main state maintained by [videoId].js
  const updateSelectedAnnotation = newAnnotation => {
    const { subAnnotations } = selectedAnnotation;
    saveAnnotationChange({ ...newAnnotation, subAnnotations });
  };
  const addNewAnnotation = newAnnotation => {
    const annotation = { ...newAnnotation, subAnnotations: [] };
    props.addAnnotation(annotation);
    changeSelectedAnnotation(annotation);
    changeSelectedAnnotationState("showAnnotations&Edit");
  };
  // adding annotation start with only adding title and start time and then call editSubAnnotation to let the user continue
  const addNewSubAnnotation = newSubAnnotation => {
    changeSelectedSubAnnotation(newSubAnnotation);
    const newAnnotation = {
      ...selectedAnnotation,
      subAnnotations: [...selectedAnnotation.subAnnotations, newSubAnnotation]
    };
    saveAnnotationChange(newAnnotation);
    changeSelectedAnnotationState("showSubAnnotations&Edit");
  };

  const deleteAnotation = (annotation = selectedAnnotation) => {
    changeSelectedAnnotation(null);
    changeSelectedAnnotationState("showAnnotations");
    props.deleteAnotation(annotation);
  };

  const saveAnnotationChange = newAnnotation => {
    changeSelectedAnnotation(newAnnotation);
    props.updateAnnotations(newAnnotation);
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
        {selectedAnnotationState === "showAnnotations&Edit" && (
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
                  changeSelectedAnnotation(null);
                }}
              >
                <FontAwesomeIcon
                  style={{ width: "15px" }}
                  icon={faWindowClose}
                />
              </button>
            </div>
            <AnnotationEditForm
              selectedAnnotation={selectedAnnotation}
              getCurrentTime={props.player.getCurrentTime}
              update={updateSelectedAnnotation}
              selectedAnnotationStart={0}
              key={JSON.stringify(selectedAnnotation)}
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
                  alignSelf: "flex-start",
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
        )}
      </>
    );
  };

  const getSubAnnotations = () => {
    return (
      <>
        <AnnotationsVis
          annotationData={selectedAnnotation.subAnnotations}
          annotationLength={
            selectedAnnotation.duration.end.inSeconds -
            selectedAnnotation.duration.start.inSeconds
          }
          onAnnotationClick={onSubAnnotationClick}
          divId={"#sub-annotations"}
          key={JSON.stringify(selectedAnnotation.subAnnotations) + windowWidth}
          windowWidth={windowWidth}
          colorScheme={secondColor}
        >
          <div
            id="sub-annotations"
            style={{ marginBottom: "-5px", marginTop: "10px" }}
          ></div>
        </AnnotationsVis>
        {selectedAnnotationState === "showSubAnnotations&Edit" && (
          <AnnotationBox
            selectedAnnotationId={selectedSubAnnotation.id}
            boxStyle={{ border: "3px solid", maxWidth: "815px" }}
            windowWidth={windowWidth}
          >
            <AnnotationEditForm
              getCurrentTime={props.player.getCurrentTime}
              selectedAnnotation={selectedSubAnnotation}
              key={selectedAnnotation.id}
              update={updateSubAnnotations}
              selectedAnnotationStart={
                selectedAnnotation.duration.start.inSeconds
              }
            />
          </AnnotationBox>
        )}
        {selectedAnnotationState === "showSubAnnotations&Add" && (
          <AnnotationAddForm
            getCurrentTime={props.player.getCurrentTime}
            addNewSubAnnotation={addNewSubAnnotation}
            offsetTime={selectedAnnotation.duration.start.inSeconds}
            annotationTitles={subAnnotationTitles}
            newAnnotationId={selectedAnnotation.subAnnotations.length}
            defaultStartTime={
              selectedAnnotation.subAnnotations[
                selectedAnnotation.subAnnotations.length - 1
              ]?.duration.end.time
            }
            colorScheme={secondColor}
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
          gridTemplateRows: "30px 350px auto"
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
            key={selectedAnnotation}
            titles={annotationTitles}
            selectedTitle={selectedAnnotation?.title}
            colorScheme={mainColor}
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
            onAnnotationClick={onAnnotationClick}
            divId={"#video-annotations"}
            key={JSON.stringify(props.annotations) + windowWidth}
            windowWidth={windowWidth}
            colorScheme={mainColor}
          >
            <div id="video-annotations" name="video-annotations"></div>
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
              changeSelectedAnnotation(null);
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
          {selectedAnnotation && (
            <AnnotationBox
              selectedAnnotationId={selectedAnnotation.id}
              boxStyle={
                selectedAnnotationState.startsWith("showAnnotations")
                  ? { border: "3px solid", maxWidth: "815px" }
                  : { borderTop: "3px solid", left: "0px" }
              }
              windowWidth={windowWidth}
            >
              {getAnnotationsSection()}
            </AnnotationBox>
          )}

          {selectedAnnotationState === "showAnnotations&Add" && (
            <AnnotationAddForm
              getCurrentTime={props.player.getCurrentTime}
              addNewSubAnnotation={addNewAnnotation}
              offsetTime={0}
              annotationTitles={annotationTitles}
              newAnnotationId={
                props.annotations[props.annotations.length - 1]?.id + 1
              }
              defaultStartTime={secondsToStringFormat(
                props.player.getCurrentTime()
              )}
              colorScheme={mainColor}
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
                gridRowEnd: "2",
                alignSelf: "center",
                justifySelf: "center"
              }}
            >
              <AnnotationsTitles
                key={selectedSubAnnotation}
                titles={subAnnotationTitles}
                selectedTitle={selectedSubAnnotation?.title}
                colorScheme={secondColor}
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
                onClick={() =>
                  changeSelectedAnnotationState("showSubAnnotations&Add")
                }
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
