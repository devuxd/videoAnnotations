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

function mapAnnotationsHelper(uniqueArray, videoID, searchResult, videoString) {
  if (searchResult) {
    return uniqueArray.map((item, index) => (
      <div key={index.toString()}>
        <a href={"/search/" + item}>{item}</a>
      </div>
    ));
  } else {
    return uniqueArray.map((item, index) => (
      <div key={index.toString()}>
        <button
          type="button"
          class="btn btn-outline-dark"
          onClick={() =>
            Router.push(
              `/posts/${videoID}/${item}/${JSON.stringify(videoString)}`
            )
          }
        >
          {item}
        </button>
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
 * @param {*} videoID: id of video passed in
 * @param {*} searchResult: boolean of whether this annotationList is for search result page or not
 * @param {*} videoString: string of video JSON object
 */
function mapAnnotations(finalArray, videoID, searchResult, videoString) {
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
          {mapAnnotationsHelper(secondHalf, videoID, searchResult, videoString)}
        </div>
        <div className="col-sm">
          <br />
          {mapAnnotationsHelper(firstHalf, videoID, searchResult, videoString)}
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
      videoID: null,
      videoElem: null
    };
  }

  componentDidMount() {
    if (!this.state.isLoaded) {
      this.setState({
        annotationsElement: this.props.videoElem.Annotations,
        searchResult: this.props.searchResult,
        videoID: this.props.videoID,
        videoElem: this.props.videoElem,
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
          this.state.searchResult,
          this.state.videoElem
        )}
      </div>
    );
  }
}

export default AnnotationList;
