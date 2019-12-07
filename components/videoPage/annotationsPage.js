import React, { useState, useMemo } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnotationBox from "./allAnnotations/allAnnotationsTab";
import VideoInfo from "../shared/videoInfo";
import MainAnnotationsVis from "./allAnnotations/allAnnotationsVis";
import SubAnnotationsTab from "./subAnnotations/subAnnotationsTab";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */
function AnnotationsPage(props) {
  console.log(props);
  const [selectedTab, activateTab] = useState(0);
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const [activeAnnotationId, activateAnnotation] = useState(-1);
  const setSelectedAnnotation = (annotationObject, annotationVisElement) => {
    changeSelectedAnnotation({ ...annotationObject, annotationVisElement });
    activateAnnotation(annotationObject.id);
  };

  //this is a duplicate of the same function inside datasetPage/videos.js

  const subAnnotationTab = () => {
    if (activeAnnotationId === -1)
      return <>{/* <h4>Please select annotation first.</h4> */}</>;
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
      <div style={{ marginBottom: "-10px" }}>
        {useMemo(
          () => (
            <MainAnnotationsVis
              key={JSON.stringify(props.video.annotations)}
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
              //  tooltipId={"#ann-tooltip"}
            >
              <div
                id="video-annotations"
                style={{ bottom: "5px", display: "inline" }}
              ></div>
            </MainAnnotationsVis>
          ),
          [selectedAnnotation]
        )}
      </div>
      {subAnnotationTab()}
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
        {/* <TabPanel key="2">{subAnnotationTab()}</TabPanel> */}
      </Tabs>
    </>
  );
}
export default AnnotationsPage;
