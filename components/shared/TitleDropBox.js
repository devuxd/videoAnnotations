import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";

function TitleDropBox({ options, onChange, selected, colorScheme }) {
  // const color = colorScheme();
  return (
    <div style={{ width: "415px" }}>
      <Typeahead
        allowNew
        newSelectionPrefix="Add a new item"
        options={options.map(title => ({ label: title, id: title }))}
        placeholder="title"
        onBlur={e => {
          onChange([{ label: e.target.value }]);
        }}
        defaultSelected={[selected]}
        id="title-annotation"
      />
    </div>
  );
}

export default TitleDropBox;
