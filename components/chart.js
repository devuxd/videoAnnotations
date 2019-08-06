import React from "react";
import * as d3 from "d3";

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
      tag: x.Tags.join(", "),
      name: x.Tags.join(", ") + index,
      annotation: x.Description
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
      .style("width", "450px");

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
      tooltip.style("opacity", 1);
    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
      tooltip
        .transition()
        .duration(1000)
        .style("opacity", 0);
    };

    var mouseclick = d => {
      this.props.passedSeek(d.start);
    };

    const w = 726,
      h = 100;

    var mini = d3
      .select("#ann-visual")
      .append("svg")
      .attr("width", w)
      .attr("height", 20)
      .attr("style", "padding-left:10px")
      .attr("class", "chart");

    var myColor = d3
      .scaleOrdinal()
      .domain(timeData)
      .range(d3.schemePastel1);

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
      .attr("height", 10)
      .on("mouseover", function(d) {
        console.log(d);
        d3.select(this).style("opacity", 1);
        d3.select(this).style("cursor", "pointer");
        tooltip
          .html(`<b>${d.tag}:</b> ${d.annotation}`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .transition()
          .style("opacity", 1)
          .style("background", myColor(d.name));
      })
      .on("mouseleave", function(d) {
        d3.select(this).style("opacity", 0.8);
        d3.select(this).style("cursor", "default");
        tooltip.transition().style("opacity", 0);
      })
      .style("opacity", 0.8)
      .on("click", mouseclick);
  }

  render() {
    return <div />;
  }
}
