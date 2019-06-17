import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";

/**
 * annotations(annArray) : function that returns 1 array of all the annotation tags
 *
 * @param {*} annArray : array of annotations (which each annotation contains an array of tags)
 */
function annotations(annArray) {
  if (Array.isArray(annArray)) {
    var returnArray = [];
    return annArray.map(x => returnArray.concat(x.Tags)).flat();
  } else {
    //console.log(returnArray)
  }
}

/**
 * mapAnnotations(finalArray) : function that gets unique set of all tags and returns them as XML links
 *
 * need to fix: doesn't work properly with different cases of tags (e.g. uppercase/lowercase)
 *
 * @param {*} finalArray : array of all tags in the array
 */
function mapAnnotations(finalArray) {
  if (Array.isArray(finalArray)) {
    return Array.from(new Set(finalArray)).map(y => (
      <div>
        <a href={"/search/" + y}>{y}</a>
        <br />
      </div>
    ));
  } else {
    //console.log(finalArray)
  }
}

function VideoListing(video) {
  // below for potentially using youtube API to retrieve video titles
  // var ytApiKey = "AIzaSyBuLHqdTc3IUcmb6kwbvY-bF2slca0pXu0";
  // var videoId = video.VideoURL.replace("https://youtu.be/","");

  const videoId = video.VideoURL.replace("https://youtu.be/", "");

  return (
    <div className="col-lrg" style={{ paddingLeft: "5%", paddingRight: "2%" }}>
      <div class="media">
        <a href={"/" + videoId}>
          <img
            class="mr-3"
            style={{ width: "500px" }}
            src={"https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"}
            alt="YouTube Thumbnail Goes Here"
          />
        </a>
        <div class="media-body">
          <h5 class="mt-0">{video.VideoURL}</h5>

          {/* would be something like annotations(video.Annotations).filter(x === query).length */}
          <p>Number of Instances: </p>
          <p>
            Total Time: {video.VideoLength.hours}:{video.VideoLength.minutes}:
            {video.VideoLength.seconds}
          </p>

          <p>All annotations: </p>

          {mapAnnotations(annotations(video.Annotations))}

          <a href="/">JavaScript Debugging</a>
          <br />
          <a href="/">Java Debugging</a>
          <br />
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default VideoListing;
