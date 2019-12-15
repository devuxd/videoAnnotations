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

  mouseClick = (selectedAnnotation, annotationVisElement) => {
    this.props.onAnnotationClick(selectedAnnotation);
    if (this.selectedElement && this.selectedElement !== annotationVisElement) {
      this.selectedElement.style.opacity = 0.75;
      this.selectedElement.style.stroke = "none";
      this.selectCategory.style.opacity = 0.75;
      this.selectCategory.style.borderStyle = "none";
    }
    this.selectCategory = document.getElementById(
      `${selectedAnnotation.title}-badge`
    );
    this.selectedElement = annotationVisElement;
    this.selectCategory.style.borderStyle = "solid";
    this.selectCategory.style.opacity = 1;

    const annotationXStartposition = Number(
      annotationVisElement.getAttribute("x")
    );
    const arrowOffset = annotationVisElement.getAttribute("width") / 2;

    const arrowElement = document.getElementById("arrow-annotation");
    const annotationEditForm = document.getElementById("box-annotation");
    arrowElement.style.left = `${annotationXStartposition + arrowOffset}px`;
    annotationEditForm.style.display = "block";
    const backgroundColor = annotationVisElement.style.fill;
    arrowElement.style.borderBottomColor = backgroundColor;
    annotationEditForm.style.borderColor = backgroundColor;
    const annotationMaxWidth = document.getElementById("video-annotations")
      .offsetWidth;
    if (annotationXStartposition + 800 > annotationMaxWidth) {
      annotationEditForm.style.left = `${annotationMaxWidth - 800}px`;
    } else {
      annotationEditForm.style.left = `${annotationXStartposition - 20}px`;
    }
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

    var myColor = d3
      .scaleOrdinal()
      .domain(annotationData)
      .range(d3.schemeSet2);
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
        return myColor(d.title);
      })
      .attr("x", d => {
        return scale(d.start);
      })
      .attr("id", function(d) {
        return d.title + d.id;
      })
      .attr("title", function(d) {
        return d.title;
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
        mouseClick(d, this);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "black")
          .style("stroke-width", 1);
      });
    [...document.getElementById("annotations-badges").children].forEach(
      element => {
        element.style.backgroundColor = document.querySelectorAll(`
          [title=${element.innerText}]`)[0].style.fill;
        element.style.opacity = 0.75;
      }
    );
  }

  render() {
    return <>{this.props.children}</>;
  }
}
