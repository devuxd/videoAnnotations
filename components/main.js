import React from "react";
import Router from "next/router";
import SearchBar from "./searchBar";
import FileUpload from "./fileUpload";

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
            {/* <p>Search for videos with specific annotations</p>
            <SearchBar annotation={this.annotation} /> */}
            <br />
            <br />
            <br />
            <p>
              Upload your video dataset here! Enter your spreadsheet ID below to
              continue:
            </p>
            <FileUpload />
            <a
              target="_blank"
              href="https://docs.google.com/spreadsheets/d/1GBxfQqTuIwyj_ExmC_ct0wUxRqmoWjvfq8ibZsF2t60/edit?usp=sharing"
            >
              Please use this template for your dataset
            </a>
          </div>
        </div>
      </div>
    );
  }
}
