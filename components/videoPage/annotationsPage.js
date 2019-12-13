import React, { useState, useMemo } from "react";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import SubAnnotationEditForm from "./subAnnotations/SubAnnotationEditForm";
import SubAnnotationsVis from "./subAnnotations/subAnnotationsVis";

//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  // keep track of the selected annotation and sub-annotation.
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const [selectedSubAnnotation, changeSelectedSubAnnotation] = useState(null);

  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    document.getElementById("nav-bar").scrollIntoView();
    changeSelectedAnnotation({ ...selectedAnnotation });
    props.player.seekTo(selectedAnnotation.start);
    changeSelectedSubAnnotation(null);
  };
  const onSubAnnotationClick = selectedSubAnnotation => {
    props.player.seekTo(selectedAnnotation.start + selectedSubAnnotation.start);
    changeSelectedSubAnnotation(selectedSubAnnotation);
    document.getElementById("box-sub-annotation").scrollIntoView();
  };
  // when one of the sub-annotation updated -> propagate this update to the main state maintained by [videoId].s
  const updateSubAnnotations = newSubAnnotations => {
    console({ ...selectedAnnotation, newSubAnnotations });
    // props.updateAnnotations({ ...selectedAnnotation, newSubAnnotations });
  };

  const subAnnotations = () => {
    if (selectedAnnotation != null) {
      return (
        <>
          <SubAnnotationsVis
            getCurrentTime={props.player.getCurrentTime}
            annotationLength={selectedAnnotation.end - selectedAnnotation.start}
            divId={"#sub-annotations"}
            key={selectedAnnotation.id}
            subAnnotations={selectedAnnotation.subAnnotations}
            onSubAnnotationClick={onSubAnnotationClick}
          >
            <div
              id="sub-annotations"
              style={{ marginBottom: "-5px", marginTop: "-10px" }}
            ></div>
          </SubAnnotationsVis>
        </>
      );
    }
  };
  const subAnnotationForm = () => {
    if (selectedSubAnnotation != null) {
      return (
        <>
          <SubAnnotationEditForm
            getCurrentTime={props.player.getCurrentTime}
            selectedSubAnnotation={selectedSubAnnotation}
            key={selectedAnnotation.id}
            updateSubAnnotations={updateSubAnnotations}
          />
        </>
      );
    }
  };
  return (
    <>
      <style jsx>
        {`
          .allAnnotations-box {
            position: absolute;
            border-radius: 1.4em;
            border-top: 4px solid #d0d0d0;
            padding-top: 20px;
            display: none;
            margin-top: 10px;
          }

          .allAnnotations-arrow {
            content: "";
            position: absolute;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-bottom-color: #d0d0d0;
            border-top: 0;
            margin-left: -20px;
            margin-top: -20px;
            transition: left 0.3s;
          }
        `}
      </style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "85% 15%",
          gridTemplateRows: "30px 350px auto"
        }}
      >
        {" "}
        <div
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "1",
            gridRowStart: "1",
            gridRowEnd: "1"
          }}
        >
          {useMemo(
            () => (
              <MainAnnotationsVis
                annotationData={props.formatedAnnotationData}
                getCurrentTime={props.player.getCurrentTime}
                videoLength={
                  props.video.videoLength.hours * 3600 +
                  props.video.videoLength.minutes * 60 +
                  props.video.videoLength.seconds
                }
                onAnnotationClick={onAnnotationClick}
                divId={"#video-annotations"}
                tooltipId={"#ann-tooltip"}
              >
                <div id="video-annotations"></div>
              </MainAnnotationsVis>
            ),
            [selectedAnnotation]
          )}
        </div>
        <div
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "1",
            gridRowStart: "2",
            gridRowEnd: "2"
          }}
        >
          <div className="allAnnotations-box" id="allAnnotations-box">
            <div
              className="allAnnotations-arrow"
              id="allAnnotations-arrow"
            ></div>
            {subAnnotations()}
            {subAnnotationForm()}
          </div>
        </div>
        {selectedAnnotation && (
          <div
            style={{
              gridColumnStart: "2",
              gridColumnEnd: "2",
              gridRowStart: "2",
              gridRowEnd: "2",
              marginTop: "15px"
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
        )}
      </div>
    </>
  );
}
export default AnnotationsPage;
