import React from "react";

/**
 * AnnotationBox: component for detailed annotations list
 */
export default class AnnotationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.annElement);
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
            {this.props.annElement.Duration.start.hours}:
            {this.props.annElement.Duration.start.minutes}:
            {this.props.annElement.Duration.start.seconds}
          </button>
          <span> until </span>
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={() => {
              this.props.passedSeek(totalEndSec);
            }}
          >
            {this.props.annElement.Duration.end.hours}:
            {this.props.annElement.Duration.end.minutes}:
            {this.props.annElement.Duration.end.seconds}
          </button>
        </h7>
        <br />
        <br />
        Description:
        <br />
        <textarea style={{ resize: "none" }} readOnly rows="3" cols="60">
          {this.props.annElement.Description}
        </textarea>
        <br />
      </div>
    );
  }
}
