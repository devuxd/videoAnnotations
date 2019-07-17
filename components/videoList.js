import React from "react";
import Router from "next/router";
import VideoListing from "../components/videoListing.js";
import { render } from "react-dom";

/**
 * VideoList: component for the list of videos
 *
 * need to do: finish implementing dynamic row and column system
 *
 */
class VideoList extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * VideoExists: helper function to check whether a certain index contains a video element
   *              and calls VideoListing component if it does
   *
   * @param {*} videoArray : passing in video array
   * @param {*} num1 : passing in index for outer for loop
   * @param {*} num2 : passing in index for inner for loop
   */
  VideoExists(videoArray, num1, num2) {
    if (!(typeof videoArray[num1 + num2] === "undefined")) {
      return (
        <VideoListing
          searchQuery={this.props.searchQuery}
          videoElement={videoArray[num1 + num2]}
        />
      );
    }
  }

  /**
   * addColBreak: helper function to add a column break only the first time in inner for loop
   *
   * @param {*} num1 : passing in index for inner for loop
   */
  addColBreak(num1) {
    if (num1 === 0) {
      return <div className="col-sm" style={{ padding: "2%" }} />;
    }
  }

  /**
   * VideoColumnMaker: helper function to contain inner for loop and structure columns
   *                   also calls addColBreak to seperate the two columns
   *
   * @param {*} videoArray : passing in array of videos
   * @param {*} num : passing in index for outer for loop
   */
  VideoColumnMaker(videoArray, num) {
    let rows = [];
    for (var j = 0; j < 2; j = j + 1) {
      rows.push(
        <div 
        key = {j.toString()}
          className="col-md"
          style={{ paddingLeft: "8%", paddingRight: "8%" }}
        >
          {this.VideoExists(videoArray, num, j)}
        </div>
      );
    }
    return rows;
  }

  /**
   * VideoListMapper: helper function to dynamically create rows and columns depending on number of videos
   *
   * @param {*} videoArray : passing in array of videos
   */
  VideoListMapper(videoArray) {
    let rows = [];
    for (var i = 0; i < videoArray.length; i += 2) {
      rows.push(
        <div key ={i.toString()} className="row">{this.VideoColumnMaker(videoArray, i)}</div>
      );
    }
    return rows;
  }

  render() {
    if (Array.isArray(this.props.videoArray)) {
      return <div>{this.VideoListMapper(this.props.videoArray)}</div>;
    } else {
      return (
        <div style={{ paddingLeft: "5%" }}>Oops something went wrong!</div>
      );
    }
  }
}

export default VideoList;
