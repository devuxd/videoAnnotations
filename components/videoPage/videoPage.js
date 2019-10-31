import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnotationBox from "./annotationBox";
import VideoInfo from "../shared/videoInfo";
import MainAnnotations from "./mainAnnotations";
import ReactPlayer from "react-player";
import SubAnnotations from "./subAnnotations";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */

function VideoPage(props) {
  let YTplayer;
  const [selectedTab, activiateTab] = useState(2);
  const [YTplayering, YTpaus] = useState(false);
  const [selectedAnnotation, changeSelectedAnnotaion] = useState({
    start: 0,
    end: 0,
    Tags: "",
    Description: "",
    annotationIndex: ""
  });
  const ref = player => {
    YTplayer = player;
  };
  const seekTo = annotation => {
    YTplayer.seekTo(annotation.start);
    changeSelectedAnnotaion(annotation);
    YTpaus(true);
  };
  const currentTime = () => YTplayer.getCurrentTime();
  return (
    <div
      style={{
        margin: "0 auto",
        height: "700px",
        maxWidth: "1250px"
      }}
    >
      <ReactPlayer
        url={`${props.vidURL}?enablejsapi=1`}
        ref={ref}
        controls={true}
        width="100%"
        height="100%"
        playing={YTplayering}
      />

      <MainAnnotations
        annotations={props.video.Annotations}
        seekTo={seekTo}
        currentTime={currentTime}
        annotationLength={
          props.video.VideoLength.hours * 3600 +
          props.video.VideoLength.minutes * 60 +
          props.video.VideoLength.seconds
        }
        divId={"#video-annotations"}
        tooltipId={"#ann-tooltip"}
      >
        <div id="video-annotations" style={{ bottom: "8px" }}></div>
      </MainAnnotations>

      <Tabs
        selectedIndex={selectedTab}
        onSelect={tabIndex => activiateTab(tabIndex)}
      >
        <TabList>
          <Tab>General Information</Tab>
          <Tab>All Annotations</Tab>
          <Tab>Sub Annotations</Tab>
        </TabList>

        <TabPanel>
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
            {props.video.VideoTitle}
            {props.video.VideoAuthor}
            <br />
            <VideoInfo
              searchQuery={props.seaeorchQuery}
              vidElem={props.video}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            {props.video.Annotations.map(item => (
              <div>
                {" "}
                <AnnotationBox passedSeek={seekTo} annElement={item} />
                <br />
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <SubAnnotations
            seekTo={seekTo}
            currentTime={currentTime}
            selectedAnnotation={selectedAnnotation}
            annotationLength={selectedAnnotation.end - selectedAnnotation.start}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
export default VideoPage;
