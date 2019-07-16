import React from "react";
import Router from "next/router";
import Layouts from "./layouts.js";
import Navigation from "../components/navigation.js";
import VideoBox from "../components/videoBox.js";
import collection from "../API/db";

export default class Posts extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You selected for ${query}`);
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
    if (this.state.isLoaded === false) {
      let LocalVideo = this.searchForVideo(this.props.query.id);
      let localQuery = this.props.query.search;
      this.setState({
        video: LocalVideo,
        isLoaded: true,
        searchQuery: localQuery
      });
    }
  }

  /**
   * searchForVideo: function that returns video element of same id
   *                 assumes that each element in array has its own video id
   *
   * @param {*} id: video id searching for
   */
  searchForVideo(id) {
    if (Array.isArray(collection)) {
      return collection.filter(
        item => item.VideoURL.replace("https://youtu.be/", "") === id
      )[0];
    }
  }

  render() {
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
}
