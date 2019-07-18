import React from "react";
import Router from "next/router";
import VideoList from "../components/videoList.js";
import Layouts from "./layouts";
import Navigation from "../components/navigation.js";
import { collection, getDataset } from "../API/db";

export default class dataset extends React.Component {
  static async getInitialProps({ query }) {
    return { query };
  }

  constructor() {
    super();
    this.state = { dataSet: [], query: null };
  }

  // This function fetch the data from google sheet
  async componentDidMount() {
    let localDataSet = [];

    try {
      const payload = await getDataset(this.props.query.sheetId);
      // TODO: work to make the json structure look like the one we used before
      // let localDataSet = payload.map( video =>{ */ do the mapping here */});

      payload.sheets.map(function(video) {
        var videoJSON = {};
        if (
          typeof video.data[0].rowData[2].values[0].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.VideoTitle = "";
        } else {
          videoJSON.VideoTitle =
            video.data[0].rowData[2].values[0].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[1].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.VideoURL = "";
        } else {
          videoJSON.VideoURL =
            video.data[0].rowData[2].values[1].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[2].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.VideoLength = { hours: "" };
        } else {
          videoJSON.VideoLength = {
            hours:
              video.data[0].rowData[2].values[2].userEnteredValue.numberValue
          };
        }

        if (
          typeof video.data[0].rowData[2].values[3].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.VideoLength = { minutes: "" };
        } else {
          videoJSON.VideoLength = {
            minutes:
              video.data[0].rowData[2].values[3].userEnteredValue.numberValue
          };
        }

        if (
          typeof video.data[0].rowData[2].values[4].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.VideoLength = { seconds: "" };
        } else {
          videoJSON.VideoLength = {
            seconds:
              video.data[0].rowData[2].values[4].userEnteredValue.numberValue
          };
        }

        if (
          typeof video.data[0].rowData[2].values[5].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.ProgrammingLanguage = "";
        } else {
          videoJSON.ProgrammingLanguage =
            video.data[0].rowData[2].values[5].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[6].userEnteredValue ===
          "undefined"
        ) {
          videoJSON.ProgrammingTools = "";
        } else {
          videoJSON.ProgrammingTools =
            video.data[0].rowData[2].values[6].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[7] === "undefined" ||
          typeof video.data[0].rowData[2].values[7].userEnteredValue ===
            "undefined"
        ) {
          videoJSON.GithubURL = "";
        } else {
          videoJSON.GithubURL =
            video.data[0].rowData[2].values[7].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[8] === "undefined" ||
          typeof video.data[0].rowData[2].values[8].userEnteredValue ===
            "undefined"
        ) {
          videoJSON.ProjectSize = "";
        } else {
          videoJSON.ProjectSize =
            video.data[0].rowData[2].values[8].userEnteredValue.stringValue;
        }

        if (
          typeof video.data[0].rowData[2].values[9] === "undefined" ||
          typeof video.data[0].rowData[2].values[9].userEnteredValue ===
            "undefined"
        ) {
          videoJSON.DeveloperGithubURL = "";
        } else {
          videoJSON.DeveloperGithubURL =
            video.data[0].rowData[2].values[9].userEnteredValue.stringValue;
        }

        let localRowData = video.data[0].rowData;
        let annotationsData = localRowData.splice(10, localRowData.length);

        var annotationList = [];

        annotationsData.map(function(annotation) {
          var annotationJSON = {};

          annotationJSON.Duration = { start: {}, end: {} };

          if (typeof annotation.values[0].userEnteredValue === "undefined") {
            annotationJSON.Duration.start.hours = "";
          } else {
            annotationJSON.Duration.start.hours =
              annotation.values[0].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[1].userEnteredValue === "undefined") {
            annotationJSON.Duration.start.minutes = "";
          } else {
            annotationJSON.Duration.start.minutes =
              annotation.values[1].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[2].userEnteredValue === "undefined") {
            annotationJSON.Duration.start.seconds = "";
          } else {
            annotationJSON.Duration.start.seconds =
              annotation.values[2].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[3].userEnteredValue === "undefined") {
            annotationJSON.Duration.end.hours = "";
          } else {
            annotationJSON.Duration.end.hours =
              annotation.values[3].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[4].userEnteredValue === "undefined") {
            annotationJSON.Duration.end.minutes = "";
          } else {
            annotationJSON.Duration.end.minutes =
              annotation.values[4].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[5].userEnteredValue === "undefined") {
            annotationJSON.Duration.end.seconds = "";
          } else {
            annotationJSON.Duration.end.seconds =
              annotation.values[5].userEnteredValue.numberValue;
          }

          if (typeof annotation.values[6].userEnteredValue === "undefined") {
            annotationJSON.Tags = [];
          } else {
            annotationJSON.Tags = annotation.values[6].userEnteredValue.stringValue.split(
              ", "
            );
          }

          if (typeof annotation.values[7].userEnteredValue === "undefined") {
            annotationJSON.Description = "";
          } else {
            annotationJSON.Description =
              annotation.values[7].userEnteredValue.stringValue;
          }

          annotationList.push(annotationJSON);
        });

        videoJSON.Annotations = annotationList;

        localDataSet.push(videoJSON);
      });

      this.setState({ dataSet: localDataSet, query: this.props.query.sheetId });
    } catch (e) {
      console.error(e);
    }
    // let LocalAnnotations = this.searchForAnnotation(
    //   this.props.query.annotation
    // );
    // this.setState({
    //   annotations: localDataSet,
    //   query: this.props.query.sheetId
    // });
  }

  render() {
    return (
      <div style={{ fontFamily: "Lato" }}>
        <Layouts>
          <Navigation />
          <p style={{ paddingLeft: "5%" }}>
            You searched for : {this.state.query} dataset.{" "}
            <b>
              Look at the console for more info. each item in the array
              represent a video
            </b>
          </p>
          <br />
          <VideoList videoArray={this.state.dataSet} />
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
