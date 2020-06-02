import React from "react";
import VideoInfo from "./components/videoInfo";
import VideoStatstic from "./components/videoStatstic";

import Link from "next/link";

/**
 * Videos: component for each video for search result page
 */
function VideosPage({ video, sheetId, domId, rotate }) {
  return (
    <>
      <style jsx>
        {`
          .videoInfo {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            backface-visibility: hidden;
            background-color: #f8f9fa;
            border: 1px solid lightgray;
          }
          .videoStatstic {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            background-color: lightgray;
          }
        `}
      </style>
      <div className="container">
        <div className="videoInfo">
          <VideoInfo
            video={video}
            sheetId={sheetId}
            rotate={rotate}
            domId={domId}
          ></VideoInfo>
        </div>
        <div className="videoStatstic">
          <VideoStatstic
            rotate={rotate}
            domId={domId}
            video={video}
          ></VideoStatstic>
        </div>
      </div>
    </>
  );
}

export default VideosPage;
