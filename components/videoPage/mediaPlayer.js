import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AnnotationBox from "./annotationBox";
import VideoInfo from "../shared/videoInfo";
import Chart from "./chart";
import ReactPlayer from "react-player";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */
export default class MediaPlayer extends Component {
  constructor(props) {
    super(props);
  }
  ref = player => {
    this.player = player;
  };
  seekTo = seconds => {
    this.player.seekTo(seconds);
  };
  render() {
    return (
      <div
        style={{
          margin: "0 auto",
          height: "700px",
          maxWidth: "1250px"
        }}
      >
        <ReactPlayer
          url={`${this.props.vidURL}?enablejsapi=1`}
          ref={this.ref}
          controls={true}
          width="100%"
          height="100%"
        />

        <div
          id="ann-tooltip"
          style={{
            paddingTop: "1%",
            paddingLeft: "1.5%"
          }}
        >
          <div id="ann-visual" style={{ bottom: "8px" }}>
            <Chart
              annotations={this.props.video.Annotations}
              seekTo={this.seekTo}
              videoLength={
                this.props.video.VideoLength.hours * 3600 +
                this.props.video.VideoLength.minutes * 60 +
                this.props.video.VideoLength.seconds
              }
            />
          </div>
        </div>

        <p style={{ paddingLeft: "15%" }}>
          {" "}
          Hover over one the bars to view more information about that
          annotation!{" "}
        </p>
        <Tabs>
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
              {this.props.video.VideoTitle}
              {this.props.video.VideoAuthor}
              <br />
              <VideoInfo
                searchQuery={this.props.seaeorchQuery}
                vidElem={this.props.video}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              {this.props.video.Annotations.map(item => (
                <div>
                  {" "}
                  <AnnotationBox
                    passedSeek={this.passedSeek}
                    annElement={item}
                  />
                  <br />
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div>
    );
  }
}
