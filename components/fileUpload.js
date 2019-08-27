import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import { render } from "react-dom";
import Link from "next/link";

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheetId: "1IZgX6i_yiuq9U3oksIl5aCaLq2RZuu-aU0p4kzAhaNY"
    };
    this.updateSheetId = this.updateSheetId.bind(this);
  }
  updateSheetId(event) {
    this.setState({ sheetId: event.target.value });
  }

  render() {
    return (
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          placeholder="Spreadsheet ID"
          list="annotations"
          onChange={this.updateSheetId}
          value={this.state.sheetId}
        />
        <Link href="/dataset/[sheetId]" as={`/dataset/${this.state.sheetId}`}>
          <button
            style={{ width: "48px", "padding-top": "0px" }}
            className="btn btn-outline-secondary"
            onClick={this.handleSubmit}
            data-toggle="tooltip"
            data-placement="top"
            title="Browse The Dataset"
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
        </Link>
      </div>
    );
  }
}
