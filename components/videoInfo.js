import React from "react";

export default class VideoInfo extends React.Component {
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
    return (
      <h6>
        {/* Instances: 2 <br /> */}
        Total Time: {this.numberFormatter(this.props.vidElem.VideoLength.hours)}
        :{this.numberFormatter(this.props.vidElem.VideoLength.minutes)}:
        {this.numberFormatter(this.props.vidElem.VideoLength.seconds)} <br />{" "}
        <br />
        Programming Language: {this.props.vidElem.ProgrammingLanguage} <br />
        Programming Tools : {this.props.vidElem.ProgrammingTools} <br />
        Project URL(s):{" "}
        {this.props.vidElem.GithubURL.split(", ").map(x => x + "\r\n")} <br />
        Developer Github: {this.props.vidElem.DeveloperGithubURL} <br />
      </h6>
    );
  }
}
