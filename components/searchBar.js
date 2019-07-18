import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import { render } from "react-dom";

/**
 * SearchBar: component for search bar
 * need to fix: add event listener for enter key to search
 */
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          list="annotations"
          ref={this.props.annotation}
        />
        <datalist id="annotations">
          <option value="Debugging" />
          <option value="Testing" />
          <option value="Coding" />
          <option value="Reading code" />
          <option value="Writing code" />
        </datalist>
        <div className="input-group-append">
          <button
            id="myBtn"
            onClick={() =>
              Router.push(`/search/${this.props.annotation.current.value}`)
            }
            className="btn btn-outline-secondary"
            type="submit"
          >
            <FontAwesomeIcon icon={faSearch} /> &nbsp; Search
          </button>
        </div>
      </div>
    );
  }
}
