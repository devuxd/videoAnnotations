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
      arr.map((item, index) =>
        rows.push(
          <li key={index}>
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
        Total Time: {this.numberFormatter(this.props.vidElem.videoLength.hours)}
        :{this.numberFormatter(this.props.vidElem.videoLength.minutes)}:
        {this.numberFormatter(this.props.vidElem.videoLength.seconds)} <br />{" "}
        <br />
        Programming Language: {this.props.vidElem.programmingLanguage} <br />
        Programming Tools : {this.props.vidElem.programmingTools} <br />
        Project URL(s):{" "}
        <ul style={{ listStyle: "square inside" }}>
          {this.urlFormatter(this.props.vidElem.githubURL.split(", "))}
        </ul>
        Developer Github: <span> </span>
        <a href={this.props.vidElem.developerGithubURL}>
          {this.props.vidElem.developerGithubURL}
        </a>{" "}
        <br />
      </h6>
    );
  }
}
