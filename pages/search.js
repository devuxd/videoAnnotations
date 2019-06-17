import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import VideoList from "../components/videoList.js";
import Layouts from "./layouts";
import Navigation from "../components/navigation.js";
//import Navigation from '../components/navigation.js';
// this line causing error: "Module not found"
// import { createRequireFromPath } from "module";
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
          {VideoList(this.state.annotations)}
          <br />
          <br />
          <br />
          {/* Annotations : {JSON.stringify(this.state.annotations)} */}
        </Layouts>
      </div>
    );
  }
  searchForAnnotation(annotation) {
    // Hard coded return values.
    return collection;
  }
}
