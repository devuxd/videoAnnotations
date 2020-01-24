import React from "react";
import * as d3 from "d3";
/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  mouseClick = selectedAnnotation => {
    this.props.onAnnotationClick(selectedAnnotation);
  };
  componentDidMount() {
    let annotationLength = this.props.annotationLength;
    let annotationData = this.props.annotationData;
    const mouseClick = this.mouseClick;
    var mini = d3
      .select(this.props.divId)
      .append("svg")
      .attr("width", this.props.windowWidth - 10) // this is to adjust the annotation bar with youtube video progress.
      .attr("height", 22);

    let scale = d3
      .scaleLinear()
      .domain([0, annotationLength])
      .range([0, this.props.windowWidth - 10]);

    mini
      .append("g")
      .selectAll("miniItems")

      .data(annotationData)
      .enter()
      .append("rect")
      .style("fill", d => {
        return this.props.colorScheme(d.title);
      })
      .attr("x", d => {
        return scale(d.duration.start.inSeconds);
      })
      .attr("id", function(d) {
        return d.id;
      })
      .attr("width", function(d) {
        return scale(d.duration.end.inSeconds - d.duration.start.inSeconds);
      })
      .attr("height", 15)
      .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", function(d) {
        d3.select(this).style("cursor", "default");
      })
      .on("click", function(d) {
        mouseClick(d);
      });
  }

  render() {
    return <>{this.props.children}</>;
  }
}
