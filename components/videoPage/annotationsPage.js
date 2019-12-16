import React, { useState, useMemo, useEffect } from "react";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import AnnotationEditForm from "./allAnnotations/annotationEditForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SubAnnotationEditForm from "./subAnnotations/subAnnotationEditForm";
import SubAnnotationsVis from "./subAnnotations/subAnnotationsVis";
import { isObject } from "util";

//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  // keep track of the selected annotation and sub-annotation.
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const [selectedSubAnnotation, changeSelectedSubAnnotation] = useState(null);
  const [
    selectedAnnotationExpanded,
    changeSelectedAnnotationExpanded
  ] = useState(false);

  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    document.getElementById("video-annotations").scrollIntoView();
    changeSelectedAnnotationExpanded(false);
    changeSelectedAnnotation({ ...selectedAnnotation });
    props.player.seekTo(selectedAnnotation.start);

    if (selectedAnnotation.subAnnotations.length > 0) {
      changeSelectedSubAnnotation(
        selectedAnnotation.subAnnotations[0].annotations[0]
      );
    } else {
      changeSelectedSubAnnotation(null);
    }
  };
  const onSubAnnotationClick = newSelectedSubAnnotation => {
    props.player.seekTo(
      selectedAnnotation.start + newSelectedSubAnnotation.start
    );
    changeSelectedSubAnnotation(newSelectedSubAnnotation);
  };

  // when one of the sub-annotation updated -> propagate this update to the main state maintained by [videoId].js
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

  const subAnnotations = () => {
    if (selectedAnnotation != null) {
      if (selectedAnnotationExpanded == false) {
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
              .animation-expand-left {
                animation: mymove-left 1s infinite ease-in-out;
              }
              @keyframes mymove-left {
                0% {
                  padding-right: 0px;
                }
                25% {
                  padding-right: 2.5px;
                }
                50% {
                  padding-right: 5px;
                }
                75% {
                  padding-right: 2.5px;
                }
                100% {
                  padding-right: 0px;
                }
              }
              .animation-expand-right {
                animation: mymove-right 1s infinite ease-in-out;
              }

              @keyframes mymove-right {
                0% {
                  padding-left: 0px;
                }
                25% {
                  padding-left: 2.5px;
                }
                50% {
                  padding-left: 5px;
                }
                75% {
                  padding-left: 2.5px;
                }
                100% {
                  padding-left: 0px;
                }
              }
            `}</style>
            <div
              className="box-annotation"
              name="box-annotation"
              id="box-annotation"
            >
              <AnnotationEditForm
                selectedAnnotation={selectedAnnotation}
                expandAnnotation={changeSelectedAnnotationExpanded}
                getCurrentTime={props.player.getCurrentTime}
              />
              <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  alignContent: "center",
                  gridTemplateColumns: "20px 250px 20px",
                  height: "15px"
                }}
              >
                <p
                  className={"animation-expand-left"}
                  style={{ display: "inline-block", margin: "0 auto" }}
                >
                  <FontAwesomeIcon
                    style={{ width: "15px" }}
                    icon={faArrowLeft}
                  />
                </p>
                <a
                  href="#box-annotation"
                  className="badge badge-light"
                  type="link"
                  onClick={() => changeSelectedAnnotationExpanded(true)}
                >
                  Expand to sub-annotations
                </a>
                <p
                  className={"animation-expand-right"}
                  style={{ display: "inline-block", margin: "0 auto" }}
                >
                  <FontAwesomeIcon
                    style={{ width: "15px" }}
                    icon={faArrowRight}
                  />
                </p>
              </div>
            </div>
          </>
        );
      }
      return (
        <>
          <style jsx>{`
            .box-annotation-expanded {
              border-radius: 1.4em;
              border-top: 5px solid;
              padding: 5px;
              transition: all 1s;
            }
            .animation-expand-left {
              animation: mymove-left 1s infinite ease-in-out;
            }
            @keyframes mymove-left {
              0% {
                padding-right: 0px;
              }
              25% {
                padding-right: 2.5px;
              }
              50% {
                padding-right: 5px;
              }
              75% {
                padding-right: 2.5px;
              }
              100% {
                padding-right: 0px;
              }
            }
            .animation-expand-right {
              animation: mymove-right 1s infinite ease-in-out;
            }

            @keyframes mymove-right {
              0% {
                padding-left: 0px;
              }
              25% {
                padding-left: 2.5px;
              }
              50% {
                padding-left: 5px;
              }
              75% {
                padding-left: 2.5px;
              }
              100% {
                padding-left: 0px;
              }
            }
          `}</style>

          <div
            className="box-annotation-expanded"
            name=""
            id="box-annotation-expanded"
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
              <p
                className={"animation-expand-right"}
                style={{ display: "inline-block", margin: "0 auto" }}
              >
                <FontAwesomeIcon
                  style={{ width: "15px" }}
                  icon={faArrowRight}
                />
              </p>
              <a
                href="#video-annotations"
                className="badge badge-light"
                type="link"
                onClick={() => changeSelectedAnnotationExpanded(false)}
              >
                Collapse sub-annotations
              </a>
              <p
                className={"animation-expand-left"}
                style={{ display: "inline-block", margin: "0 auto" }}
              >
                <FontAwesomeIcon style={{ width: "15px" }} icon={faArrowLeft} />
              </p>
            </div>
            <SubAnnotationsVis
              getCurrentTime={props.player.getCurrentTime}
              annotationLength={
                selectedAnnotation.end - selectedAnnotation.start
              }
              divId={"#sub-annotations"}
              key={JSON.stringify(selectedAnnotation.subAnnotations)}
              subAnnotations={selectedAnnotation.subAnnotations}
              onSubAnnotationClick={onSubAnnotationClick}
              selectedSubAnnotation={selectedSubAnnotation}
            >
              <div id="sub-annotations" style={{ marginBottom: "-5px" }}></div>
            </SubAnnotationsVis>
          </div>

          <SubAnnotationEditForm
            getCurrentTime={props.player.getCurrentTime}
            selectedSubAnnotation={selectedSubAnnotation}
            key={selectedAnnotation.id}
            updateSubAnnotations={updateSubAnnotations}
            selectedAnnotationStart={selectedAnnotation.start}
          />
        </>
      );
    }
  };

  return (
    <>
      <style jsx>{`
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
            tooltipId={"#ann-tooltip"}
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
          <div className="arrow-annotation" id="arrow-annotation"></div>

          {subAnnotations()}
        </div>
        {selectedAnnotationExpanded && (
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
              {selectedAnnotation.subAnnotations.map(
                ({ annotations }, index) => (
                  <span
                    key={index}
                    className="badge badge-pill"
                    id={`${annotations[0].title}-badge`}
                    style={{ display: "block", marginBottom: "2px" }}
                  >
                    {annotations[0].title}
                  </span>
                )
              )}
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
                className="btn btn-outline-info btn-sm"

                // onClick={}
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
