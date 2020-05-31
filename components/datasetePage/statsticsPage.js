import { secondsToStringFormat } from "../../API/time";
import { totalTime, getAnnotationsStatstics } from "../../API/statstics";
import { useState } from "react";
import PiChart from "./components/piChart";

export default function StatsticsPage({ dataset }) {
  let annotationsStatstics = dataset.reduce((prev, current) => {
    return [...prev, ...getAnnotationsStatstics(current.annotations)];
  }, []);
  annotationsStatstics = getAnnotationsStatstics(annotationsStatstics);

  const [tabId, updateTabId] = useState(0);

  const getTabcontent = () => {
    const annotation = annotationsStatstics[tabId];
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
          />
        )}
      </>
    );
  };
  return (
    <>
      {/* <h3>
                Total Time:{" "}
                {secondsToStringFormat(
                    totalTime(dataset.map(video => video.videoLength))
                )}
            </h3>
            {annotationsTotolaTime.map(annotation => (
                <h3>
                    {annotation[0]}: {secondsToStringFormat(annotation[1])}
                </h3>
            ))} */}

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
          margin: "15px 0px"
        }}
      >
        {getTabcontent()}
      </div>
    </>
  );
}
