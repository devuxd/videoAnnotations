import React from "react";
import * as d3 from "d3";
import { mainColor } from "../../../API/color";
/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.selectedElement;
    this.selectCategory;
    this.color = mainColor();
  }

  mouseClick = (selectedAnnotation, annotationVisElement) => {
    this.props.onAnnotationClick(selectedAnnotation);
  };
  componentDidMount() {
    let videoLength = this.props.videoLength;
    let annotationData = this.props.annotationData;

    const mouseClick = this.mouseClick;
    const YouTubeIframeWidth = document.getElementById("YTplayer").offsetWidth;
    const h = 100;

    var mini = d3
      .select(this.props.divId)
      .append("svg")
      .attr("width", YouTubeIframeWidth)
      .attr("height", 22);

    let scale = d3
      .scaleLinear()
      .domain([0, videoLength])
      .range([0, YouTubeIframeWidth]);

    mini
      .append("g")
      .selectAll("miniItems")

      .data(annotationData)
      .enter()
      .append("rect")
      .style("fill", d => {
        return this.color(d.title);
      })
      .attr("x", d => {
        return scale(d.duration.start.inSeconds);
      })
      .attr("id", function(d) {
        return d.title + d.id;
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
        mouseClick(d, this);
      });
  }

  render() {
    return <>{this.props.children}</>;
  }
}
