import React from "react";
import VideoInfo from "./components/videoInfo";
import Link from "next/link";

/**
 * Videos: component for each video for search result page
 */
function VideosPage({
  video: { videoId, videoTitle, annotations, ...otherProperties },
  sheetId
}) {
  let uniqueAnnotation = Array.from(
    new Set(annotations.map(annotation => annotation.title))
  );
  return (
    <div className="card">
      <Link
        href="/video/[sheetId]/[videoId]"
        as={`/video/${sheetId}/${videoId}`}
      >
        <a>
          <img
            src={"https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg"}
            className="card-img-top "
            onMouseEnter={e => {
              e.target.style.cursor = "pointer";
              e.target.style.opacity = 0.7;
            }}
            onMouseLeave={e => {
              e.target.style.opacity = 1;
            }}
            alt="..."
          />
        </a>
      </Link>
      <div className="card-body bg-light text-dark">
        <Link
          href="/video/[sheetId]/[videoId]"
          as={`/video/${sheetId}/${videoId}`}
        >
          <a>
            <h5 className="card-title">{videoTitle}</h5>
          </a>
        </Link>
        <div className="card-text">
          <VideoInfo video={otherProperties} />
        </div>
        <b>Annotations:</b>
        <p className="card-text">
          {uniqueAnnotation.map((annotation, index) => (
            <span className="badge badge-light" key={index}>
              {annotation}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default VideosPage;
