import moment from "moment";

const secondsToStringFormat = TotalTimeInSeconds => {
  // this is done to get hours after 24. Moment convert 24 hours to a day in duration
  const hours = Math.floor(
    moment.duration(TotalTimeInSeconds, "seconds").asHours()
  );
  // this is to get the minutes and seconds
  const time = moment.duration(TotalTimeInSeconds, "seconds");
  // formating
  const minutes = time.minutes() > 9 ? time.minutes() : `0${time.minutes()}`;
  const seconds = time.seconds() > 9 ? time.seconds() : `0${time.seconds()}`;
  return `${hours}:${minutes}:${seconds}`;
};

const getDurationInSeconds = (end, start) => {
  return stringToSecondsFormat(end) - stringToSecondsFormat(start);
};
const getDurationInString = (end, start) => {
  return secondsToStringFormat(getDurationInSeconds(end, start));
};
const stringToSecondsFormat = string => moment.duration(string).asSeconds();
if (typeof window !== "undefined") {
  window.util = {
    secondsToStringFormat,
    stringToSecondsFormat,
    getDurationInString,
    getDurationInSeconds
  };
}
module.exports = {
  secondsToStringFormat,
  stringToSecondsFormat,
  getDurationInString,
  getDurationInSeconds
};
