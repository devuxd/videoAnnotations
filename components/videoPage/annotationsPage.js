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
import { stringToSecondsFormat, getDurationInSeconds } from "../../API/time";
//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.+++
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

  const getSelectedAnnotation = () => {
    const selectedAnnotation = props.annotations.find(
      ({ id }) => id === selectedAnnotationId
    );
    if (selectedAnnotation === undefined) return;
    selectedAnnotation.subAnnotations = sortAnootations(
      selectedAnnotation.subAnnotations
    );
    window.selectedAnnotation = selectedAnnotation;
    return selectedAnnotation;
  };

  const getSelectedSubAnnotation = () => {
    const selectedSubAnnotation = getSelectedAnnotation().subAnnotations.find(
      ({ id }) => id === selectedSubAnnotationId
    );
    window.selectedSubAnnotation = selectedSubAnnotation;
    return selectedSubAnnotation;
  };
  // *** Click handlers
  // handel the click on annotation and sub-annotation
  const onAnnotationClick = annotation => {
    document.getElementById("video-annotations").scrollIntoView();
    props.player.seekTo(stringToSecondsFormat(annotation.duration.start.time));
    changeSelectedAnnotationState("showAnnotations&Edit");
    changeSelectedAnnotationId(annotation.id);
  };

  // handel sub-annotation click
  const onSubAnnotationClick = subAnnotation => {
    changeSelectedSubAnnotationId(subAnnotation.id);
    props.player.seekTo(
      stringToSecondsFormat(subAnnotation.duration.start.time)
    );
    changeSelectedAnnotationState("showSubAnnotations&Edit");
  };
  // ***

  // when one of the annotation updated -> propagate the update to the main state maintained by [videoId].js
  const updateSelectedAnnotation = newAnnotation => {
    const { subAnnotations } = getSelectedAnnotation();
    const updatedAnnotation = { ...newAnnotation, subAnnotations };
    props.updateAnnotations(updatedAnnotation);
  };

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
    props.updateAnnotations(newAnnotation);
  };

  const deleteAnnotation = () => {
    changeSelectedAnnotationId(null);
    changeSelectedAnnotationState("showAnnotations");
    props.deleteAnnotation(getSelectedAnnotation());
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

  const mergeAnnotation = () => {
    const selectedAnnotation = getSelectedAnnotation();
    const nextAnnotation = getNextAnnotation(selectedAnnotation.id);
    const mergedAnnotation = {
      description: `${selectedAnnotation.description} \n ${nextAnnotation.description}`,
      duration: {
        start: {
          time: selectedAnnotation.duration.start.time
        },
        end: {
          time: nextAnnotation.duration.end.time
        }
      },
      id: selectedAnnotation.id,
      subAnnotations: [
        ...selectedAnnotation.subAnnotations,
        ...nextAnnotation.subAnnotations
      ],
      title: selectedAnnotation.title
    };
    props.mergeAnnotation(mergedAnnotation, nextAnnotation);
  };
  const sortAnootations = annotations =>
    Array.from(
      annotations.sort(
        (annotationA, annotationB) =>
          stringToSecondsFormat(annotationA.duration.start.time) -
          stringToSecondsFormat(annotationB.duration.start.time)
      )
    );

  const getNextAnnotation = id => {
    // make sure that the array is order by time
    if (id === undefined) return undefined;
    const array = sortAnootations(props.annotations);
    const nextElementId =
      array.findIndex(annotation => annotation.id === id) + 1;
    return array[nextElementId];
  };
  const getPreviousAnnotation = id => {
    // make sure that the array is order by time
    if (id === undefined) return undefined;
    const array = sortAnootations(props.annotations);
    const previousElementId =
      array.findIndex(annotation => annotation.id === id) - 1;
    return array[previousElementId];
  };

  const getNextSubAnnotation = id => {
    // make sure that the array is order by time
    if (id === undefined) return undefined;
    const selectedSubAnnotation = getSelectedAnnotation();
    const array = sortAnootations(selectedSubAnnotation.subAnnotations);
    const nextElementId =
      array.findIndex(annotation => annotation.id === id) + 1;
    return array[nextElementId];
  };
  const getPreviousSubAnnotation = id => {
    // make sure that the array is order by time
    if (id === undefined) return undefined;
    const selectedSubAnnotation = getSelectedAnnotation();
    const array = sortAnootations(selectedSubAnnotation.subAnnotations);
    const previousElementId =
      array.findIndex(annotation => annotation.id === id) - 1;
    return array[previousElementId];
  };

  // this show up when an annotation got selected.
  const getEditAnnotation = () => {
    return (
      <>
        <AnnotationEditForm
          selectedAnnotation={getSelectedAnnotation()}
          getCurrentTime={props.player.getCurrentTime}
          update={updateSelectedAnnotation}
          annotationTitles={props.annotationsTitle.annotations}
          kye={selectedAnnotationId}
          annotationNavigation={{ getNextAnnotation, getPreviousAnnotation }}
          onAnnotationClick={onAnnotationClick}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "25% 50% 25%"
          }}
        >
          <div
            style={{
              gridColumnStart: "1",
              gridColumnEnd: "1",
              alignSelf: "start",
              justifySelf: "start"
            }}
          >
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm("Delete this annotation?"))
                  deleteAnnotation();
              }}
            >
              Delete
            </button>
          </div>
          <div
            style={{
              gridColumnStart: "2",
              gridColumnEnd: "2",
              alignSelf: "center",
              justifySelf: "center"
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
                  gridTemplateColumns: " 10% 80% 10%",
                  width: "200px"
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
          {getNextAnnotation(selectedAnnotationId)?.title ===
            getSelectedAnnotation().title && (
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
                className="btn btn-primary"
                onClick={() => {
                  if (
                    window.confirm(
                      "Do you want to merge this annotation with the next one?"
                    )
                  )
                    mergeAnnotation();
                }}
              >
                Merge
              </button>
            </div>
          )}
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
            stringToSecondsFormat(getSelectedAnnotation().duration.end.time) -
            stringToSecondsFormat(getSelectedAnnotation().duration.start.time)
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
                  stringToSecondsFormat(
                    getSelectedAnnotation().duration.start.time
                  )) /
                  (stringToSecondsFormat(
                    getSelectedAnnotation().duration.end.time
                  ) -
                    stringToSecondsFormat(
                      getSelectedAnnotation().duration.start.time
                    ))) *
                  100}%`
              }}
            ></div>
          </div>
          <div id="sub-annotations"></div>
        </AnnotationsVis>
        {selectedAnnotationState === "showSubAnnotations&Edit" &&
          getSelectedSubAnnotation() != undefined && (
            <div>
              <AnnotationBox
                selectedAnnotationId={selectedSubAnnotationId}
                boxStyle={{
                  border: "3px solid",
                  width: "500px",
                  backgroundColor: "white"
                }}
                windowWidth={windowWidth}
              >
                <AnnotationEditForm
                  getCurrentTime={props.player.getCurrentTime}
                  selectedAnnotation={getSelectedSubAnnotation()}
                  update={updateSubAnnotations}
                  annotationTitles={props.annotationsTitle.subAnnotations}
                  key={selectedSubAnnotationId}
                  annotationNavigation={{
                    getNextAnnotation: getNextSubAnnotation,
                    getPreviousAnnotation: getPreviousSubAnnotation
                  }}
                  onAnnotationClick={onSubAnnotationClick}
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
                    onClick={() => {
                      if (window.confirm("Delete this annotation?"))
                        deleteSubAnotation();
                    }}
                  >
                    Delete sub-annotation
                  </button>
                </div>
              </AnnotationBox>
            </div>
          )}
        {selectedAnnotationState === "showSubAnnotations&Add" && (
          <AnnotationAddForm
            player={props.player}
            addNewSubAnnotation={addNewSubAnnotation}
            annotationTitles={props.annotationsTitle.subAnnotations}
            newAnnotationId={`${selectedAnnotationId}_${
              getSelectedAnnotation().subAnnotations.length
            }_${Math.floor(Math.random(10) * 10000)}`}
            defaultStartTime={
              getSelectedSubAnnotation()?.duration.end.time ??
              getSelectedAnnotation().duration.start.time
            }
            annotationDefualtLength={stringToSecondsFormat(
              getSelectedAnnotation().duration.end.time
            )}
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
            gridColumnEnd: "span 2",
            gridRowStart: "2",
            gridRowEnd: "2",
            alignSelf: "flex-start",
            justifySelf: "start"
          }}
        >
          <AnnotationsTitles
            key={getSelectedAnnotation()}
            titles={annotationTitles.current}
            selectedTitle={getSelectedAnnotation()?.title}
            colorScheme={props.colorScheme.mainColor}
            annotations={props.annotations}
            totalTime={props.videoLength}
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
              // changeSelectedAnnotationId(null);
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
          {selectedAnnotationState !== "showAnnotations&Add" &&
            selectedAnnotationId !== null && (
              <div
                onClick={() => {
                  if (selectedAnnotationState.startsWith("showSubAnnotation")) {
                    changeSelectedAnnotationState("showAnnotations&Edit");
                  }
                }}
              >
                {getSelectedAnnotation() != undefined && (
                  <AnnotationBox
                    selectedAnnotationId={selectedAnnotationId}
                    boxStyle={
                      selectedAnnotationState.startsWith("showAnnotations")
                        ? {
                            border: "3px solid",
                            maxWidth: "500px",
                            backgroundColor: "white"
                          }
                        : { borderTop: "3px solid", left: "0px" }
                    }
                    windowWidth={windowWidth}
                    key={windowWidth}
                  >
                    {getAnnotationsSection()}
                  </AnnotationBox>
                )}
              </div>
            )}

          {selectedAnnotationState === "showAnnotations&Add" && (
            <AnnotationAddForm
              player={props.player}
              addNewSubAnnotation={addNewAnnotation}
              annotationTitles={props.annotationsTitle.annotations}
              newAnnotationId={
                (props.annotations.sort((a, b) => a.id - b.id)[
                  props.annotations.length - 1
                ]?.id ?? 10) + 1
              }
              defaultStartTime={
                getSelectedAnnotation()?.duration.end.time ??
                sortAnootations(props.annotations).pop()?.duration.end.time ??
                "0:00:00"
              }
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
                justifySelf: "start"
              }}
            >
              <AnnotationsTitles
                key={selectedSubAnnotationId}
                titles={subAnnotationTitles.current}
                selectedTitle={getSelectedSubAnnotation()?.title}
                colorScheme={props.colorScheme.secondColor}
                annotations={getSelectedAnnotation().subAnnotations}
                totalTime={getDurationInSeconds(
                  getSelectedAnnotation().duration.end.time,
                  getSelectedAnnotation().duration.start.time
                )}
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
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default AnnotationsPage;
