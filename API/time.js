import moment from "moment";

const secondsToStringFormat = seconds =>
  moment("2015-01-01")
    .startOf("day")
    .seconds(seconds)
    .format("H:mm:ss");

const stringToSecondsFormat = string => moment.duration(string).asSeconds();
module.exports = {
  secondsToStringFormat,
  stringToSecondsFormat
};
