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
  let YTplayer,
    selectedAnnotation,
    videoId = props.video.Id;
  const [selectedTab, activiateTab] = useState(2);
  const ref = player => {
    YTplayer = player;
  };
  const seekTo = annotation => {
    YTplayer.seekTo(annotation.start);
    selectedAnnotation = annotation;
    console.log(selectedAnnotation);
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
      />

      <MainAnnotations
        annotations={props.video.Annotations}
        seekTo={seekTo}
        currentTime={currentTime}
        videoLength={
          props.video.VideoLength.hours * 3600 +
          props.video.VideoLength.minutes * 60 +
          props.video.VideoLength.seconds
        }
      />

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
          <SubAnnotations currentTime={currentTime} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
export default VideoPage;
