import React, { useEffect, useRef } from "react";

function AnnotationBox({ selectedAnnotationId, children }) {
  const refArrowElement = useRef(null);
  const refAnnotationEditForm = useRef(null);

  useEffect(() => {
    const refElement = document.getElementById(selectedAnnotationId);

    const annotationXStartposition = Number(refElement.getAttribute("x"));

    const arrowOffset = refElement.getAttribute("width") / 2;

    refArrowElement.current.style.left = `${annotationXStartposition +
      arrowOffset}px`;
    const backgroundColor = refElement.style.fill;
    refArrowElement.current.style.borderBottomColor = backgroundColor;
    refAnnotationEditForm.current.style.borderColor = backgroundColor;
    const annotationMaxWidth = document.getElementById("YTplayer").offsetWidth;

    if (annotationXStartposition + 800 > annotationMaxWidth) {
      refAnnotationEditForm.current.style.left = `${annotationMaxWidth -
        800}px`;
    } else {
      refAnnotationEditForm.current.style.left = `${annotationXStartposition -
        20}px`;
    }
  });

  return (
    <>
      <style jsx>
        {`
          .box-annotation {
            position: relative;
            border-radius: 0.4em;
            border: 3px solid;
            padding: 5px;
            width: 800px;
            transition: left 1s;
          }

          .arrow-annotation {
            content: "";
            position: relative;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top: 0;
            margin-left: -20px;
            transition: left 0.5s;
          }
        `}
      </style>

      <div
        ref={refArrowElement}
        className="arrow-annotation"
        id="arrow-annotation"
      ></div>
      <div
        ref={refAnnotationEditForm}
        className="box-annotation"
        id="box-annotation"
      >
        {children}
      </div>
    </>
  );
}

export default AnnotationBox;
