import React from "react";
import VideoInfo from "../shared/videoInfo";
import Link from "next/link";

/**
 * Videos: component for each video for search result page
 */
function Video({
  video: { videoId, videoTitle, annotations, ...otherProperties },
  sheetId
}) {
  let uniqueAnnotation = Array.from(
    new Set(annotations.map(annotation => annotation.title))
  );
  return (
    <div class="card">
      <Link
        href="/video/[sheetId]/[videoId]"
        as={`/video/${sheetId}/${videoId}`}
      >
        <a>
          <img
            src={"https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg"}
            class="card-img-top "
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
      <div class="card-body bg-light text-dark">
        <Link
          href="/video/[sheetId]/[videoId]"
          as={`/video/${sheetId}/${videoId}`}
        >
          <a>
            <h5 class="card-title">{videoTitle}</h5>
          </a>
        </Link>
        <p class="card-text">
          <VideoInfo video={otherProperties} />
        </p>
        <b>Annotations:</b>
        <p class="card-text">
          {uniqueAnnotation.map(annotation => (
            <span class="badge badge-light">{annotation}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default Video;
