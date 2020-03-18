import * as d3 from "d3";

const mainColor = domain => d3.scaleOrdinal(d3.schemeSet2).domain(domain);
const secondColor = domain =>
  d3
    .scaleOrdinal([
      ...d3.schemeCategory10,
      ...d3.schemeDark2,
      ...d3.schemePaired
    ])
    .domain(domain);

module.exports = {
  mainColor,
  secondColor
};
