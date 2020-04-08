import { getDurationInSeconds } from "./time";

const totalTime = array =>
  array.reduce((prevoiusValue, currentValue) => {
    return prevoiusValue + currentValue;
  }, 0);

const getAnnotationsStatstics = annotations => {
  const annotationStatstics = annotations.reduce(
    (prevoiusValue, currentValue) => {
      const index = prevoiusValue.findIndex(
        annotation => annotation.title === currentValue.title
      );
      if (index === -1) {
        return [
          ...prevoiusValue,
          {
            title: currentValue.title,
            totalTime:
              currentValue.totalTime ??
              getDurationInSeconds(
                currentValue.duration.end.time,
                currentValue.duration.start.time
              ),
            subAnnotations: currentValue.subAnnotations ?? [],
            counts: currentValue.counts ?? 1
          }
        ];
      }
      prevoiusValue[index].totalTime +=
        currentValue.totalTime ??
        getDurationInSeconds(
          currentValue.duration.end.time,
          currentValue.duration.start.time
        );
      prevoiusValue[index].subAnnotations = [
        ...prevoiusValue[index].subAnnotations,
        ...(currentValue.subAnnotations || [])
      ];
      prevoiusValue[index].counts += currentValue.counts ?? 1;
      return prevoiusValue;
    },
    []
  );
  return annotationStatstics;
};
module.exports = {
  getAnnotationsStatstics,
  totalTime
};
