import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";

const videoBox = {
  border: "1px solid",
  padding: "10 px",
  boxShadow: "10px 5px"
};

const bootstrapFont = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const videoTitle = {
  fontFamily: bootstrapFont,
  fontSize: "25px",
  padding: "10px"
};

// .articlepublisher {
//   font-size: 15px;
//   padding: 5px;
//   padding-left: 10px;
// }

// .articlepreview {
//   font-size: 12px;
//   padding: 5px;
//   padding-left: 10px;
// }

// .articlelink {
//   font-size: 12px;
//   padding: 5px;
//   padding-left: 10px;
// }

function VideoListing() {
  // eventually would want to map video array to grid system
  return (
    <div>
      <div class="media">
        <img class="mr-3" src="..." alt="YouTube Thumbnail Goes Here" />
        <div class="media-body">
          <h5 class="mt-0">Media heading</h5>
          <p>Number of Instances: </p>
          <p>Total Time: </p>

          {/* pseudo-code for getting all annotations */}
          {/* [array of annotations].map(x => <a href='{x}'> x </a> */}

          <p>All annotations: </p>
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
