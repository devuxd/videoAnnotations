import React from "react";
import Router from "next/router";
import SearchBar from "./searchBar.js";
import FileUpload from "./fileUpload.js";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.annotation = React.createRef();
  }

  render() {
    return (
      <div className="container" style={{ padding: "15%" }}>
        <div className="row">
          <div className="col-lrg">
            <a href="/">
              <img
                style={{
                  width: "70%",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                src="../static/observedev.png"
              />
            </a>
            <br />
            <p>Search for videos with specific annotations</p>
            <SearchBar annotation={this.annotation} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <FileUpload />
            <a href="/">Learn more about the JSON structure for annotations</a>
          </div>
        </div>
      </div>
    );
  }
}
