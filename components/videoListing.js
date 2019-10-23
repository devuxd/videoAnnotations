import React from "react";
import AnnotationList from "./annotationList";
import VideoInfo from "./videoInfo";
/**
 * VideoListing: component for each video for search result page
 */
class VideoListing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let video = this.props.video;
    console.log(video);
    const videoId = video.VideoURL.replace("https://youtu.be/", "");

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
            <div>
              <img
                className="mr-3"
                style={{ width: "170px" }}
                src={
                  "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"
                }
                alt="YouTube Thumbnail Goes Here"
              />
            </div>
            <div className="media-body">
              <div>
                <h3 className="mt-0" style={{}}>
                  {video.VideoTitle}
                </h3>
              </div>

              {/* number of instances would be something like annotations(video.Annotations).filter(x === query).length */}

              <VideoInfo vidElem={video} />
            </div>
          </div>
          <div>
            <br />
            <AnnotationList
              video={video}
              videoId={videoId}
              sheetId={this.props.sheetId}
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
