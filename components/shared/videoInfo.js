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

  /**
   * urlFormatter: function to style Github URLs in a list manner
   *
   * @param {*} arr : array of github url strings
   */
  urlFormatter(arr) {
    let rows = [];
    if (Array.isArray(arr)) {
      arr.map(item =>
        rows.push(
          <li>
            <a href={item}>{item}</a>
          </li>
        )
      );
    }
    return rows;
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
        <ul style={{ listStyle: "square inside" }}>
          {this.urlFormatter(this.props.vidElem.GithubURL.split(", "))}
        </ul>
        Developer Github: <span> </span>
        <a href={this.props.vidElem.DeveloperGithubURL}>
          {this.props.vidElem.DeveloperGithubURL}
        </a>{" "}
        <br />
      </h6>
    );
  }
}
