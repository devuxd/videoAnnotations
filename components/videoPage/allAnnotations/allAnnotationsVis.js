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
    const selectCategory = document.getElementById(
      `${selectedAnnotation.title}-badge`
    );
    selectCategory.style.border = "2px black solid";

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
    // this becuase annotationVisElement.setAttribute does not work 🤦‍♂️
    document
      .getElementById(annotationVisElement.getAttribute("id"))
      .setAttribute("stroke", "black");
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
      .attr("width", function(d) {
        return scale(d.end - d.start);
      })
      .attr("stroke", d => {
        if (
          this.props.selectedAnnotation == null ||
          this.props.selectedAnnotation.id != d.id
        )
          return "none";
        return "black";
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

    [...document.getElementById("annotations-badges").children].forEach(
      (element, index) => {
        element.style.backgroundColor = document.getElementById(
          `${element.innerText}${index + 11}` // becuase the spreedsheet start
        ).style.fill;
        if (
          this.props.selectedAnnotation != null &&
          element.innerText === this.props.selectedAnnotation.title
        ) {
          console.log(this.props);
          element.style.border = "2px black solid";
        } else {
          element.style.border = "none";
        }
      }
    );
  }

  render() {
    return <>{this.props.children}</>;
  }
}
