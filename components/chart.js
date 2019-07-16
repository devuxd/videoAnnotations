import React from "react";
import * as d3 from "d3";
import cubism from "cubism";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    /**
     * cubism.js implementation commented out below
     */

    // // create context and horizon
    // var context = cubism.context()
    //   .serverDelay(Date.now() - Date.now())
    //   .step(0.10 * 60 * 1000)
    //   .size(600)
    // var horizon = context.horizon().extent([0,2])

    // // define metric accessor
    // function random_ma(name) {
    //   return context.metric(function(start,stop,step,callback){
    //         var values = [];
    //         while (+start < +stop){ start = +start +step; values.push(Math.random());}
    //       callback(null, values);
    //   }, name);
    // };

    // // draw graph
    // var metrics = ["foo","bar","baz"];
    // horizon.metric(random_ma);

    // d3.select("#ann-visual").selectAll(".horizon")
    //       .data(metrics)
    //       .enter()
    //       .append("div")
    //       .attr("class", "horizon")
    //       .call(horizon);

    // // set rule
    // d3.select("#body").append("div")
    //   .attr("class", "rule")
    //   .call(context.rule());

    // // set focus
    // context.on("focus", function(i) {
    //     d3.selectAll(".value")
    //         .style( "right", i == null ? null : context.size() - i + "px");
    // });

    // // set axis
    // var axis = context.axis()
    // d3.select("#ann-visual").append("div").attr("class", "axis").append("g").call(axis);

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 30 },
      width = 600 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#ann-visual")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var timeData = [
      { hour: 0, minute: 50, second: 50, tag: "Debugging" },
      { hour: 2, minute: 0, second: 0, tag: "Debugging" },
      { hour: 1, minute: 23, second: 23, tag: "Debugging" },
      { hour: 4, minute: 2, second: 12, tag: "Debugging" },
      { hour: 3, minute: 1, second: 14, tag: "Debugging" },
      { hour: 2, minute: 14, second: 20, tag: "Debugging" }
    ];

    console.log(timeData);
    console.log(this.props.vidLength);

    let videoStart = new Date(2016, 1, 1, 0, 0, 0);
    let videoLength = new Date(2016, 1, 1, 4, 3, 50);

    // Add X axis
    var x = d3
      .scaleTime()
      .domain([videoStart, videoLength])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")));

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
            d.hour +
            ":" +
            d.minute +
            ":" +
            d.second +
            " " +
            d.tag
        )
        .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", d3.mouse(this)[1] + 45 + "%");
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
            Number(d.hour),
            Number(d.minute),
            Number(d.second)
          )
        );
      })
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .style("opacity", 0.3)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }

  render() {
    return <div id={"#" + this.props.id} />;
  }
}
