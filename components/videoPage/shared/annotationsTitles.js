import React from "react";

function AnnotationsTitles({ titles, selectedTitle, colorScheme }) {
  const color = colorScheme();
  return (
    <>
      {titles.map((title, index) => (
        <span
          key={index}
          className="badge badge-pill"
          id={`${title}-badge`}
          style={{
            display: "block",
            marginBottom: "2px",
            color: "white",
            border: title === selectedTitle ? "2px black solid" : "none",
            backgroundColor: color(title)
          }}
        >
          {title}
        </span>
      ))}
    </>
  );
}

export default AnnotationsTitles;
