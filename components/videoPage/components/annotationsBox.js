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
    if (refElement === null) return;
    const annotationXStartposition = Number(refElement.getAttribute("x"));

    const arrowOffset =
      refElement.getAttribute("width") / 2 > 8
        ? refElement.getAttribute("width") / 4
        : -15;

    const backgroundColor = refElement.style.fill;
    refArrowElement.current.style.borderBottomColor = backgroundColor;
    refAnnotationEditForm.current.style.borderColor = backgroundColor;
    if (boxStyle.left !== undefined) return; // this means that the left property is overwritten by the parent
    if (arrowOffset > windowWidth) {
      //happens only if any of the subannotion is longer than the main annotaion
      refArrowElement.current.style.left = `${windowWidth - 30}px`;
    } else {
      refArrowElement.current.style.left = `${annotationXStartposition +
        arrowOffset}px`;
    }
    let left;
    if (annotationXStartposition + arrowOffset + 500 > windowWidth) {
      //right
      left = windowWidth - 500;
      refAnnotationEditForm.current.style.left = `${left}px`;
    } else if (annotationXStartposition + arrowOffset < 250) {
      //left
      left = annotationXStartposition + arrowOffset - 50;
      refAnnotationEditForm.current.style.left = `${left}px`;
    } else {
      //middel
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
          }

          .arrow-annotation {
            content: "";
            position: relative;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top: 0;
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
        onClick={e => {
          // this to stop the propagating  the click on the parent div
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </>
  );
}

export default AnnotationBox;
