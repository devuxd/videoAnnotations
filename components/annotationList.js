import React from "react";
import Router from "next/router";
import { render } from "react-dom";

/**
 * annotations(annArray) : function that returns 1 array of all the annotation tags
 *
 * @param {*} annArray : array of annotations (which each annotation contains an array of tags)
 */
function annotations(annArray) {
  if (Array.isArray(annArray)) {
    return annArray.reduce(
      (initialArray, obj) => initialArray.concat(obj.Tags),
      []
    );
  }
}

function mapAnnotationsHelper(uniqueArray, videoID, searchResult) {
  if (searchResult) {
    return uniqueArray.map(item => (
      <div>
        <a href={"/search/" + item}>{item}</a>
      </div>
    ));
  } else {
    return uniqueArray.map(item => (
      <div>
        <a href={"/posts/" + videoID + "/" + item}>{item}</a>
      </div>
    ));
  }
}

/**
 * mapAnnotations(finalArray) : function that gets unique set of all tags and returns them as XML links
 *
 * need to fix: doesn't work properly with different cases of tags (e.g. uppercase/lowercase)
 *
 * @param {*} finalArray : array of all tags in the array
 */
function mapAnnotations(finalArray, videoID, searchResult) {
  let rows = [];
  let uniqueArray = Array.from(new Set(finalArray));
  if (Array.isArray(uniqueArray)) {
    let firstHalf = uniqueArray.slice(0, Math.trunc(uniqueArray.length / 2));
    let secondHalf = uniqueArray.slice(
      Math.trunc(uniqueArray.length / 2),
      uniqueArray.length
    );
    rows.push(
      <div
        className="row"
        style={{
          borderStyle: "solid",
          borderColor: "#DCDCDC",
          backgroundColor: "#DCDCDC",
          borderRadius: "8px",
          paddingTop: "2%",
          paddingBottom: "1.3%",
          paddingLeft: "5%",
          paddingRight: "5%"
        }}
      >
        <div className="col-sm">
          All annotations:
          {mapAnnotationsHelper(secondHalf, videoID, searchResult)}
        </div>
        <div className="col-sm">
          <br />
          {mapAnnotationsHelper(firstHalf, videoID, searchResult)}
        </div>
      </div>
    );
    return rows;
  }
}

/**
 * AnnotationList: annotation list for each VideoListing component in the search result page
 */
class AnnotationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annotationsElement: null,
      isLoaded: false,
      searchResult: null,
      videoID: this.props.videoID
    };
  }

  componentDidMount() {
    if (!this.state.isLoaded) {
      this.setState({
        annotationsElement: this.props.videoElem.Annotations,
        searchResult: this.props.searchResult,
        videoID: this.props.videoID,
        isLoaded: true
      });
    }
  }

  render() {
    return (
      <div>
        {mapAnnotations(
          annotations(this.props.videoElem.Annotations),
          this.state.videoID,
          this.state.searchResult
        )}
      </div>
    );
  }
}

export default AnnotationList;
