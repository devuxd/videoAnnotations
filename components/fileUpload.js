import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import { render } from "react-dom";

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Video Link"
            id="basic-url"
            aria-describedby="basic-addon3"
          />
        </div>

        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile02"
            />
            <label className="custom-file-label" for="inputGroupFile02">
              Annotations (JSON File)
            </label>
          </div>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" id="">
              <FontAwesomeIcon icon={faUpload} /> &nbsp; Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
