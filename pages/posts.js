import React from "react";
import Router from "next/router";
import Layouts from "./layouts";
import Navigation from "../components/navigation";
import VideoBox from "../components/videoBox";

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
      isLoaded: false,
      searchQuery: null
    };
  }

  componentWillMount() {
    console.log(this.props.query);
    if (this.state.isLoaded === false) {
      let localVideo = JSON.parse(this.props.query.videoElementFinal);
      let localQuery = this.props.query.tag;
      // console.log(this.props.query.tag)
      this.setState(
        {
          video: localVideo,
          isLoaded: true,
          searchQuery: localQuery
        },
        () => {
          console.log(this.state);
        }
      );
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
    console.log(this.state.video);
    return (
      <div style={{ fontFamily: "Lato" }}>
        <Layouts>
          <Navigation />
          <VideoBox
            searchQuery={this.state.searchQuery}
            video={this.state.video}
          />
        </Layouts>
      </div>
    );
  }
  // render() {
  //   return <div> </div>;
  // }
}
