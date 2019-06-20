import React from "react";
import Router from "next/router";
import VideoList from "../components/videoList.js";
import Layouts from "./layouts";
import Navigation from "../components/navigation.js";
import collection from "../API/db";

export default class search extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You searched for ${query}`);
    return { query };
  }
  constructor() {
    super();
    this.state = { annotations: [] };
  }
  componentDidMount() {
    let LocalAnnotations = this.searchForAnnotation(
      this.props.query.annotation
    );
    this.setState({ annotations: LocalAnnotations });
  }

  // eventually put in .filter depending on annotation entered
  render() {
    return (
      <div>
        <Layouts>
          <Navigation />
          <p style={{ paddingLeft: "5%" }}>
            You searched for : {JSON.stringify(this.props.query.annotation)}
          </p>
          <br />
          <br />
          <VideoList videoArray={this.state.annotations} />
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
