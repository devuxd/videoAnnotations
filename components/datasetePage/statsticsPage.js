import { secondsToStringFormat } from "../../API/time";
import { totalTime, getAnnotationsStatstics } from "../../API/statstics";
import { useState } from "react";
import PiChart from "./components/piChart";
import { secondColor } from "../../API/color";
import { getAnnotationsTitle } from "../../API/db";

export default function StatsticsPage({ dataset }) {
  let annotationsStatstics = dataset.reduce((prev, current) => {
    return [...prev, ...getAnnotationsStatstics(current.annotations)];
  }, []);
  annotationsStatstics = getAnnotationsStatstics(annotationsStatstics);

  const [tabId, updateTabId] = useState(0);
  const color = secondColor(getAnnotationsTitle().subAnnotations);

  const getTabcontent = () => {
    const annotation = annotationsStatstics[tabId];
    if (annotation === undefined)
      return (
        <>
          {" "}
          <h3>No data available to show!</h3>
        </>
      );
    const subannotationsStatstics = getAnnotationsStatstics(
      annotation.subAnnotations
    );
    return (
      <>
        Time: {secondsToStringFormat(annotation.totalTime)}
        <br />
        Number of occurance: {annotation.counts}
        <br />
        {subannotationsStatstics.length > 0 && (
          <PiChart
            data={subannotationsStatstics}
            key={tabId}
            totalTime={annotation.totalTime}
            color={color}
          />
        )}
      </>
    );
  };
  return (
    <>
      <ul className="nav nav-pills nav-fill">
        {annotationsStatstics.map((annotation, index) => (
          <li className="nav-item">
            <a
              className={`nav-link ${tabId === index ? "active" : ""}`}
              onClick={() => updateTabId(index)}
              href="#"
            >
              {annotation.title}
            </a>
          </li>
        ))}
      </ul>
      <div
        className="container"
        style={{
          backgroundColor: "#f4f4f4",
          padding: "20px",
          margin: "15px 0px",
        }}
      >
        {getTabcontent()}
      </div>
    </>
  );
}
