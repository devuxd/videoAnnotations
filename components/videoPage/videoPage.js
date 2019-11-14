import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnotationBox from "./AllAnnotations/annotationBox";
import VideoInfo from "../shared/videoInfo";
import MainAnnotationsVis from "./mainAnnotationsVis";
import ReactPlayer from "react-player";
import SubAnnotationsTab from "./SubAnnotations/subAnnotationsTab";
import moment from "moment";

/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */

function VideoPage(props) {
  let YTplayer;
  const [selectedTab, activateTab] = useState(0);
  const [YTplaying, YTpause] = useState(false);
  const [selectedAnnotation, changeSelectedAnnotation] = useState(null);
  const ref = player => {
    YTplayer = player;
  };
  const seekTo = seconds => {
    YTplayer.seekTo(seconds);
    YTpause(true);
  };
  const seekTo_subAnnotations = seconds => {
    YTplayer.seekTo(moment.duration(seconds).asSeconds());
    YTpause(true);
  };
  const setSelectedAnnotation = (annotationObject, annotationVisElement) => {
    changeSelectedAnnotation({ ...annotationObject, annotationVisElement });
    activateTab(2);
  };
  const getAnnotationData = annotations =>
    annotations.map((x, index) => {
      const obj = {
        start:
          Number(x.duration.start.hours) * 60 * 60 +
          Number(x.duration.start.minutes) * 60 +
          Number(x.duration.start.seconds),
        end:
          Number(x.duration.end.hours) * 60 * 60 +
          Number(x.duration.end.minutes) * 60 +
          Number(x.duration.end.seconds),
        id: x.id,
        tag: x.tags,
        annotation: x.description,
        duration: `${x.duration.start.hours}:${x.duration.start.minutes}:${x.duration.start.seconds} - ${x.duration.end.hours}:${x.duration.end.minutes}:${x.duration.end.seconds}`
      };
      const start = new moment(obj.start * 1000);
      const end = new moment(obj.end * 1000);
      const diff = moment.duration(end.diff(start));
      obj.totalTime = `${diff.hours()}:${diff.minutes()}:${diff.seconds()}`;
      return obj;
    });
  const currentTime = () => YTplayer.getCurrentTime();

  const updateAnnotations = annotation => {
    props.video.annotations.map(currentAnnotation =>
      currentAnnotation.id == annotation.id ? annotation : currentAnnotation
    );
    console.log(props.video.annotations);
    console.log(annotation);
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
        seekTo={seekTo_subAnnotations}
        currentTime={currentTime}
        selectedAnnotation={selectedAnnotation}
        annotationLength={selectedAnnotation.end - selectedAnnotation.start}
        key={selectedAnnotation.start}
        updateAnnotations={updateAnnotations}
      />
    );
  };
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
        playing={YTplaying}
      />

      <MainAnnotationsVis
        annotationData={getAnnotationData(props.video.annotations)}
        seekTo={seekTo}
        currentTime={currentTime}
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
          class="card-text"
          id={`annotations-badges`}
          style={{ margin: "30px auto", maxWidth: "400px" }}
          disabled
        >
          {uniqueAnnotation.map(annotation => (
            <span class="badge badge-pill" id={`${annotation}-badge`}>
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
            {props.video.videoTitle}
            {props.video.videoAuthor}
            <br />
            <VideoInfo searchQuery={props.searchQuery} vidElem={props.video} />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            {props.video.annotations.map(item => (
              <div>
                {" "}
                <AnnotationBox passedSeek={seekTo} annElement={item} />
                <br />
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel>{subAnnotationTab()}</TabPanel>
      </Tabs>
    </div>
  );
}
export default VideoPage;
