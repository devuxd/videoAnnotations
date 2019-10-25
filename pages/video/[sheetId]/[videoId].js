import React from "react";
import Router from "next/router";
import Layouts from "../../../components/shared/layouts";
import VideoBox from "../../../components/videoPage/videoBox";
import MediaPlayer from "../../../components/videoPage/mediaPlayer";

import { getvideData } from "../../../API/db";

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
    const sheetId = this.props.query.sheetId;
    let video;
    try {
      video = await getvideData(videoId, sheetId);
      this.setState(
        {
          video: video,
          isLoaded: true,
          videoId: videoId
        },
        () => {}
      );
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div>
          <Layouts>
            <div>
              <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <a className="navbar-brand" style={{ width: "20%" }} href="/">
                  <img
                    style={{
                      width: "100%",
                      display: "block",
                      marginLeft: "1%",
                      marginRight: "0px",
                      marginBottom: "7%"
                    }}
                    src="https://i.ibb.co/JmfYfBD/observedev.png"
                  />
                </a>
              </nav>
              <br />
            </div>{" "}
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
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
              <a className="navbar-brand" style={{ width: "20%" }} href="/">
                <img
                  style={{
                    width: "100%",
                    display: "block",
                    marginLeft: "1%",
                    marginRight: "0px",
                    marginBottom: "7%"
                  }}
                  src="https://i.ibb.co/JmfYfBD/observedev.png"
                />
              </a>
            </nav>
            <br />
          </div>
          {/* <VideoBox video={this.state.video} videoId={this.state.videoId} /> */}
          <MediaPlayer
            video={this.state.video}
            videoID={this.state.videoId}
            vidURL={"https://www.youtube.com/embed/" + this.state.videoId}
          />
        </Layouts>
      </div>
    );
  }
}
