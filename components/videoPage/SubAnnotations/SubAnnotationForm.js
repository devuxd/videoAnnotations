import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";
import * as d3 from "d3";
import color from "color";

function SubAnnotationForm(props) {
  //based on the selected annotation, display the sub-annotations related to it.
  //If non is selected or there are no sub-annotations display nothing.
  const selectedSubAnnotation = props.selectedSubAnnotation || {};
  console.log(selectedSubAnnotation);

  // const newTitle = useRef(null);

  // revisit this
  // const myColor = d3
  //   .scaleOrdinal()
  //   .domain(selectedSubAnnotation.map(element => element.annotations).flat(1))
  //   .range(d3.schemeSet2);

  // const getBackgroundColor = title => {
  //   return color(myColor(title)).darken(0.5);
  // };

  // adding new sub-annotation category
  const handleSubmitSubAnnotationTitle = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...selectedSubAnnotation,
      {
        title: newTitle.current.value,
        annotations: []
      }
    ];
    addSubAnnotation(newSubAnnotations);
    // newTitle.current.value = "";
  };
  // const updateSubAnnotation

  const addNewSubAnnotations = (newAnnotations, localNewAnnotation) => {
    //locating under what sub-annotation category the new added subannoation belong
    // then replace the new sub-annotations with the old one
    const localSubAnnotations = selectedSubAnnotation.map(annotation =>
      annotation.title === newAnnotations.title ? newAnnotations : annotation
    );
    addSubAnnotation(localSubAnnotations);

    changeActiveSubAnnotationIndex(localNewAnnotation.id);
    changeActiveSubAnnotation(localNewAnnotation);
  };

  const editAnnotation = annotation => {
    changeActiveSubAnnotation(annotation);
    console.log(annotation);
    activateTab(
      selectedSubAnnotation.findIndex(
        subAnnotation => subAnnotation.title === annotation.title
      )
    );
  };

  return (
    <>
      <br />

      {/* {Add_Edit_SubAnnotation(
        props.currentTime,
        selectedSubAnnotation[1],
        addNewSubAnnotations,
        props.selectedAnnotation,
        activeSubAnnotation
      )} */}
      <br />
    </>
  );
}

function Add_Edit_SubAnnotation(
  currentTime,
  selectedSubAnnotation,
  addNewSubAnnotations,
  selectedAnnotation,
  activeSubAnnotation
) {
  const refStartTime = React.createRef();
  const refEndTime = React.createRef();
  const refDescription = React.createRef();
  const subAnnotationId = React.createRef();

  subAnnotationId.current = activeSubAnnotation.id;

  const getCurrentTime = e => {
    const time = moment("2015-01-01")
      .startOf("day")
      .seconds(currentTime())
      .format("H:mm:ss");
    if (e.currentTarget.id === "start") {
      refStartTime.current.value = time;
    } else if (e.currentTarget.id === "end") {
      refEndTime.current.value = time;
    }
  };
  const handleSubmit = async () => {
    const localNewAnnotation = {
      startTime: refStartTime.current.value,
      endTime: refEndTime.current.value,
      start:
        moment.duration(refStartTime.current.value).asSeconds() -
        selectedAnnotation.start,
      end:
        moment.duration(refEndTime.current.value).asSeconds() -
        selectedAnnotation.start,
      annotation: refDescription.current.value,
      id:
        subAnnotationId.current === undefined
          ? selectedSubAnnotation.annotations.length
          : subAnnotationId.current,
      title: selectedSubAnnotation.title,
      duration: refStartTime.current.value + " - " + refEndTime.current.value
    };
    const start = new moment(localNewAnnotation.start * 1000);
    const end = new moment(localNewAnnotation.end * 1000);
    const diff = moment.duration(end.diff(start));
    localNewAnnotation.totalTime = `${diff.hours()}:${diff.minutes()}:${diff.seconds()}`;
    try {
      await googleLogin();
    } catch (e) {
      return;
    }
    selectedSubAnnotation.annotations = [
      ...selectedSubAnnotation.annotations.filter(
        annotation => annotation.id != localNewAnnotation.id
      ),
      localNewAnnotation
    ];
    addNewSubAnnotations(selectedSubAnnotation, localNewAnnotation);
  };

  return (
    <>
      <style jsx>
        {`
          .box-sub-annotation {
            position: relative;
            border-radius: 0.4em;
            border-top: 2px solid #d0d0d0;
            padding: 5px;
          }

          .arrow-sub-annotation {
            content: "";
            position: absolute;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-bottom-color: #d0d0d0;
            border-top: 0;
            margin-left: -20px;
            margin-top: -20px;
          }
        `}
      </style>

      <div className="input-group input-group-sm mb-3 box-sub-annotation">
        <p className="arrow-sub-annotation"></p>
        <input
          key={subAnnotationId.current + "startTime"}
          type="text"
          className="form-control"
          placeholder="Start time"
          aria-label="Start time"
          aria-describedby="button-addon2"
          defaultValue={activeSubAnnotation.startTime}
          ref={refStartTime}
        />
        <div className="input-group-append">
          <button
            onClick={getCurrentTime}
            className="btn btn-outline-secondary"
            type="button"
            id="start"
            style={{ width: "42px", paddingTop: "1px" }}
            data-placement="bottom"
            title="Get current time"
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
        <input
          key={subAnnotationId.current + "endTime"}
          type="text"
          className="form-control"
          placeholder="End time  "
          aria-label="Start time"
          aria-described="button-addon2"
          style={{ marginLeft: "10px" }}
          defaultValue={activeSubAnnotation.endTime}
          ref={refEndTime}
        />
        <div className="input-group-append">
          <button
            onClick={getCurrentTime}
            className="btn btn-outline-secondary"
            type="button"
            id="end"
            style={{ width: "42px", paddingTop: "1px" }}
            data-placement="bottom"
            title="Get current time"
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
      </div>
      <textarea
        key={subAnnotationId.current + "textarea"}
        className="form-control"
        id="exampleFormControlTextarea1"
        placeholder="Annotation description"
        rows="3"
        defaultValue={activeSubAnnotation.annotation}
        ref={refDescription}
      ></textarea>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          paddingTop: "10px"
        }}
      >
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
      <br />
    </>
  );
}

export default SubAnnotationForm;
