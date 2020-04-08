import { useEffect } from "react";
import { secondColor } from "../../../API/color";
import * as d3 from "d3";
import { getAnnotationsTitle } from "../../../API/db";
export default function PiChart({ data }) {
  useEffect(() => renderChart(), []);

  const color = secondColor(getAnnotationsTitle().subAnnotations);
  const renderChart = () => {
    const margin = { top: 10, right: 30, bottom: 90, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 490;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function(d) {
          return d.title;
        })
      )
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.title);
      })
      .attr("width", x.bandwidth())
      .attr("fill", function(d) {
        return color(d.title);
      })
      .attr("height", function(d) {
        return height - y(0);
      }) // always equal to 0
      .attr("y", function(d) {
        return y(0);
      });

    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function(d) {
        return y(d.totalTime);
      })
      .attr("height", function(d) {
        return height - y(d.totalTime);
      })
      .delay(function(d, i) {
        return i * 100;
      });
  };

  return <div id="my_dataviz"></div>;
}
