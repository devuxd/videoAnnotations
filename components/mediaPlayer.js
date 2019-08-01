import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import Tabs from "./tabs";
import AnnotationBox from "./annotationBox";
import VideoAuthor from "./videoAuthor";
import VideoInfo from "./videoInfo";
import AnnotationList from "./annotationList";
import VideoTitle from "./videoTitle";
import AnnotationPop from "./annotationPop";
import AnnotationVisual from "./annotationVisual";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faExpand,
  faVolumeMute,
  faVolumeUp,
  faAlignCenter
} from "@fortawesome/free-solid-svg-icons";
/**
 * MediaPlayer: component for embedding video and parent for all video function components
 */
export default class MediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.player;
    this.passedSeek.bind(this);
    this.state = { ready: false };
  }

  componentDidMount() {
    const tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onload = () => {
      this.player = new YT.Player("player");
      this.setState(state => {
        return { ready: true };
      });
    };
  }

  passedSeek = startTime => {
    this.player.seekTo(startTime, true);
  };

  render() {
    console.log(this.state.ready);
    return (
      <div>
        <div className="player-wrapper">
          <iframe
            id="player"
            type="text/html"
            width="950"
            height="550"
            src={this.props.vidURL + "?enablejsapi=1"}
            frameborder="0"
          ></iframe>
        </div>
        <div
          id="ann-tooltip"
          style={{
            display: "inline",
            position: "absolute",
            bottom: "60%",
            left: "45%",
            width: "600px"
          }}
        />
        <div
          style={{
            borderStyle: "solid",
            borderColor: "#DCDCDC",
            backgroundColor: "#DCDCDC",
            borderRadius: "2px",
            height: "10px"
          }}
        >
          <div
            id="ann-visual"
            style={{ bottom: "70px", display: "inline", position: "relative" }}
          >
            <AnnotationVisual
              passedSeek={this.passedSeek}
              searchQuery={this.props.searchQuery}
              videoElem={this.props.vidElem}
            />
          </div>
        </div>
        <div style={{ padding: "2%" }}>
          Showing annotations for tag: {this.props.searchQuery}
        </div>

        <div style={{ padding: "2%" }}>Current annotation(s) viewing:</div>

        <AnnotationPop
          passedSeek={this.passedSeek}
          videoElem={this.props.vidElem}
        />
        <br />
        <div>
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
            <div label="All Detailed Annotations">
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
            <div label="All Annotation Tags">
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
