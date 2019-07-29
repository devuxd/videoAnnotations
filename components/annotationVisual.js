import React from "react";
import Chart from "./chart";

/**
 * AnnotationVisual: component for visual annotations under status bar
 *
 * takes in annotation element, video length
 */
export default class AnnotationVisual extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var filteredAnnotations = this.props.videoElem.Annotations.filter(x =>
      x.Tags.includes(this.props.searchQuery)
    );
    // var filteredAnnotations = this.props.videoElem.Annotations;
    var vidLength =
      this.props.videoElem.VideoLength.hours +
      ":" +
      this.props.videoElem.VideoLength.minutes +
      ":" +
      this.props.videoElem.VideoLength.seconds;

    return (
      <div>
        <Chart
          passedSeek={this.props.passedSeek}
          vidLength={vidLength}
          annotations={filteredAnnotations}
          searchQuery={this.props.searchQuery}
        />
      </div>
    );
  }
}
