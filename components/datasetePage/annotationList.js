import React from "react";
import Link from "next/link";

class AnnotationList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let uniqueAnnotation = Array.from(
      new Set(this.props.video.Annotations.map(annotation => annotation.Tags))
    );
    return (
      <div>
        {uniqueAnnotation.map(annotation => {
          return (
            <>
              <div
                href="/video/[sheetId]/[annotation]/[videoId]"
                as={`/video/${this.props.sheetId}/${annotation}/${this.props.videoId}`}
              >
                <button
                  class="btn btn-outline-dark"
                  style={{ padding: "5px", margin: "5px" }}
                  disabled
                >
                  {annotation}
                </button>
              </div>
              <br />
            </>
          );
        })}
        <Link
          href="/video/[sheetId]/[videoId]"
          as={`/video/${this.props.sheetId}/${this.props.videoId}`}
        >
          <button
            type="button"
            class="btn btn-outline-dark"
            style={{ padding: "5px", margin: "5px" }}
          >
            Watch the video
          </button>
        </Link>
        <br />
      </div>
    );
  }
}

export default AnnotationList;
