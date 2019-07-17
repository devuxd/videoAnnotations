import React from "react";

export default class VideoAuthor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { videoAuthor: undefined, isLoading: false, stateError: null };
  }

  /**
   * Making API request to noembed.com to retrieve video Author
   */
  componentDidMount() {
    var videoElementAuthor = this.props.videoElem.VideoURL;
    const videoId = videoElementAuthor.replace("https://youtu.be/", "");
    const url =
      "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" +
      videoId;

    this.setState({ isLoading: true });

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Oops! We weren't able to get the video Author!");
        }
      })
      .then(data =>
        this.setState({ videoAuthor: data.author_name, isLoading: false })
      )
      .catch(error => this.setState({ stateError: error, isLoading: false }));
  }

  render() {
    const { hits, isLoading, error } = this.state;
    if (error) {
      return <p>Oops! Something went wrong!</p>;
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }
    return <div>{this.state.videoAuthor}</div>;
  }
}
