import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import VideoListing from "../components/videoListing.js";

function VideoList() {
  // eventually would want to map video array to grid system
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">
          {VideoListing()}
          {VideoListing()}
          {VideoListing()}
        </div>
        <div className="col-sm">
          {VideoListing()}
          {VideoListing()}
        </div>
      </div>
    </div>
  );
}

export default VideoList;
