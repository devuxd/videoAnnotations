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

  mouseClick = (d, e) => {
    this.props.seekTo(d.startTime);
    this.props.editAnnotation(d);
  };
  componentDidMount() {
    console.log();
    let annotationLength = this.props.annotationLength;
    let annotationData = this.props.annotationData;
    const arrowX = Number(
      this.props.selectedAnnotation.annotationVisElement.getAttribute("x")
    );
    const arrowOffset =
      this.props.selectedAnnotation.annotationVisElement.getAttribute("width") /
      2;
    console.log(arrowX, arrowOffset, `${arrowX + arrowOffset}px`);
    document.getElementsByClassName("arrow")[0].style.left = `${arrowX +
      arrowOffset}px`;
    // Tooltip
    const initTooltip = () => {
      d3.select(this.props.tooltipId)
        .selectAll("div")
        .remove();
      return d3
        .select(this.props.tooltipId)
        .append("div")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "2px 20px 2px 0px")
        .style("font-size", "14px");
    };

    const mouseClick = this.mouseClick;
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
        const strokeColor = color(myColor(d.title));
        return strokeColor.darken(0.5);
      })
      .style("stroke-width", 2.5)
      .style("stroke-linecap", "butt")
      .attr("x", d => {
        return scale(d.start);
      })
      .attr("id", function(d) {
        return d.title;
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
        mouseClick(d, this);

        initTooltip()
          .html(
            // `${d.annotation}
            // <br>
            //<b>Duration:</b> ${d.duration}.
            `<b>Total Time:</b> ${d.totalTime}`
            // .<b> Annotation:</b> ${d.title}.
          )
          .style("margin-left", scale(d.start) + "px")
          .style("width", scale(d.end - d.start) + "px")
          .transition()
          .style("color", "white")
          .style("background", color(myColor(d.title)).darken(0.7))
          .style("-webkit-text-stroke-color", "black")
          .style("-webkit-text-stroke-width", "0.3px")
          .style("text-align", "center")
          .style(
            "writing-mode",
            scale(d.end - d.start) < 50 ? "vertical-lr" : "inherit"
          );
      });
  }

  render() {
    return (
      <>
        <style jsx>
          {`
            .box {
              position: relative;
              border-radius: 0.4em;
              border-top: 4px solid #d0d0d0;
              padding: 5px;
            }

            .arrow {
              content: "";
              position: absolute;
              top: 0;
              width: 0;
              height: 0;
              border: 20px solid transparent;
              border-bottom-color: #d0d0d0;
              border-top: 0;
              margin-left: -20px;
              margin-top: -20px;
            }
          `}
        </style>
        <div className="box">
          {this.props.children}
          <div className="arrow"></div>
        </div>
      </>
    );
  }
}
