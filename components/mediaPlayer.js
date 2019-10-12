import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import Tabs from "./tabs";
import AnnotationBox from "./annotationBox";
import VideoAuthor from "./videoAuthor";
import VideoInfo from "./videoInfo";
import AnnotationList from "./annotationList";
import AnnotationVisual from "./annotationVisual";
import VideoTitle from "./videoTitle";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */
export default class MediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.player;
    this.passedSeek.bind(this);

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    setTimeout(() => {
      this.player = new YT.Player("player");
    }, 1000); // wait for the youtube script to download :(
  }

  passedSeek = startTime => {
    this.player.seekTo(startTime, true);
  };
  getCurrentDuration = () => {
    return this.player.getCurrentTime();
  };

  render() {
    if (typeof this.player === undefined) {
      return (
        <div>
          <div className="container">
            <div className="loader"></div>
          </div>
          <div className="container">
            Loading video...
            <br />
          </div>
          <style jsx>
            {`
              .container {
                height: 10em;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .loader {
                border: 16px solid #f3f3f3;
                border-radius: 50%;
                border-top: 16px solid gray;
                width: 120px;
                height: 120px;
                -webkit-animation: spin 2s linear infinite; /* Safari */
                animation: spin 2s linear infinite;
              }

              /* Safari */
              @-webkit-keyframes spin {
                0% {
                  -webkit-transform: rotate(0deg);
                }
                100% {
                  -webkit-transform: rotate(360deg);
                }
              }

              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      );
    }
    return (
      <div style={{}}>
        <div style={{ paddingLeft: "0%" }}>
          Showing annotations for tag: <b>{this.props.searchQuery}</b>
        </div>{" "}
        <br />
        <div className="player-wrapper">
          <iframe
            id="player"
            type="text/html"
            width="750"
            height="450"
            src={this.props.vidURL + "?enablejsapi=1"}
            frameborder="0"
          />
        </div>
        <div
          style={{
            // borderStyle: "solid",
            // borderColor: "#DCDCDC",
            // backgroundColor: "#DCDCDC",
            // borderRadius: "8px",
            height: "110px"
          }}
        >
          <div
            id="ann-tooltip"
            style={{
              display: "inline",
              position: "absolute",
              // bottom: "45%",
              // left: "35%",
              // width: "600px"
              paddingTop: "1%",
              paddingLeft: "1.5%"
            }}
          />
          <div
            id="ann-visual"
            style={{ bottom: "10px", display: "inline", position: "relative" }}
          >
            <AnnotationVisual
              passedSeek={this.passedSeek}
              searchQuery={this.props.searchQuery}
              videoElem={this.props.vidElem}
              getCurrentDuration={this.getCurrentDuration}
            />
          </div>
          <p style={{ paddingLeft: "15%" }}>
            {" "}
            Hover over one the bars to view more information about that
            annotation!{" "}
          </p>
        </div>
        <div style={{}}>
          <Tabs>
            <div label="General Information">
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
                <VideoTitle videoElem={this.props.vidElem} />
                <VideoAuthor videoElem={this.props.vidElem} />
                <br />
                <VideoInfo
                  searchQuery={this.props.seaeorchQuery}
                  vidElem={this.props.vidElem}
                />
              </div>
            </div>
            <div label="Detailed Annotations">
              <div>
                {this.props.vidElem.Annotations.map(item => (
                  <div>
                    <AnnotationBox
                      passedSeek={this.passedSeek}
                      annElement={item}
                    />
                    <br />
                  </div>
                ))}
              </div>
            </div>
            <div label>
              <AnnotationList
                videoElem={this.props.vidElem}
                searchResult={false}
                videoID={this.props.videoID}
              />
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}
