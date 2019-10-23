import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Styling definitions
 */
const tabListItem = {
  display: "inline-block",
  listStyle: "none",
  marginBottom: "-1px",
  padding: "0.5rem 0.75rem",
  cursor: "pointer"
};

const tabListActive = {
  backgroundColor: "white",
  border: "solid #ccc"
};

/**
 * Tab: component for each individual tab
 */
export default class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label }
    } = this;

    let className = "tabListItem";

    if (activeTab === label) {
      className += " tabListActive";
    }

    return (
      <li className={className} onClick={onClick} style={tabListItem}>
        {label}
      </li>
    );
  }
}
