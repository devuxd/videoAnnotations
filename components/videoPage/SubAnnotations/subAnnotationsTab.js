import React, { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import SubAnnotationsVis from "./subAnnotationsVis";
import { googleLogin } from "../../../API/db";
import * as d3 from "d3";
import color from "color";

function SubAnnotationsTab(props) {
  let initialSubAnnotation = props.selectedAnnotation.subAnnotations || [];
  const [activeSubAnnotations, addSubAnnotation] = useState(
    initialSubAnnotation
  );
  const [activeTab, activateTab] = useState(0);
  const [activeSubAnnotationIndex, changeActiveSubAnnotationIndex] = useState(
    0
  );
  const [activeSubAnnotation, changeActiveSubAnnotation] = useState({});
  const newTitle = useRef(null);

  var myColor = d3
    .scaleOrdinal()
    .domain(activeSubAnnotations.map(element => element.annotations).flat(1))
    .range(d3.schemeSet2);

  const getBackgroundColor = title => {
    return color(myColor(title)).darken(0.5);
  };

  const handleSubmitSubAnnotationTitle = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...activeSubAnnotations,
      {
        title: newTitle.current.value,
        annotations: []
      }
    ];
    addSubAnnotation(newSubAnnotations);

    newTitle.current.value = "";
  };

  const addNewSubAnnotations = (newAnnotations, localNewAnnotation) => {
    const localSubAnnotations = activeSubAnnotations.map(annotation =>
      annotation.title === newAnnotations.title ? newAnnotations : annotation
    );
    addSubAnnotation(localSubAnnotations);
    const { subAnnotations, ...selectedAnnotation } = props.selectedAnnotation;
    props.updateAnnotations({
      ...selectedAnnotation,
      subAnnotations: localSubAnnotations
    });
    changeActiveSubAnnotationIndex(activeSubAnnotationIndex + 1);
    changeActiveSubAnnotation(localNewAnnotation);
  };

  const editAnnotation = annotation => {
    changeActiveSubAnnotation(annotation);
    activateTab(
      activeSubAnnotations.findIndex(
        subAnnotation => subAnnotation.title === annotation.title
      )
    );
  };

  return (
    <>
      <div id="ann-tooltip" />
      <br />

      <SubAnnotationsVis
        annotationData={activeSubAnnotations
          .map(element => element.annotations)
          .flat(1)}
        seekTo={props.seekTo}
        currentTime={props.currentTime}
        annotationLength={props.annotationLength}
        divId={"#sub-annotations"}
        tooltipId={"#subAnn-tooltip"}
        key={activeSubAnnotationIndex}
        selectedAnnotation={props.selectedAnnotation}
        editAnnotation={editAnnotation}
      >
        <div id="sub-annotations" style={{ bottom: "8px" }}></div>
        <div id="subAnn-tooltip" style={{ bottom: "8px" }}></div>
      </SubAnnotationsVis>
      <Tabs
        selectedIndex={activeTab}
        onSelect={tabIndex => {
          if (tabIndex === activeSubAnnotations.length) return;
          activateTab(tabIndex);
          changeActiveSubAnnotation({});
        }}
      >
        <TabList>
          {activeSubAnnotations.map((annotation, index) => {
            return (
              <Tab key={annotation.title}>
                <p
                  style={{
                    borderTop: `5px solid ${getBackgroundColor(
                      annotation.title
                    )}`
                  }}
                >
                  {annotation.title}{" "}
                </p>
              </Tab>
            );
          })}
          <Tab>
            <form
              className="form-inline"
              onSubmit={handleSubmitSubAnnotationTitle}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                id="formGroupExampleInput2"
                placeholder="Add Sub-annotation"
                ref={newTitle}
                key={"newTab"}
              />
            </form>
          </Tab>
        </TabList>
        {activeSubAnnotations.map((annotation, index) => (
          <TabPanel key={index}>
            {AddAnnotation(
              props.currentTime,
              activeSubAnnotations[index],
              addNewSubAnnotations,
              props.selectedAnnotation,
              activeSubAnnotation
            )}
          </TabPanel>
        ))}
      </Tabs>
      <br />
    </>
  );
}

function AddAnnotation(
  currentTime,
  activeSubAnnotations,
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
  const handleSubmitNewSubAnnotation = async () => {
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
          ? activeSubAnnotations.annotations.length
          : subAnnotationId.current,
      title: activeSubAnnotations.title,
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
    activeSubAnnotations.annotations = [
      ...activeSubAnnotations.annotations.filter(
        annotation => annotation.id != localNewAnnotation.id
      ),
      localNewAnnotation
    ];
    addNewSubAnnotations(activeSubAnnotations, localNewAnnotation);
  };

  return (
    <>
      <div className="input-group input-group-sm mb-3">
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
          onClick={handleSubmitNewSubAnnotation}
        >
          Save
        </button>
      </div>
      <br />
    </>
  );
}

export default SubAnnotationsTab;
