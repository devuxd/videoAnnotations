import React from "react";

export default class VideoInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h6>
        Instances: 2 <br />
        Total Time: {this.props.vidElem.VideoLength.hours}:
        {this.props.vidElem.VideoLength.minutes}:
        {this.props.vidElem.VideoLength.seconds}
      </h6>
    );
  }
}
