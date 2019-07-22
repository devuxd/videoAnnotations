import React from "react";
import Router from "next/router";
import VideoList from "../components/videoList";
import Layouts from "./layouts";
import Navigation from "../components/navigation";

export default class search extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You searched for ${query}`);
    return { query };
  }

  constructor() {
    super();
    this.state = { annotations: [], query: null };
  }

  componentDidMount() {
    let LocalAnnotations = this.searchForAnnotation(
      this.props.query.annotation
    );
    this.setState({
      annotations: LocalAnnotations,
      query: this.props.query.annotation
    });
  }

  render() {
    return (
      <div style={{ fontFamily: "Lato" }}>
        <Layouts>
          <Navigation />
          <p style={{ paddingLeft: "5%" }}>
            You searched for : {this.state.query}
          </p>
          <br />
          <VideoList
            searchQuery={this.state.query}
            videoArray={this.state.annotations}
          />
          <br />
          <br />
          <br />
        </Layouts>
      </div>
    );
  }
  searchForAnnotation(annotation) {
    // Hard coded return values.
    return collection;
  }
}
