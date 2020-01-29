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

    const backgroundColor = refElement.style.fill;
    refArrowElement.current.style.borderBottomColor = backgroundColor;
    refAnnotationEditForm.current.style.borderColor = backgroundColor;
    if (boxStyle.left !== undefined) return; // this means that the left property is overwritten by the parent
    refArrowElement.current.style.left = `${annotationXStartposition +
      arrowOffset}px`;
    let left;
    if (annotationXStartposition + 500 > windowWidth) {
      left = windowWidth - 500;
      refAnnotationEditForm.current.style.left = `${left}px`;
    } else if (annotationXStartposition + arrowOffset < 250) {
      left = annotationXStartposition - 20;
      refAnnotationEditForm.current.style.left = `${left}px`;
    } else {
      left = annotationXStartposition + arrowOffset - 250;
      refAnnotationEditForm.current.style.left = `${left}px`;
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
            background-color: white;
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
