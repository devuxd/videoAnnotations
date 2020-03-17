import React from "react";
import {
  getDurationInSeconds,
  getDurationInString,
  stringToSecondsFormat,
  secondsToStringFormat
} from "../../../API/time";

function AnnotationsTitles({
  selectedTitle,
  colorScheme,
  annotations,
  totalTime
}) {
  const uniqueTitles = annotationData(annotations, totalTime);
  console.log(uniqueTitles);
  return (
    <>
      {uniqueTitles.map(({ title, timePresentage }, index) => (
        <div>
          <span
            key={index}
            className="badge badge-pill"
            id={`${title}-badge`}
            style={{
              marginBottom: "2px",
              color: "white",
              border: title === selectedTitle ? "2px black solid" : "none",
              backgroundColor: colorScheme(title),
              cursor: "default"
            }}
            title={`<bold>${title}</bold>`}
          >
            {title}
          </span>
          {Math.round(timePresentage)}%
        </div>
      ))}
    </>
  );
}
// I have to reduce the annotations array to contain each unique annotations plus time and occurances
// TitleData --> {title, totalTime, NumberOfOccurance}
const annotationData = (annotations, totalTime) =>
  annotations.reduce((newArray, annotation, index) => {
    const indexOfExistingAnnotation = newArray.findIndex(
      ({ title }) => title === annotation.title
    );
    if (indexOfExistingAnnotation > -1) {
      const localAnnotation = newArray[indexOfExistingAnnotation];
      const currentTotalTime = stringToSecondsFormat(localAnnotation.totalTime);
      localAnnotation.NumberOfOccurance += 1;
      localAnnotation.totalTime = secondsToStringFormat(
        getDurationInSeconds(
          annotation.duration.end.time,
          annotation.duration.start.time
        ) + currentTotalTime
      );
      localAnnotation.timePresentage =
        (stringToSecondsFormat(localAnnotation.totalTime) / totalTime) * 100;
      return newArray;
    } else {
      const newElement = {
        title: annotation.title,
        NumberOfOccurance: 1,
        totalTime: getDurationInString(
          annotation.duration.end.time,
          annotation.duration.start.time
        )
      };
      newElement.timePresentage =
        (stringToSecondsFormat(newElement.totalTime) / totalTime) * 100;
      return [...newArray, newElement];
    }
  }, []);

export default AnnotationsTitles;
