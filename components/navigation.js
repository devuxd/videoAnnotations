import React from "react";
import Router from "next/router";
import SearchBar from "./searchBar.js";

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
          <SearchBar annotation={this.annotation} />
        </nav>
        <br />
      </div>
    );
  }
}

export default Navigation;
