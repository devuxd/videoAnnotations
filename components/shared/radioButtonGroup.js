import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

function RadioButtonGroup({ options, onChange, selected, colorScheme }) {
  const color = colorScheme();

  return (
    <>
      <Typeahead
        allowNew
        newSelectionPrefix="Add a new item"
        options={options.map(title => ({ label: title, id: title }))}
        placeholder="title"
        onChange={onChange}
      />
    </>
  );
}

export default RadioButtonGroup;
