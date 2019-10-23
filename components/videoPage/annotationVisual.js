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
    const filteredAnnotations = this.props.videoElem.Annotations;
    const vidLength =
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
          getCurrentDuration={this.props.getCurrentDuration}
        />
      </div>
    );
  }
}
