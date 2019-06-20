import React from "react";
import Router from "next/router";
import { render } from "react-dom";

/**
 * annotations(annArray) : function that returns 1 array of all the annotation tags
 *
 * @param {*} annArray : array of annotations (which each annotation contains an array of tags)
 */
function annotations(annArray) {
  if (annArray.length === 0) {
    return annArray.reduce((initialArray, obj) => initialArray.concat(obj.Tags),[]);
  }
}

function mapAnnotationsHelper(uniqueArray) {
  let rows = [];
  for (var j = 0; j < uniqueArray.length; j++) {
    rows.push(
      <div>
        <a href={"/search/" + uniqueArray[j]}>{uniqueArray[j]}</a>
      </div>
    );
  }
  return rows;
}

/**
 * mapAnnotations(finalArray) : function that gets unique set of all tags and returns them as XML links
 *
 * need to fix: doesn't work properly with different cases of tags (e.g. uppercase/lowercase)
 *
 * @param {*} finalArray : array of all tags in the array
 */
function mapAnnotations(finalArray) {
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
          borderColor: "gray",
          backgroundColor: "lightgray",
          borderRadius: "8px"
        }}
      >
        <div className="col-sm">
          All annotations:
          {mapAnnotationsHelper(secondHalf)}
        </div>
        <div className="col-sm">
          <br />
          {mapAnnotationsHelper(firstHalf)}
        </div>
      </div>
    );
    return rows;
  } else {
    console.log(uniqueArray);
  }
}

/**
 * AnnotationList: annotation list for each VideoListing component in the search result page
 */
class AnnotationList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{mapAnnotations(annotations(this.props.videoAnnotations))}</div>
    );
  }
}

export default AnnotationList;
