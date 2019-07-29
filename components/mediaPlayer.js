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
    this.state = {
      playing: false,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      videoElem: null,
      videoID: null
    };
  }

  componentWillMount() {
    this.setState({
      videoElem: this.props.vidElem,
      videoID: this.props.videoID
    });
  }

  /**
   * Following functions for adding functionality to video controls
   */

  playPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
    if (!this.state.playing) {
      this.setState({ playing: true });
    }
  };

  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value), "fraction");
  };

  onProgress = state => {
    console.log("onProgress", state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  };

  ref = player => {
    this.player = player;
  };

  passedSeek = x => {
    this.player.seekTo(x, "seconds");
    if (!this.state.playing) {
      this.setState({ playing: true });
    }
  };

  render() {
    return (
      <div>
        Showing annotation: {this.props.searchQuery}
        <br />
        <div className="player-wrapper">
          <ReactPlayer
            ref={this.ref}
            className="react-player"
            url={this.props.vidURL}
            playing={this.state.playing}
            volume={this.state.volume}
            muted={this.state.muted}
            onSeek={e => console.log("onSeek", e)}
            onProgress={this.onProgress}
          />
        </div>
        <div
          style={{
            borderStyle: "solid",
            borderColor: "#DCDCDC",
            backgroundColor: "#DCDCDC",
            borderRadius: "8px",
            height: "60px"
          }}
        >
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={this.playPause}
          >
            {this.state.playing ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ display: "inline" }}>
            <div
              style={{ zIndex: "1", display: "inline", position: "relative" }}
            >
              <input
                style={{ width: "65%" }}
                type="range"
                min={0}
                max={1}
                step="any"
                value={this.state.played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp}
              />
            </div>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={this.toggleMuted}
          >
            {this.state.muted ? (
              <FontAwesomeIcon icon={faVolumeMute} />
            ) : (
              <FontAwesomeIcon icon={faVolumeUp} />
            )}
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input
            style={{ width: "10%" }}
            type="range"
            min={0}
            max={1}
            step="any"
            value={this.state.volume}
            onChange={this.setVolume}
          />
          <div
            id="ann-visual"
            style={{ bottom: "17px", display: "inline", position: "relative" }}
          >
            <AnnotationVisual
              passedSeek={this.passedSeek}
              searchQuery={this.props.searchQuery}
              videoElem={this.props.vidElem}
            />
          </div>
        </div>
        <div
          id="ann-tooltip"
          style={{ position: "absolute", right: "400px", width: "700px" }}
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
                <VideoTitle videoElem={this.state.videoElem} />
                <VideoAuthor videoElem={this.state.videoElem} />
                <br />
                <VideoInfo
                  searchQuery={this.state.seaeorchQuery}
                  vidElem={this.state.videoElem}
                />
              </div>
            </div>
            <div label="All Detailed Annotations">
              <div>
                {this.state.videoElem.Annotations.map(item => (
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
                videoElem={this.state.videoElem}
                searchResult={false}
                videoID={this.state.videoID}
              />
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}
