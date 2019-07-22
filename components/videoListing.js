import React from "react";
import Router from "next/router";
import AnnotationList from "../components/annotationList";
import { render } from "react-dom";
import VideoTitle from "../components/videoTitle.js";
import VideoInfo from "../components/videoInfo.js";

/**
 * VideoListing: component for each video for search result page
 */
class VideoListing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var videoElementFinal = this.props.videoElement;
    const videoId = videoElementFinal.VideoURL.replace("https://youtu.be/", "");
    const url =
      "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" +
      videoId;

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
          <div className="media">
            <div
              onClick={() =>
                // Router.push(`/posts/${videoId}/${this.props.searchQuery}`)
                Router.push({
                  pathname: "/posts/" + { videoId },
                  query: { object: videoElementFinal }
                })
              }
            >
              <img
                className="mr-3"
                style={{ width: "170px", cursor: "pointer" }}
                src={
                  "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"
                }
                alt="YouTube Thumbnail Goes Here"
              />
            </div>
            <div className="media-body">
              <div
                onClick={() =>
                  // Router.push(`/posts/${videoId}/${this.props.searchQuery}`)
                  Router.push({
                    pathname: "/posts/" + { videoId },
                    query: { object: videoElementFinal }
                  })
                }
              >
                <h6 className="mt-0" style={{ cursor: "pointer" }}>
                  <VideoTitle videoElem={videoElementFinal} />
                </h6>
              </div>

              {/* number of instances would be something like annotations(video.Annotations).filter(x === query).length */}

              <VideoInfo
                searchQuery={this.props.searchQuery}
                vidElem={videoElementFinal}
              />
            </div>
          </div>
          <div>
            <br />
            <AnnotationList
              videoElem={videoElementFinal}
              searchResult={true}
              videoID={null}
            />
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
