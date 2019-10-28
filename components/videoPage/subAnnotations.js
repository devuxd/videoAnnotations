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
  let refStartTime = React.createRef();
  let refEndTime = React.createRef();
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
  const handleSubmit = () => {};
  return (
    <>
      <div class="input-group input-group-sm mb-3" onSubmit={handleSubmit}>
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
      <input class="form-control" type="text" placeholder="Annotation title" />
      <br />
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        placeholder="Annotation description"
        rows="3"
      ></textarea>
      <div
        style={{
          display: "flex",
          "flex-direction": "row-reverse",
          paddingTop: "10px"
        }}
      >
        <button type="button" class="btn btn-success">
          Save
        </button>
      </div>
      <br />
    </>
  );
}

export default SubAnnotation;
