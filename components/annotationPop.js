import react from "react";
import AnnotationBox from "./annotationBox.js";

/**
 * AnnotationProp: prop for showing annotation details in time frame
 */
export default class AnnotationPop extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * secondConverter: function to covert hours, minutes, seconds into total seconds
   *
   * @param {*} h : hour (int)
   * @param {*} m : minute (int)
   * @param {*} s : seconds (int)
   */
  secondConverter(h, m, s) {
    return Number(h * 60 * 60) + Number(m * 60) + Number(s);
  }
  durationSeconds() {
    return {
      start: this.secondConverter(
        x.Duration.start.hours,
        x.Duration.start.minutes,
        x.Duration.start.seconds
      ),
      end: this.secondConverter(
        x.Duration.end.hours,
        x.Duration.end.minutes,
        x.Duration.end.seconds
      )
    };
  }
  render() {
    return (
      <div>
        {this.props.videoElem.Annotations.map(x => (
          <AnnotationBox
            passedSeek={this.props.passedSeek}
            annElement={x}
            durationSeconds={this.durationSeconds()}
          />
        ))}
      </div>
    );
  }
}
