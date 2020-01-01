import * as d3 from "d3";

const mainColor = () =>
  d3
    .scaleOrdinal()
    .domain(1)
    .range(d3.schemeSet1);
const secondColor = () =>
  d3
    .scaleOrdinal()
    .domain(1)
    .range(d3.schemeSet2);

module.exports = {
  mainColor,
  secondColor
};
