import React, { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";

function SubAnnotation(props) {
  const [subannotations, addSubannotation] = useState([
    { title: 1, annotation: [] }
  ]);
  const newTitle = useRef(null);
  const handleSubmit = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...subannotations,
      { title: newTitle.current.value, annotation: [] }
    ];
    addSubannotation(newSubAnnotations);
    newTitle.current.value = "";
  };
  return (
    <>
      <div id="ann-tooltip" />
      <SetVisulations />
      <Tabs>
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
          <TabPanel key={index}>{AddAnnotation(props.currentTime)}</TabPanel>
        ))}
      </Tabs>
    </>
  );
}

function SetVisulations() {
  return <>Visualization Here</>;
}

function AddAnnotation(currentTime) {
  const startTime = useRef(null);
  const endTime = useRef(null);

  const handleSubmit = () => {};
  const getCurrentTime = e => {
    const time = moment("2015-01-01")
      .startOf("day")
      .seconds(currentTime())
      .format("H:mm:ss");
    if (e.currentTarget.id === "start") {
      startTime.current.value = time;
    } else if (e.currentTarget.id === "end") {
      endTime.current.value = time;
    }
  };
  return (
    <div class="input-group input-group-sm mb-3" onSubmit={handleSubmit}>
      <input
        type="text"
        class="form-control"
        placeholder="Start time  "
        aria-label="Start time"
        aria-describedby="button-addon2"
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
  );
}

export default SubAnnotation;
