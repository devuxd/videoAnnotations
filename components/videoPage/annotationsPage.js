import React, { useState } from "react";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import AnnotationEditForm from "./allAnnotations/annotationEditForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import SubAnnotationEditForm from "./subAnnotations/subAnnotationEditForm";
import SubAnnotationsVis from "./subAnnotations/subAnnotationsVis";
import SubAnnotationAddForm from "./subAnnotations/subAnnotationAddForm";

//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  // keep track of the selected annotation and sub-annotation.
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const [selectedSubAnnotation, changeSelectedSubAnnotation] = useState(null);
  const [selectedAnnotationState, changeSelectedAnnotationState] = useState(
    "ideal"
  );
  const [subAnnotationTitles, changesubAnnotationTitles] = useState({});

  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    document.getElementById("video-annotations").scrollIntoView();

    changeSelectedAnnotationState("editAnnotation");
    changeSelectedAnnotation({ ...selectedAnnotation });
    props.player.seekTo(selectedAnnotation.start);

    if (selectedAnnotation.subAnnotations.length > 0) {
      changeSelectedSubAnnotation(
        selectedAnnotation.subAnnotations[0].annotations[0]
      );
      changesubAnnotationTitles(
        selectedAnnotation.subAnnotations.map(({ title }) => ({
          value: title,
          label: title
        }))
      );
    } else {
      changeSelectedSubAnnotation(null);
    }
  };
  // handel sub-annotation click
  const onSubAnnotationClick = newSelectedSubAnnotation => {
    props.player.seekTo(
      selectedAnnotation.start + newSelectedSubAnnotation.start
    );
    changeSelectedSubAnnotation(newSelectedSubAnnotation);
    changeSelectedAnnotationState("editSubAnnotation");
  };

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

    const newAnnotation = { ...selectedAnnotation, subAnnotations };
    changeSelectedAnnotation(newAnnotation);
    changeSelectedSubAnnotation(newSubAnnotation);
    props.updateAnnotations(newAnnotation);
  };

  // when one of the annotation updated -> propagate the update to the main state maintained by [videoId].js
  const updateSelectedAnnotation = newAnnotation => {
    changeSelectedAnnotation(newAnnotation);
    // props.updateAnnotations(newAnnotation);
  };

  // adding annotation start with only adding title and start time and then call editSubAnnotation to let the user continue
  const addNewSubAnnotation = newSubAnnotation => {
    console.log(newSubAnnotation);
    // need to add the id first
  };

  // this show up when an annotation got selected.
  const getEditAnnotation = () => {
    return (
      <>
        <style jsx>{`
          .box-annotation {
            position: relative;
            border-radius: 0.4em;
            border: 3px solid;
            padding: 5px;
            max-width: 800px;
            transition: all 1s;
          }
          .arrow-annotation {
            content: "";
            position: relative;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top: 0;
            margin-left: -20px;
            transition: left 0.5s;
          }
        `}</style>
        <div className="arrow-annotation" id="arrow-annotation"></div>

        <div
          className="box-annotation"
          name="box-annotation"
          id="box-annotation"
        >
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
              onClick={() => changeSelectedAnnotation("ideal")}
            >
              <FontAwesomeIcon style={{ width: "15px" }} icon={faWindowClose} />
            </button>
          </div>
          <AnnotationEditForm
            selectedAnnotation={selectedAnnotation}
            getCurrentTime={props.player.getCurrentTime}
            updateSelectedAnnotation={updateSelectedAnnotation}
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
              onClick={() => changeSelectedAnnotationState("editSubAnnotation")}
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
        </div>
      </>
    );
  };

  const getSubAnnotations = () => {
    return (
      <>
        <style jsx>{`
          .box-annotation-expanded {
            border-radius: 1.4em;
            border-top: 5px solid;
            padding: 5px;
            transition: all 1s;
          }
          .arrow-annotation {
            content: "";
            position: relative;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top: 0;
            margin-left: -20px;
            transition: left 0.5s;
          }
        `}</style>
        <div className="arrow-annotation" id="arrow-annotation"></div>

        <div
          className="box-annotation-expanded"
          name=""
          id="box-annotation-expanded"
        >
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
              onClick={() => changeSelectedAnnotationState("editAnnotation")}
            >
              <FontAwesomeIcon style={{ width: "15px" }} icon={faWindowClose} />
            </button>
          </div>
          <SubAnnotationsVis
            getCurrentTime={props.player.getCurrentTime}
            annotationLength={selectedAnnotation.end - selectedAnnotation.start}
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
        </div>

        {selectedAnnotationState === "editSubAnnotation" && (
          <SubAnnotationEditForm
            getCurrentTime={props.player.getCurrentTime}
            selectedSubAnnotation={selectedSubAnnotation}
            key={selectedAnnotation.id}
            updateSubAnnotations={updateSubAnnotations}
            selectedAnnotationStart={selectedAnnotation.start}
          />
        )}
        {selectedAnnotationState === "addSubAnnotation" && (
          <SubAnnotationAddForm
            getCurrentTime={props.player.getCurrentTime}
            addNewSubAnnotation={addNewSubAnnotation}
            selectedAnnotationStart={selectedAnnotation.start}
            subAnnotationTitles={subAnnotationTitles}
          />
        )}
      </>
    );
  };
  // show the annotation or the sub-annotation and never both
  const getAnnotationsSection = () => {
    if (selectedAnnotationState === "editAnnotation") {
      return getEditAnnotation();
    }
    return getSubAnnotations();
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
          style={{
            gridColumnStart: "2",
            gridColumnEnd: "2",
            gridRowStart: "1",
            gridRowEnd: "1"
          }}
        >
          <MainAnnotationsVis
            annotationData={props.formatedAnnotationData}
            getCurrentTime={props.player.getCurrentTime}
            videoLength={
              props.videoLength.hours * 3600 +
              props.videoLength.minutes * 60 +
              props.videoLength.seconds
            }
            onAnnotationClick={onAnnotationClick}
            divId={"#video-annotations"}
            key={JSON.stringify(selectedAnnotation)}
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
          {selectedAnnotation && getAnnotationsSection()}
        </div>
        {selectedAnnotationState.includes("SubAnnotation") && (
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
              {subAnnotationTitles.map(({ value }, index) => (
                <span
                  key={index}
                  className="badge badge-pill"
                  id={`${value}-badge`}
                  style={{ display: "block", marginBottom: "2px" }}
                >
                  {value}
                </span>
              ))}
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
                  changeSelectedAnnotationState("addSubAnnotation")
                }
                disabled={selectedAnnotationState === "addSubAnnotation"}
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
