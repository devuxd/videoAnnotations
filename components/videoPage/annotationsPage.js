import React, { useState, useEffect } from "react";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import AnnotationEditForm from "./shared/annotationEditForm";
import SubAnnotationsVis from "./subAnnotations/subAnnotationsVis";
import SubAnnotationAddForm from "./subAnnotations/subAnnotationAddForm";
import AnnotationsTitles from "./shared/annotationsTitles";
import { secondColor, mainColor } from "../../API/color";
import AnnotationBox from "./shared/annotationsBox";

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
      selectedAnnotation?.subAnnotations.map(({ title }) => title)
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
  // ***

  // *** Click handlers
  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    document.getElementById("video-annotations").scrollIntoView();

    changeSelectedAnnotationState("showAnnotations&Edit");
    changeSelectedAnnotation(selectedAnnotation);
    props.player.seekTo(selectedAnnotation.start);
  };

  // handel sub-annotation click
  const onSubAnnotationClick = newSelectedSubAnnotation => {
    props.player.seekTo(
      selectedAnnotation.start + newSelectedSubAnnotation.start
    );
    changeSelectedSubAnnotation(newSelectedSubAnnotation);
    changeSelectedAnnotationState("showSubAnnotations&Edit");
  };
  // ***

  // when one of the sub-annotation updated -> propagate this update to local state and the main state maintained by [videoId].js
  const updateSubAnnotations = newSubAnnotation => {
    const subAnnotations = selectedAnnotation.subAnnotations.map(
      subAnnotation => {
        if (subAnnotation.title === newSubAnnotation.title) {
          const annotations = subAnnotation.annotations.map(subAnnotation =>
            subAnnotation.id === newSubAnnotation.id
              ? newSubAnnotation
              : subAnnotation
          );
          return { ...subAnnotation, annotations };
        } else {
          return subAnnotation;
        }
      }
    );
    saveSubAnnotationChange(subAnnotations, newSubAnnotation);
  };

  // when one of the annotation updated -> propagate the update to the main state maintained by [videoId].js
  const updateSelectedAnnotation = newAnnotation => {
    const { subAnnotations } = selectedAnnotation;

    props.updateAnnotations({ ...newAnnotation, subAnnotations });
  };

  // adding annotation start with only adding title and start time and then call editSubAnnotation to let the user continue
  const addNewSubAnnotation = newSubAnnotation => {
    const { subAnnotations } = selectedAnnotation;
    let hasUpdated = false;
    let localSubAnnotation;
    let updatedSubAnnotations = subAnnotations.map(subAnnotation => {
      if (subAnnotation.title === newSubAnnotation.title) {
        hasUpdated = true;
        localSubAnnotation = {
          ...newSubAnnotation,
          id: subAnnotation.title + subAnnotation.annotations.length
        };
        return {
          ...subAnnotation,
          annotations: [...subAnnotation.annotations, localSubAnnotation]
        };
      } else {
        return subAnnotation;
      }
    });
    if (!hasUpdated) {
      localSubAnnotation = {
        ...newSubAnnotation,
        id: newSubAnnotation.title + 0
      };
      updatedSubAnnotations = [
        ...subAnnotations,
        { title: newSubAnnotation.title, annotations: [localSubAnnotation] }
      ];
    }
    saveSubAnnotationChange(updatedSubAnnotations, localSubAnnotation);
    changeSelectedAnnotationState("showSubAnnotations&Edit");
  };

  const saveSubAnnotationChange = (subAnnotations, newSubAnnotation) => {
    const newAnnotation = { ...selectedAnnotation, subAnnotations };
    changeSelectedAnnotation(newAnnotation);
    changeSelectedSubAnnotation(newSubAnnotation);
    props.updateAnnotations(newAnnotation);
  };
  // show the annotation or the sub-annotation and never both
  const getAnnotationsSection = () => {
    if (selectedAnnotationState.startsWith("showAnnotations"))
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
                  height: "0px",
                  border: "0px",
                  color: "darkred",
                  position: "relative",
                  bottom: "12px",
                  left: "10px",
                  outline: "0px"
                }}
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
                justifyContent: "center"
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
          </>
        )}
      </>
    );
  };

  const getSubAnnotations = () => {
    const boxElement = document.getElementById("box-annotation");
    debugger;
    boxElement.style.borderBottom = "0px";
    boxElement.style.borderRight = "0px";
    boxElement.style.borderLeft = "0px";

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
              height: "0px",
              border: "0px",
              color: "darkred",
              position: "relative",
              bottom: "12px",
              outline: "0px"
            }}
            onClick={() =>
              changeSelectedAnnotationState("showAnnotations&Edit")
            }
          >
            <FontAwesomeIcon style={{ width: "15px" }} icon={faWindowClose} />
          </button>
        </div>
        <SubAnnotationsVis
          getCurrentTime={props.player.getCurrentTime}
          annotationLength={
            selectedAnnotation.duration.end.inSeconds -
            selectedAnnotation.duration.start.inSeconds
          }
          divId={"#sub-annotations"}
          key={JSON.stringify(selectedAnnotation.subAnnotations)}
          subAnnotations={selectedAnnotation.subAnnotations}
          onSubAnnotationClick={onSubAnnotationClick}
          selectedSubAnnotation={selectedSubAnnotation}
        >
          <div
            id="sub-annotations"
            style={{ marginBottom: "-5px", marginTop: "10px" }}
          ></div>
        </SubAnnotationsVis>

        {selectedAnnotationState === "showSubAnnotations&Edit" && (
          <AnnotationEditForm
            getCurrentTime={props.player.getCurrentTime}
            selectedSubAnnotation={selectedSubAnnotation}
            key={selectedAnnotation.id}
            updateSubAnnotations={updateSubAnnotations}
            selectedAnnotationStart={
              selectedAnnotation.duration.start.inSeconds
            }
          />
        )}
        {selectedAnnotationState === "showSubAnnotations&Add" && (
          <SubAnnotationAddForm
            getCurrentTime={props.player.getCurrentTime}
            addNewSubAnnotation={addNewSubAnnotation}
            selectedAnnotationStart={
              selectedAnnotation.duration.start.inSeconds
            }
            subAnnotationTitles={subAnnotationTitles}
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
          <MainAnnotationsVis
            annotationData={props.annotations}
            getCurrentTime={props.player.getCurrentTime}
            videoLength={props.videoLength}
            onAnnotationClick={onAnnotationClick}
            divId={"#video-annotations"}
            key={JSON.stringify(props.annotations)}
            selectedAnnotation={selectedAnnotation}
          >
            <div id="video-annotations" name="video-annotations"></div>
          </MainAnnotationsVis>
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
            // onClick={}
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
              selectedAnnotationId={
                selectedAnnotation.title + selectedAnnotation.id
              }
            >
              {getAnnotationsSection()}
            </AnnotationBox>
          )}

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
                  disabled={
                    selectedAnnotationState === "showSubAnnotations&Add"
                  }
                >
                  Add sub-annotation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default AnnotationsPage;
