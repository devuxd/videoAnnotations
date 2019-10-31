import React, { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import MainAnnotations from "./mainAnnotations";

function SubAnnotation(props) {
  const [subannotations, addSubAnnotation] = useState([]);
  const [activeTab, activiateTab] = useState(0);
  const newTitle = useRef(null);
  const handleSubmit = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...subannotations,
      {
        title: newTitle.current.value,
        annotations: []
      }
    ];
    addSubAnnotation(newSubAnnotations);
    newTitle.current.value = "";
  };
  const addNewSubAnnotation = newSubAnnotation => {
    addSubAnnotation([
      ...subannotations.slice(0, activeTab),
      newSubAnnotation,
      ...subannotations.slice(activeTab + 1, subannotations.length)
    ]);
    console.log(subannotations);
  };
  return (
    <>
      <div id="ann-tooltip" />
      <br />
      <div
        style={{
          height: "20px",
          "border-color": "black",
          "border-style": "dashed"
        }}
      >
        {subannotations.length > 0 && (
          <MainAnnotations
            annotations={subannotations[activeTab].annotations}
            seekTo={props.seekTo}
            currentTime={props.currentTime}
            annotationLength={props.annotationLength}
            divId={"#sub-annotations"}
            tooltipId={"#subAnn-tooltip"}
          >
            <div id="sub-annotations" style={{ bottom: "8px" }}></div>
            <div id="subAnn-tooltip"></div>
          </MainAnnotations>
        )}
      </div>
      <Tabs
        selectedIndex={activeTab}
        onSelect={tabIndex => activiateTab(tabIndex)}
      >
        <TabList>
          {subannotations.map(annotation => (
            <Tab>{annotation.title}</Tab>
          ))}
          <Tab>
            <form class="form-inline" onSubmit={handleSubmit}>
              <input
                type="text"
                class="form-control form-control-sm"
                id="formGroupExampleInput2"
                placeholder="Add Sub-annotation"
                ref={newTitle}
              />
            </form>
          </Tab>
        </TabList>
        {subannotations.map((annotation, index) => (
          <TabPanel key={index}>
            {AddAnnotation(
              props.currentTime,
              subannotations[index],
              addNewSubAnnotation
            )}
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}

function SetVisulations() {
  return (
    <>
      <div
        style={{
          height: "20px",
          "border-color": "black",
          "border-style": "dashed"
        }}
      >
        <MainAnnotations
          annotations={props.video.Annotations}
          seekTo={seekTo}
          currentTime={currentTime}
          annotationLength={
            props.video.VideoLength.hours * 3600 +
            props.video.VideoLength.minutes * 60 +
            props.video.VideoLength.seconds
          }
          divId={"#sub-annotations"}
          tooltipId={"#subAnn-tooltip"}
        >
          <div id="sub-annotations" style={{ bottom: "8px" }}></div>
        </MainAnnotations>
      </div>
    </>
  );
}

function AddAnnotation(currentTime, subannotations, addNewSubAnnotation) {
  const refStartTime = React.createRef();
  const refEndTime = React.createRef();
  const refDescription = React.createRef();

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
  const handleSubmit = () => {
    const localNewAnnotation = {
      startTime: refStartTime.current.value,
      endTime: refEndTime.current.value,
      description: refDescription.current.value
    };
    subannotations.annotations.push(localNewAnnotation);
    addNewSubAnnotation(subannotations);
  };

  return (
    <>
      <div class="input-group input-group-sm mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Start time  "
          aria-label="Start time"
          aria-describedby="button-addon2"
          ref={refStartTime}
        />
        <div class="input-group-append">
          <button
            onClick={getCurrentTime}
            class="btn btn-outline-secondary"
            type="button"
            id="start"
            style={{ width: "42px", "padding-top": "1px" }}
            data-placement="bottom"
            title="Get current time"
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
        <input
          type="text"
          class="form-control"
          placeholder="End time  "
          aria-label="Start time"
          aria-describedby="button-addon2"
          style={{ "margin-left": "10px" }}
          ref={refEndTime}
        />
        <div class="input-group-append">
          <button
            onClick={getCurrentTime}
            class="btn btn-outline-secondary"
            type="button"
            id="end"
            style={{ width: "42px", "padding-top": "1px" }}
            data-placement="bottom"
            title="Get current time"
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
      </div>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        placeholder="Annotation description"
        rows="3"
        ref={refDescription}
      ></textarea>
      <div
        style={{
          display: "flex",
          "flex-direction": "row-reverse",
          paddingTop: "10px"
        }}
      >
        <button type="button" class="btn btn-success" onClick={handleSubmit}>
          Save
        </button>
      </div>
      <br />
    </>
  );
}
const displayAnnotations = () => {};

export default SubAnnotation;
