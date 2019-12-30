import React, { useEffect, useRef } from "react";

function AnnotationBox({
  selectedAnnotationId,
  boxStyle,
  windowWidth,
  children
}) {
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
    if (boxStyle.left !== undefined) return; // this means that the left property is overwritten by the parent

    if (annotationXStartposition + 800 > windowWidth) {
      refAnnotationEditForm.current.style.left = `${windowWidth - 800}px`;
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
            padding: 5px;
            transition: all 1s;
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
            transition: all 0.5s;
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
        style={boxStyle}
      >
        {children}
      </div>
    </>
  );
}

export default AnnotationBox;
