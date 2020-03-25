import { getDurationInSeconds } from "./time";

const totalTime = array =>
  array.reduce((prevoiusValue, currentValue) => {
    return prevoiusValue + currentValue;
  }, 0);

const getAnnotationsTime = array => {
  const annotationMap = new Map();
  array.forEach(element => {
    element.annotations.forEach(annotation => {
      const currentTime = getDurationInSeconds(
        annotation.duration.end.time,
        annotation.duration.start.time
      );
      if (annotationMap.has(annotation.title)) {
        const prevTime = annotationMap.get(annotation.title);
        annotationMap.set(annotation.title, prevTime + currentTime);
      } else {
        annotationMap.set(annotation.title, currentTime);
      }
    });
  });
  return Array.from(annotationMap);
};
module.exports = {
  totalTime,
  getAnnotationsTime
};
