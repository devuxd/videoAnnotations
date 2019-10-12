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
    let vidLengthArray = this.props.vidLength.split(":");
    let vidLengthHour = Number(vidLengthArray[0]);
    let vidLengthMinute = Number(vidLengthArray[1]);
    let vidLengthSecond = Number(vidLengthArray[2]);
    let randomColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);

    let videoStart = 0;
    let videoLength =
      vidLengthHour * 60 * 60 + vidLengthMinute * 60 + vidLengthSecond;

    /**
     * numberFormatter: function to style single digits number with a preceding 0
     *
     * @param {*} num : number to style
     */
    var numberFormatter = num => {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    };

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
        console.log(diff);
        return `${diff.hours()}:${diff.minutes()}:${diff.seconds()}`;
      }
    }));
    // restructuring to an array [each annotation] with an array [with time start and time end dates as only values]

    // Tooltip
    var tooltip = d3
      .select("#ann-tooltip")
      .append("div")
      .style("opacity", 0)
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("width", "700px")
      .style("height", "80px");

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(d) {
      tooltip.style("opacity", 1);
    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(d) {
      tooltip
        .transition()
        .duration(1000)
        .style("opacity", 0);
    };

    const mouseclick = d => {
      this.props.passedSeek(d.start);
    };
    const currentAnnotation = d => {
      const duration = this.props.getCurrentDuration();
      return d.start <= duration && duration <= d.end;
    };

    const w = 726,
      h = 100;

    var mini = d3
      .select("#ann-visual")
      .append("svg")
      .attr("width", w)
      .attr("height", 22)
      .attr("style", "padding-left:10px")
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
        d3.select(this).style("opacity", 1);
        d3.select(this).style("cursor", "pointer");
        tooltip
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
          .style("height", "auto")

          .transition()
          .style("opacity", 1)
          .style("background", myColor(d.name));
      })
      .on("mouseleave", function(d) {
        if (!currentAnnotation(d)) {
          d3.select(this).style("opacity", 0.8);
          d3.select(this).style("cursor", "default");
          tooltip.transition().style("opacity", 0);
        }
      })
      .on("click", function(d) {
        d3.select(this).style("opacity", 1);
        d3.select(this).style("cursor", "pointer");
        tooltip
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
    return <div />;
  }
}
