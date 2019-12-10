import React from "react";
import * as d3 from "d3";
import color from "color";
/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let annotationLength = this.props.annotationLength;
    let subAnnotations = this.props.subAnnotations
      .map(subAnnotation => subAnnotation.annotations)
      .flat();

    const onMouseClick = this.props.onSubAnnotationClick;
    const w = document.getElementById("YTplayer").offsetWidth,
      h = 100;

    var mini = d3
      .select(this.props.divId)
      .append("svg")
      .attr("width", w)
      .attr("height", 22)
      .attr("class", "chart");

    var myColor = d3
      .scaleOrdinal()
      .domain(subAnnotations)
      .range(d3.schemeSet2);
    let scale = d3
      .scaleLinear()
      .domain([0, annotationLength])
      .range([0, w]);

    mini
      .append("g")
      .selectAll("miniItems")
      .data(subAnnotations)
      .enter()
      .append("rect")
      .style("fill", d => {
        const strokeColor = color(myColor(d.title));
        return strokeColor.darken(0.5);
      })
      .style("stroke-width", 2.5)
      .style("stroke-linecap", "butt")
      .attr("x", d => {
        return scale(d.start);
      })
      .attr("id", function(d) {
        return d.title + d.id;
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
        onMouseClick(d);
      });
  }

  render() {
    return <>{this.props.children}</>;
  }
}
