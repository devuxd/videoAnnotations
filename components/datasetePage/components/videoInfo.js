import React from "react";
import { secondsToStringFormat } from "../../../API/time";
import Link from "next/link";

function VideoInfo({
  video: {
    videoLength,
    programmingLanguage,
    programmingTools,
    developerGithubURL,
    githubURL,
    videoId,
    videoTitle,
    annotations,
  },
  rotate,
  domId,
  sheetId,
}) {
  let uniqueAnnotation = Array.from(
    new Set(annotations.map((annotation) => annotation.title))
  );
  return (
    <div className="card-body bg-light text-dark">
      <Link
        href="/video/[sheetId]/[videoId]"
        as={`/video/${sheetId}/${videoId}`}
      >
        <a>
          <img
            src={"https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg"}
            className="card-img-top "
            alt="Video Picture"
          />
        </a>
      </Link>
      <Link
        href="/video/[sheetId]/[videoId]"
        as={`/video/${sheetId}/${videoId}`}
      >
        <a>
          <h5 className="card-title">{videoTitle}</h5>
        </a>
      </Link>
      <div className="card-text">
        Total Time: {secondsToStringFormat(videoLength)}
        <br />
        Programming Language: {programmingLanguage} <br />
        Programming Tools: {programmingTools} <br />
        Project URL(s):{" "}
        <ul style={{ listStyle: "square inside" }}>
          {githubURL.split(", ").map((item, index) => (
            <li key={index}>
              <a href={item}>{item}</a>
            </li>
          ))}
        </ul>
        Developer Github: <a href={developerGithubURL}>{developerGithubURL}</a>{" "}
        <br />
      </div>
      <b>Epsiodes:</b>
      <p className="card-text">
        {uniqueAnnotation.map((annotation, index) => (
          <span className="badge badge-light" key={index}>
            {annotation}
          </span>
        ))}
      </p>
      <button
        type="button"
        className="btn btn-info"
        onClick={() => rotate(domId, "open")}
      >
        Episodes Distribution
      </button>
    </div>
  );
}

export default VideoInfo;
