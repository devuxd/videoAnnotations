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
    this.drawChart();
  }

  drawChart() {
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
        start: new Date(
          2016,
          1,
          1,
          Number(x.Duration.start.hours),
          Number(x.Duration.start.minutes),
          Number(x.Duration.start.seconds)
        ),
        end: new Date(
          2016,
          1,
          1,
          Number(x.Duration.end.hours),
          Number(x.Duration.end.minutes),
          Number(x.Duration.end.seconds)
        ),
        tag: x.Tags.join(", ")
      })
    );

    // restructuring to an array [each annotation] with an array [with time start and time end dates as only values]

    var allGroup = [];

    for (var i = 0; i < timeData.length; i++) {
      allGroup.push("value" + i);
    }

    var dataReady = allGroup.map(function(grpName) {
      var index = grpName[grpName.length - 1];
      return {
        name: grpName,
        values: timeData[index]
      };
    });

    var myColor = d3
      .scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemePaired);

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

    // var line = d3.line()
    //     .x(function(d) { return x(d.start) })
    //     .x(function(d) { return x(d.end) })
    // svg.selectAll("myLines")
    //     .data(dataReady)
    //     .enter()
    //     .append("path")
    //       .attr("d", function (d) { return line(d.values) })
    //       .attr("stroke", function(d){ return myColor(d.name) })
    //       .style("stroke-width", 4)
    //       .style("fill", "none");

    var line = d3
      .line()
      .x(function(d) {
        return x(d.values.start);
      })
      .x(function(d) {
        return x(d.values.end);
      });
    svg
      .selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("class", function(d) {
        return d.name;
      })
      .attr("d", function(d) {
        return line(d.values.start, d.values.end);
      })
      .style("fill", function(d) {
        return myColor(d.name);
      })
      .style("stroke-width", 4);

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
            numberFormatter(d.values.start.getHours()) +
            ":" +
            numberFormatter(d.values.start.getMinutes()) +
            ":" +
            numberFormatter(d.values.start.getSeconds()) +
            " until " +
            numberFormatter(d.values.end.getHours()) +
            ":" +
            numberFormatter(d.values.end.getMinutes()) +
            ":" +
            numberFormatter(d.values.end.getSeconds()) +
            " - " +
            d.values.tag
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

    var mouseclick = function(d) {
      const totalStartSec =
        Number(d.values.start.getHours() * 60 * 60) +
        Number(d.values.start.getMinutes() * 60) +
        Number(d.values.start.getSeconds());
      this.props.passedSeek(totalStartSec);
    };

    // console.log(myColor(value0));
    // console.log(d3.schemePaired);
    // console.log(myColor("value0"))
    // console.log(dataReady);
    // console.log(allGroup);

    svg
      .append("g")
      .selectAll("dot")
      .data(dataReady)
      .enter()
      .append("rect")
      .attr("cx", function(d) {
        return x(d.values.start);
      })
      .attr("width", 30)
      .attr("height", 10)
      .style("fill", function(d) {
        return myColor(d.name);
      })
      .style("opacity", 0.65)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    // .on("click", mouseclick);

    // svg
    //   .append("g")
    //   .selectAll("dot")
    //   .data(dataReady)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", function(d) {
    //     return x(d.values.end);
    //   })
    //   .attr("r", 20)
    //   .style("fill", function(d) {
    //     return myColor(d.name);
    //   })
    //   .style("opacity", 0.65)
    //   .style("stroke", "white")
    //   .on("mouseover", mouseover)
    //   .on("mousemove", mousemove)
    //   .on("mouseleave", mouseleave);
    // .on("click", mouseclick);
  }

  render() {
    return <div />;
  }
}
