import React from "react";
import Router from "next/router";
import Layouts from "../../../../components/layouts";
import Navigation from "../../../../components/navigation";
import VideoBox from "../../../../components/videoBox";
import { getvideData } from "../../../../API/db";

/**
 * Dynamic page for each individual video post page
 * Need to fix: routing for a url like "/posts/videoID"
 * currently only routes for a url like "/posts/videoID/annotation"
 */
export default class Posts extends React.Component {
  static async getInitialProps({ query }) {
    return { query };
  }

  constructor() {
    super();
    this.state = {
      video: null,
      searchQuery: null,
      isLoaded: false
    };
  }

  async componentDidMount() {
    const videoId = this.props.query.videoId;
    const annotation = this.props.query.annotation;
    const sheetId = this.props.query.sheetId;
    let video;
    try {
      video = await getvideData(videoId, sheetId);
      this.setState(
        {
          video: video,
          isLoaded: true,
          searchQuery: annotation,
          videoId: videoId
        },
        () => {}
      );
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * searchForVideo: function that returns video element of same id
   *                 assumes that each element in array has its own video id
   *
   * @param {*} id: video id searching for
   */
  searchForVideo(id, dataSet) {
    if (Array.isArray(dataSet)) {
      return dataSet.filter(
        item => item.VideoURL.replace("https://youtu.be/", "") === id
      )[0];
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div>
          <Layouts>
            <Navigation />
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
          </Layouts>
        </div>
      );
    }
    return (
      <div style={{ fontFamily: "Lato" }}>
        <Layouts>
          <Navigation />
          <VideoBox
            searchQuery={this.state.searchQuery}
            video={this.state.video}
            videoId={this.state.videoId}
          />
        </Layouts>
      </div>
    );
  }
}
