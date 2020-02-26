import moment from "moment";

const secondsToStringFormat = seconds => {
  const hours = Math.floor(moment.duration(seconds, "seconds").asHours());
  const time = moment.duration(seconds, "seconds");
  return `${hours}:${time.minutes()}:${time.seconds()}`;
};

const stringToSecondsFormat = string => moment.duration(string).asSeconds();
module.exports = {
  secondsToStringFormat,
  stringToSecondsFormat
};
