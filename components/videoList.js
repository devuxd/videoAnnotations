import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import VideoListing from "../components/videoListing.js";

function VideoList() {
  // psuedo code:
  // <div className="container">
  // for ( i = 0, i < array.length, i = i + 3){
  //   for (j = 0, j < 3, j ++ ) {
  //     <div className="row">
  //       <div className="col-sm">
  //         if (array[i + j] exists)
  //           VideoListing( array[i + j] )
  //       </div>
  //   }
  //   </div>
  // }
  // </div>

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
      </div>
      <div className="row">
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
      </div>
      <div className="row">
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
        <div className="col-sm">{VideoListing()}</div>
      </div>
    </div>
  );
}

export default VideoList;
