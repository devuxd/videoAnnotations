import React from "react";
import * as d3 from "d3";
import color from "color";
/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.selectedElement;
    this.selectCategory;
  }

  componentDidMount() {
    let annotationLength = this.props.annotationLength;
    let subAnnotations = this.props.subAnnotations
      .map(subAnnotation => subAnnotation.annotations)
      .flat();

    const onMouseClick = (selectedSubAnnotation, subAnnotationVisElement) => {
      if (
        this.selectedElement &&
        this.selectedElement !== subAnnotationVisElement
      ) {
        this.selectCategory.style.opacity = 0.75;
        this.selectCategory.style.borderStyle = "none";
      }
      this.selectCategory = document.getElementById(
        `${selectedSubAnnotation.title}-badge`
      );
      this.selectedElement = subAnnotationVisElement;
      this.selectCategory.style.border = "3px black solid";
      this.selectCategory.style.opacity = 1;

      this.props.onSubAnnotationClick(selectedSubAnnotation);
      const annotationXStartposition = Number(
        subAnnotationVisElement.getAttribute("x")
      );
      const arrowOffset = subAnnotationVisElement.getAttribute("width") / 2;

      const arrowElement = document.getElementById("arrow-sub-annotation");
      const subAnnotationEditForm = document.getElementById(
        "box-sub-annotation"
      );
      arrowElement.style.left = `${annotationXStartposition + arrowOffset}px`;
      const backgroundColor = subAnnotationVisElement.style.fill;
      arrowElement.style.borderBottomColor = backgroundColor;
      subAnnotationEditForm.style.borderColor = backgroundColor;
      const annotationMaxWidth = document.getElementById("sub-annotations")
        .offsetWidth;

      if (annotationXStartposition + 800 > annotationMaxWidth) {
        subAnnotationEditForm.style.left = `${annotationMaxWidth - 800}px`;
      } else {
        subAnnotationEditForm.style.left = `${annotationXStartposition - 20}px`;
      }
    };
    const w = document.getElementById("YTplayer").offsetWidth;
    document.getElementById("box-annotation-expanded").style.width = `${w +
      10}px`;
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
      .style("fill", selectedSubAnnotation => {
        const strokeColor = color(myColor(selectedSubAnnotation.title));
        return strokeColor.darken(0.5);
      })
      .style("stroke-width", 2.5)
      .style("stroke-linecap", "butt")
      .attr("x", selectedSubAnnotation => {
        return scale(selectedSubAnnotation.start);
      })
      .attr("id", function(selectedSubAnnotation) {
        return selectedSubAnnotation.id;
      })
      .attr("width", function(selectedSubAnnotation) {
        return scale(selectedSubAnnotation.end - selectedSubAnnotation.start);
      })
      .attr("height", 15)
      .on("mouseover", function() {
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseleave", function() {
        d3.select(this).style("cursor", "default");
      })
      .on("click", function(selectedSubAnnotation) {
        onMouseClick(selectedSubAnnotation, this);
      });
    if (this.props.subAnnotations.length > 0) {
      const selectedSubAnnotation = this.props.subAnnotations[0].annotations[0];
      onMouseClick(
        selectedSubAnnotation,
        document.getElementById(selectedSubAnnotation.id)
      );
    }
    [...document.getElementById("sub-annotations-badges").children].forEach(
      (element, index) => {
        element.style.backgroundColor = document.getElementById(
          `${element.innerText}0`
        ).style.fill;
        if (index === 0) {
          element.style.border = "3px black solid";
          element.style.color = "white";
        } else {
          element.style.opacity = 0.75;
          element.style.color = "white";
        }
      }
    );
  }

  render() {
    return <>{this.props.children}</>;
  }
}
