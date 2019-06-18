import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import VideoListing from "../components/videoListing.js";

/**
 * Navigation: component for navigation bar
 */
class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.annotation = React.createRef();
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <a className="navbar-brand" style={{ width: "20%" }} href="/">
            <img
              style={{
                width: "100%",
                display: "block",
                marginLeft: "1%",
                marginRight: "0px",
                marginBottom: "7%"
              }}
              src="../static/observedev.png"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                list="annotations"
                ref={this.annotation}
              />
              <datalist id="annotations">
                <option value="Debugging" />
                <option value="Testing" />
                <option value="Coding" />
                <option value="Reading code" />
                <option value="Writing code" />
              </datalist>
              <div
                className="input-group-append"
                onClick={() =>
                  Router.push(`/search/${this.annotation.current.value}`)
                }
              >
                <button className="btn btn-outline-secondary" type="submit">
                  <FontAwesomeIcon icon={faSearch} /> &nbsp; Search
                </button>
              </div>
            </div>
          </div>
        </nav>
        <br />
      </div>
    );
  }
}

export default Navigation;
