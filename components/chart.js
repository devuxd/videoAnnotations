import React from "react";
import * as d3 from "d3";
import cubism from "cubism";

/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 65 },
      width = 500 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#ann-visual")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var timeData = [];

    this.props.annotations.map(x =>
      timeData.push({
        startHour: x.Duration.start.hours,
        startMinute: x.Duration.start.minutes,
        startSecond: x.Duration.start.seconds,
        endHour: x.Duration.end.hours,
        endMinute: x.Duration.end.minutes,
        endSecond: x.Duration.end.seconds,
        tag: x.Tags.join(", ")
      })
    );

    let vidLengthArray = this.props.vidLength.split(":");
    let vidLengthHour = Number(vidLengthArray[0]);
    let vidLengthMinute = Number(vidLengthArray[1]);
    let vidLengthSecond = Number(vidLengthArray[2]);
    let randomColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);

    let videoStart = new Date(2016, 1, 1, 0, 0, 0);
    let videoLength = new Date(
      2016,
      1,
      1,
      vidLengthHour,
      vidLengthMinute,
      vidLengthSecond
    );

    // Add X axis
    var x = d3
      .scaleTime()
      .domain([videoStart, videoLength])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "10px")
      .call(
        d3
          .axisBottom(x)
          .tickSize(0)
          .ticks(10)
          .tickFormat(d3.timeFormat("%H:%M"))
      );

    // Tooltip
    var tooltip = d3
      .select("#ann-tooltip")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
      tooltip.style("opacity", 1);
    };

    var mousemove = function(d) {
      tooltip
        .html(
          "Detailed Annotation: " +
            d.startHour +
            ":" +
            d.startMinute +
            ":" +
            d.startSecond +
            " until " +
            d.endHour +
            ":" +
            d.endMinute +
            ":" +
            d.endSecond +
            " - " +
            d.tag
        )
        .style("left", "37%")
        .style("top", "75%");
    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0);
    };

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(timeData)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return x(
          new Date(
            2016,
            1,
            1,
            Number(d.startHour),
            Number(d.startMinute),
            Number(d.startSecond)
          )
        );
      })
      .attr("r", 7)
      .style("fill", "#228B22")
      .style("opacity", 0.4)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    svg
      .append("g")
      .selectAll("dot")
      .data(timeData)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return x(
          new Date(
            2016,
            1,
            1,
            Number(d.endHour),
            Number(d.endMinute),
            Number(d.endSecond)
          )
        );
      })
      .attr("r", 7)
      .style("fill", "red")
      .style("opacity", 0.4)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }

  render() {
    return <div id={"#" + this.props.id} />;
  }
}
