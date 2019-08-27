import React from "react";
import { render } from "react-dom";
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
              <Link
                href="/video/[sheetId]/[annotation]/[videoId]"
                as={`/video/${this.props.sheetId}/${annotation}/${this.props.videoId}`}
              >
                <button
                  type="button"
                  class="btn btn-outline-dark"
                  style={{ padding: "5px", margin: "5px" }}
                >
                  {annotation}
                </button>
              </Link>
              <br />
            </>
          );
        })}
        <br />
      </div>
    );
  }
}

export default AnnotationList;
