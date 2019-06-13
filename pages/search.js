import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import VideoList from "../components/videoList.js";
import Layouts from "./layouts";
//import Navigation from '../components/navigation.js';
// this line causing error: "Module not found"
// import { createRequireFromPath } from "module";

export default class search extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You searched for ${query}`);
    return { query };
  }
  render() {
    return (
      <div>
        <Layouts>{VideoList()}</Layouts>
      </div>
    );
  }
}
