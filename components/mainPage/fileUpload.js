import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function FileUpload() {
  const [sheetId, updateSheetId] = useState(
    // "1cKmJ-mP5ahtnki6cqilwd2NSBM9t_G6vGXcbsZ6K_J0"
    ""
  );

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        placeholder="Spreadsheet ID"
        list="annotations"
        onChange={event => updateSheetId(event.target.value)}
        value={sheetId}
      />
      <Link href="/dataset/[sheetId]" as={`/dataset/${sheetId}`}>
        <button
          style={{ width: "48px", "padding-top": "0px" }}
          className="btn btn-outline-secondary"
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

export default FileUpload;
