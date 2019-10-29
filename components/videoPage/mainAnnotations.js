import React from "react";
import * as d3 from "d3";
import * as moment from "moment";

/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let videoLength = this.props.videoLength;
    let timeData = this.props.annotations.map((x, index) => ({
      start:
        Number(x.Duration.start.hours) * 60 * 60 +
        Number(x.Duration.start.minutes) * 60 +
        Number(x.Duration.start.seconds),
      end:
        Number(x.Duration.end.hours) * 60 * 60 +
        Number(x.Duration.end.minutes) * 60 +
        Number(x.Duration.end.seconds),
      tag: x.Tags,
      name: x.Tags + index,
      annotation: x.Description,
      duration: `${x.Duration.start.hours}:${x.Duration.start.minutes}:${x.Duration.start.seconds} - ${x.Duration.end.hours}:${x.Duration.end.minutes}:${x.Duration.end.seconds}`,
      totalTime() {
        const start = new moment(this.start * 1000);
        const end = new moment(this.end * 1000);
        const diff = moment.duration(end.diff(start));
        return `${diff.hours()}:${diff.minutes()}:${diff.seconds()}`;
      }
    }));
    // restructuring to an array [each annotation] with an array [with time start and time end dates as only values]

    // Tooltip
    const initTooltip = () => {
      d3.select("#ann-tooltip")
        .selectAll("div")
        .remove();
      return d3
        .select("#ann-tooltip")
        .append("div")
        .style("opacity", 0)
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "14px");
    };

    const mouseclick = d => {
      this.props.seekTo(d);
    };

    const w = 1250,
      h = 100;

    var mini = d3
      .select("#ann-visual")
      .append("svg")
      .attr("width", w)
      .attr("height", 22)
      .attr("class", "chart");

    var myColor = d3
      .scaleOrdinal()
      .domain(timeData)
      .range(d3.schemeSet2);
    let scale = d3
      .scaleLinear()
      .domain([0, videoLength])
      .range([0, w]);

    mini
      .append("g")
      .selectAll("miniItems")

      .data(timeData)
      .enter()
      .append("rect")
      .style("fill", function(d) {
        return myColor(d.name);
      })
      .attr("x", function(d) {
        return scale(d.start);
      })
      .attr("width", function(d) {
        return scale(d.end - d.start);
      })
      .attr("height", 15)
      .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", function(d) {
        d3.select(this).style("cursor", "default");
      })
      .on("click", function(d) {
        d3.select(this).style("opacity", 1);
        initTooltip()
          .html(
            `${d.annotation}
                          <br>
                          <b>Duration:</b> ${
                            d.duration
                          }. <b>Total Time:</b> ${d.totalTime()}.<b> Annotation:</b> ${
              d.tag
            }.`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .transition()
          .style("opacity", 1)
          .style("background", myColor(d.name));
        mouseclick(d);
      })
      .style("opacity", 0.8);
  }

  render() {
    return <>{this.props.children}</>;
  }
}
