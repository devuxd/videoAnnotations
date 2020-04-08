import React from "react";
import { secondsToStringFormat } from "../../../API/time";

function VideoInfo({
  video: {
    videoLength,
    programmingLanguage,
    programmingTools,
    developerGithubURL,
    githubURL
  }
}) {
  return (
    <>
      Total Time: {secondsToStringFormat(videoLength)}
      <br />
      Programming Language: {programmingLanguage} <br />
      Programming Tools : {programmingTools} <br />
      Project URL(s):{" "}
      <ul style={{ listStyle: "square inside" }}>
        {githubURL.split(", ").map((item, index) => (
          <li key={index}>
            <a href={item}>{item}</a>
          </li>
        ))}
      </ul>
      Developer Github: <span> </span>
      <a href={developerGithubURL}>{developerGithubURL}</a> <br />
    </>
  );
}

export default VideoInfo;
