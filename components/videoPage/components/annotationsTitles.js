import React from "react";

function AnnotationsTitles({ titles, selectedTitle, colorScheme }) {
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
            backgroundColor: colorScheme(title),
            cursor: "default"
          }}
          title={`<bold>${title}</bold>`}
        >
          {title}
        </span>
      ))}
    </>
  );
}

export default AnnotationsTitles;
