import React, { useState, useMemo } from "react";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import SubAnnotationForm from "./subAnnotations/SubAnnotationForm";
import SubAnnotationsVis from "./subAnnotations/subAnnotationsVis";

//    ===  ===  ===== =====     <- these are the annotations.
//    ^                         <- this this the selected annotation
//    ==== ====== ===== =====   <- these are the sub-annotations related to the selected annotation.
//           ^                  <- this is the selected sub-annotation.

function AnnotationsPage(props) {
  debugger;
  // keep track of the selected annotation and sub-annotation.
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const [selectedSubAnnotation, changeSelectedSubAnnotation] = useState(null);

  // handel the click on annotation and sub-annotation
  const onAnnotationClick = selectedAnnotation => {
    changeSelectedAnnotation({ ...selectedAnnotation });
    props.player.seekTo(selectedAnnotation.start);
  };
  const onSubAnnotationClick = selectedSubAnnotation => {
    props.player.seekTo(selectedAnnotation.start + selectedSubAnnotation.start);
    changeSelectedSubAnnotation(selectedSubAnnotation);
  };
  // when one of the sub-annotation updated -> propagate this update to the main sate maintained by [videoId].s
  const updateSubAnnotations = newSubAnnotations =>
    props.updateAnnotations({ ...selectedAnnotation, newSubAnnotations });

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
              style={{ bottom: "8px", marginTop: "-10px" }}
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
          <SubAnnotationForm
            getCurrentTime={props.player.getCurrentTime}
            selectedSubAnnotation={selectedSubAnnotation}
            annotationLength={selectedAnnotation.end - selectedAnnotation.start}
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
            position: relative;
            border-radius: 1.4em;
            border-top: 4px solid #d0d0d0;
            padding: 20px;
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
      <div>
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
            >
              <div id="video-annotations"></div>
            </MainAnnotationsVis>
          ),
          [selectedAnnotation]
        )}
        <div className="allAnnotations-box">
          <div className="allAnnotations-arrow"></div>
          {subAnnotations()}
          {subAnnotationForm()}
        </div>
      </div>
    </>
  );
}
export default AnnotationsPage;
