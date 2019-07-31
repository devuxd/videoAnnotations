import React from "react";

/**
 * AnnotationBox: component for detailed annotations list
 */
export default class AnnotationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * numberFormatter: function to style single digits number with a preceding 0
   *
   * @param {*} num : number to style
   */
  numberFormatter(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  render() {
    const totalStartSec =
      Number(this.props.annElement.Duration.start.hours * 60 * 60) +
      Number(this.props.annElement.Duration.start.minutes * 60) +
      Number(this.props.annElement.Duration.start.seconds);

    const totalEndSec =
      Number(this.props.annElement.Duration.end.hours * 60 * 60) +
      Number(this.props.annElement.Duration.end.minutes * 60) +
      Number(this.props.annElement.Duration.end.seconds);

    return (
      <div
        style={{
          borderStyle: "solid",
          borderColor: "#DCDCDC",
          backgroundColor: "#DCDCDC",
          borderRadius: "8px",
          paddingTop: "2%",
          paddingBottom: "1.3%",
          paddingLeft: "5%",
          paddingRight: "5%"
        }}
      >
        <h7>
          Time Duration: <span> </span>
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={() => {
              this.props.passedSeek(totalStartSec);
            }}
          >
            {this.numberFormatter(this.props.annElement.Duration.start.hours)}:
            {this.numberFormatter(this.props.annElement.Duration.start.minutes)}
            :
            {this.numberFormatter(this.props.annElement.Duration.start.seconds)}
          </button>
          <span> until </span>
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={() => {
              this.props.passedSeek(totalEndSec);
            }}
          >
            {this.numberFormatter(this.props.annElement.Duration.end.hours)}:
            {this.numberFormatter(this.props.annElement.Duration.end.minutes)}:
            {this.numberFormatter(this.props.annElement.Duration.end.seconds)}
          </button>
        </h7>
        <div style={{ display: "inline", marginLeft: "65px" }}>
          Tag(s): {this.props.annElement.Tags}
        </div>
        <br />
        Description:
        <br />
        <textarea style={{ resize: "none" }} readOnly rows="3" cols="68">
          {this.props.annElement.Description}
        </textarea>
        <br />
      </div>
    );
  }
}
