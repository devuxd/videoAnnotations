import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnotationBox from "./AllAnnotations/annotationBox";
import VideoInfo from "../shared/videoInfo";
import MainAnnotationsVis from "./mainAnnotationsVis";
import SubAnnotationsTab from "./SubAnnotations/subAnnotationsTab";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */
function AnnotationsPage(props) {
  const [selectedTab, activateTab] = useState(0);
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);

  const setSelectedAnnotation = (annotationObject, annotationVisElement) => {
    changeSelectedAnnotation({ ...annotationObject, annotationVisElement });
    activateTab(2);
  };

  //this is a duplicate of the same function inside datasetPage/videos.js
  const uniqueAnnotation = Array.from(
    new Set(props.video.annotations.map(annotation => annotation.tags))
  );
  const subAnnotationTab = () => {
    if (selectedAnnotation == null)
      return (
        <>
          <h4>Please select annotation first.</h4>
        </>
      );
    return (
      <SubAnnotationsTab
        seekTo={props.player.seekTo_subAnnotations}
        currentTime={props.player.currentTime}
        selectedAnnotation={selectedAnnotation}
        annotationLength={selectedAnnotation.end - selectedAnnotation.start}
        key={selectedAnnotation.start}
        updateAnnotations={props.updateAnnotations}
      />
    );
  };
  return (
    <>
      <MainAnnotationsVis
        annotationData={props.formatedAnnotationData}
        seekTo={props.player.seekTo}
        currentTime={props.player.currentTime}
        annotationLength={
          props.video.videoLength.hours * 3600 +
          props.video.videoLength.minutes * 60 +
          props.video.videoLength.seconds
        }
        setSelectedAnnotation={setSelectedAnnotation}
        divId={"#video-annotations"}
        tooltipId={"#ann-tooltip"}
      >
        <div id="video-annotations" style={{ bottom: "8px" }}></div>
        <p
          className="card-text"
          id={`annotations-badges`}
          style={{ margin: "30px auto", maxWidth: "400px" }}
          disabled
        >
          {uniqueAnnotation.map((annotation, index) => (
            <span
              key={index}
              className="badge badge-pill"
              id={`${annotation}-badge`}
            >
              {annotation}
            </span>
          ))}
        </p>
      </MainAnnotationsVis>

      <Tabs
        selectedIndex={selectedTab}
        onSelect={tabIndex => activateTab(tabIndex)}
      >
        <TabList>
          <Tab key="0">General Information</Tab>
          <Tab key="1">All Annotations</Tab>
          <Tab key="2">Sub Annotations</Tab>
        </TabList>

        <TabPanel key="0">
          <div
            style={{
              borderStyle: "solid",
              borderColor: "#DCDCDC",
              backgroundColor: "#DCDCDC",
              borderRadius: "8px",
              paddingTop: "2%",
              paddingBottom: "1.3%",
              paddingLeft: "5%",
              paddingRight: "5%"
            }}
          >
            {props.video.videoTitle}
            {props.video.videoAuthor}
            <br />
            <VideoInfo vidElem={props.video} />
          </div>
        </TabPanel>
        <TabPanel key="1">
          <div>
            {props.video.annotations.map((item, index) => (
              <div key={index}>
                <AnnotationBox
                  passedSeek={props.player.seekTo}
                  annElement={item}
                />
                <br />
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel key="2">{subAnnotationTab()}</TabPanel>
      </Tabs>
    </>
  );
}
export default AnnotationsPage;
