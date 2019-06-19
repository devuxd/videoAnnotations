import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import AnnotationList from "../components/annotationList";
import { render } from "react-dom";

/**
 * VideoListing: component for each video
 */
class VideoListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { videoTitle: undefined, isLoading: false, stateError: null };
  }

  /**
   * Making API request to noembed.com to retrieve video titles
   */
  componentDidMount() {
    var videoElementFinal = this.props.videoElement;
    const videoId = videoElementFinal.VideoURL.replace("https://youtu.be/", "");
    const url =
      "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" +
      videoId;

    this.setState({ isLoading: true });

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Oops! We weren't able to get the video title!");
        }
      })
      .then(data => this.setState({ videoTitle: data.title, isLoading: false }))
      .catch(error => this.setState({ stateError: error, isLoading: false }));
  }

  render() {
    var videoElementFinal = this.props.videoElement;
    const videoId = videoElementFinal.VideoURL.replace("https://youtu.be/", "");
    const url =
      "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" +
      videoId;

    const { hits, isLoading, error } = this.state;
    if (error) {
      return <p>Oops! Something went wrong!</p>;
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <div
          style={{
            paddingTop: "2%",
            paddingBottom: "1.3%",
            paddingLeft: "5%",
            paddingRight: "5%",
            borderStyle: "solid",
            borderColor: "lightgray",
            borderRadius: "8px"
          }}
        >
          <div class="media">
            <a href={"/" + videoId}>
              <img
                class="mr-3"
                style={{ width: "170px" }}
                src={
                  "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"
                }
                alt="YouTube Thumbnail Goes Here"
              />
            </a>
            <div class="media-body">
              <h6 class="mt-0">
                <a href={"/" + videoId}>{this.state.videoTitle}</a>
              </h6>

              {/* number of instances would be something like annotations(video.Annotations).filter(x === query).length */}
              <h7>
                Instances: 2 <br />
                Total Time: {videoElementFinal.VideoLength.hours}:
                {videoElementFinal.VideoLength.minutes}:
                {videoElementFinal.VideoLength.seconds}
              </h7>
            </div>
          </div>
          <div>
            <br />
            <AnnotationList videoAnnotations={videoElementFinal.Annotations} />
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default VideoListing;
