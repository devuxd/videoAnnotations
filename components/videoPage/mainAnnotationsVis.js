import React from "react";
import * as d3 from "d3";

/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.selectedElement;
    this.selectCategory;
  }

  mouseclick = (annotationObject, annotationVisElement) => {
    this.props.seekTo(annotationObject.start);
    this.props.setSelectedAnnotation(annotationObject, annotationVisElement);
    if (this.selectedElement && this.selectedElement !== annotationVisElement) {
      this.selectedElement.style.opacity = 0.75;
      this.selectedElement.style.stroke = "none";
      this.selectCategory.style.opacity = 0.75;
      this.selectCategory.style.borderStyle = "none";
    }
    this.selectCategory = document.getElementById(
      `${annotationObject.tag}-badge`
    );
    this.selectedElement = annotationVisElement;
    this.selectCategory.style.borderStyle = "solid";
    this.selectCategory.style.opacity = 1;
  };
  componentDidMount() {
    let annotationLength = this.props.annotationLength;
    let annotationData = this.props.annotationData;
    // Tooltip
    const initTooltip = () => {
      d3.select(this.props.tooltipId)
        .selectAll("div")
        .remove();
      return d3
        .select(this.props.tooltipId)
        .append("div")
        .style("opacity", 0)
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "14px");
    };

    const mouseclick = this.mouseclick;
    const w = 1250,
      h = 100;

    var mini = d3
      .select(this.props.divId)
      .append("svg")
      .attr("width", w)
      .attr("height", 22)
      .attr("class", "chart");

    var myColor = d3
      .scaleOrdinal()
      .domain(annotationData)
      .range(d3.schemeSet2);
    let scale = d3
      .scaleLinear()
      .domain([0, annotationLength])
      .range([0, w]);

    mini
      .append("g")
      .selectAll("miniItems")

      .data(annotationData)
      .enter()
      .append("rect")
      .style("fill", d => {
        return myColor(d.name);
      })
      .attr("x", d => {
        return scale(d.start);
      })
      .attr("id", function(d) {
        return d.tag;
      })
      .attr("width", function(d) {
        return scale(d.end - d.start);
      })
      .attr("height", 15)
      .style("opacity", 0.75)
      .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", function(d) {
        d3.select(this).style("cursor", "default");
      })
      .on("click", function(d) {
        mouseclick(d, this);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "black")
          .style("stroke-width", 1);
        initTooltip()
          .html(
            `${d.annotation}
                          <br>
                          <b>Duration:</b> ${d.duration}. <b>Total Time:</b> ${d.totalTime}.<b> Annotation:</b> ${d.tag}.`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .transition()
          .style("opacity", 1)
          .style("opacity", 1)
          .style("background", myColor(d.name));
      });
    [...document.getElementById("annotations-badges").children].forEach(
      element => {
        element.style.backgroundColor = document.getElementById(
          element.innerText
        ).style.fill;
        element.style.opacity = 0.75;
      }
    );
  }

  render() {
    return <>{this.props.children}</>;
  }
}
