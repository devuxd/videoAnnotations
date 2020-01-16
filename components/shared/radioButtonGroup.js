import React from "react";
function RadioButtonGroup({ options, onChange, selected, colorScheme }) {
  const color = colorScheme();

  return (
    <>
      <div className="btn-group mr-2" role="group" aria-label="First group">
        {options.map(option => (
          <button
            type="button"
            className="btn btn-default"
            value={option}
            onClick={onChange}
            style={
              selected === option
                ? { backgroundColor: color(option), color: "white" }
                : { borderBottom: `2px solid ${color(option)}` }
            }
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}

export default RadioButtonGroup;
