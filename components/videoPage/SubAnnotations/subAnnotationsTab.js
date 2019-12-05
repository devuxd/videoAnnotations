import React, { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import SubAnnotationsVis from "./subAnnotationsVis";
import { googleLogin } from "../../../API/db";
function SubAnnotationsTab(props) {
  let initialSubAnnotation = props.selectedAnnotation.subAnnotations || [];

  const [subAnnotations, addSubAnnotation] = useState(initialSubAnnotation);
  const [activeTab, activateTab] = useState(0);
  const [activeSubAnnotationIndex, changeActiveSubAnnotationIndex] = useState(
    0
  );
  const [activeSubAnnotation, changeActiveSubAnnotation] = useState({});
  const newTitle = useRef(null);
  const handleSubmit = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...subAnnotations,
      {
        title: newTitle.current.value,
        annotations: []
      }
    ];
    addSubAnnotation(newSubAnnotations);

    newTitle.current.value = "";
  };
  const addNewSubAnnotation = (newAnnotation, NewAnnotation) => {
    addSubAnnotation(
      subAnnotations.map(annotation =>
        annotation.title === newAnnotation.title ? newAnnotation : annotation
      )
    );
    props.updateAnnotations({ ...props.selectedAnnotation, subAnnotations });
    changeActiveSubAnnotationIndex(activeSubAnnotationIndex + 1);
    changeActiveSubAnnotation(NewAnnotation);
  };
  const editAnnotation = annotation => {
    changeActiveSubAnnotation(annotation);
    activateTab(
      subAnnotations.findIndex(
        subAnnotation => subAnnotation.title === annotation.title
      )
    );
  };

  return (
    <>
      <div id="ann-tooltip" />
      <br />

      <SubAnnotationsVis
        annotationData={subAnnotations
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
          if (tabIndex === subAnnotations.length) return;
          activateTab(tabIndex);
          changeActiveSubAnnotation({});
        }}
      >
        <TabList>
          {subAnnotations.map((annotation, index) => {
            return <Tab key={annotation.title}>{annotation.title}</Tab>;
          })}
          <Tab>
            <form className="form-inline" onSubmit={handleSubmit}>
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
        {subAnnotations.map((annotation, index) => (
          <TabPanel key={index}>
            {AddAnnotation(
              props.currentTime,
              subAnnotations[index],
              addNewSubAnnotation,
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
  subAnnotations,
  addNewSubAnnotation,
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
          ? subAnnotations.annotations.length
          : subAnnotationId.current,
      title: subAnnotations.title,
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
    subAnnotations.annotations = [
      ...subAnnotations.annotations.filter(
        annotation => annotation.id != localNewAnnotation.id
      ),
      localNewAnnotation
    ];
    addNewSubAnnotation(subAnnotations, localNewAnnotation);
    // refStartTime.current.value = "";
    // refEndTime.current.value = "";
    // refDescription.current.value = "";
    // subAnnotationId.current = "";
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
          aria-describedby="button-addon2"
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

export default SubAnnotationsTab;
