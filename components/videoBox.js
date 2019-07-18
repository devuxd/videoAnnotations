import React from "react";
import Router from "next/router";
import VideoTitle from "../components/videoTitle.js";
import MediaPlayer from "../components/mediaPlayer.js";

/**
 * VideoBox: component for holding video box in each video post page
 */
export default class VideoBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoElement: this.props.video,
      isLoaded: false,
      videoId: this.props.video.VideoURL.replace("https://youtu.be/", ""),
      searchQuery: this.props.searchQuery
    };
  }

  componentDidMount() {
    if (this.state.isLoaded === false) {
      let videoProp = this.props.video;
      let searchProp = this.props.searchQuery;
      let vidID = this.props.video.VideoURL.replace("https://youtu.be/", "");
      this.setState({
        videoElement: videoProp,
        isLoaded: true,
        videoId: vidID,
        searchQuery: searchProp
      });
    }
  }

  render() {
    let videoID = this.state.videoId;

    return (
      <div className="row">
        <div className="col-sm" />
        <div
          className="col-lrg"
          style={{
            paddingRight: "8%",
            paddingLeft: "8%",
            borderColor: "lightgray",
            borderStyle: "solid",
            borderRadius: "8px"
          }}
        >
          <br />
          <div
            onClick={() =>
              Router.push(`/posts/${videoID}/${this.state.searchQuery}`)
            }
          >
            <h3 class="mt-0" style={{ cursor: "pointer" }}>
              <VideoTitle videoElem={this.state.videoElement} />
            </h3>
          </div>

          <MediaPlayer
            searchQuery={this.state.searchQuery}
            vidElem={this.state.videoElement}
            videoID={videoID}
            vidURL={"https://www.youtube.com/embed/" + videoID}
          />

          <br />
          <br />
          <br />
          <br />
        </div>
        <div className="col-sm" />
      </div>
    );
  }
}
