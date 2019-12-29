import React from "react";
import * as d3 from "d3";
import color from "color";
import { secondColor } from "./../../../API/color";
/**
 * d3.js scatterplot component to visualize annotations
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.selectedElement;
    this.color = secondColor();
  }

  componentDidMount() {
    let annotationLength = this.props.annotationLength;
    let subAnnotations = this.props.subAnnotations
      .map(subAnnotation => subAnnotation.annotations)
      .flat();

    const onMouseClick = selectedSubAnnotation => {
      this.props.onSubAnnotationClick(selectedSubAnnotation);
    };
    const w = document.getElementById("YTplayer").offsetWidth;
    document.getElementById("box-annotation").style.width = `${w + 10}px`;
    var mini = d3
      .select(this.props.divId)
      .append("svg")
      .attr("width", w)
      .attr("height", 22)
      .attr("class", "chart");

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
        const bgcolor = color(this.color(selectedSubAnnotation.title));
        return bgcolor.darken(0.2);
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
  }

  render() {
    return <>{this.props.children}</>;
  }
}
