import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";
import { RadioButtonGroup } from "react-rainbow-components";

function SubAnnotationAddForm({
  getCurrentTime,
  addNewSubAnnotation,
  selectedAnnotationStart
}) {
  return (
    <>
      {AddSubAnnotation(
        getCurrentTime,
        addNewSubAnnotation,
        selectedAnnotationStart
      )}
    </>
  );
}

function AddSubAnnotation(
  getCurrentTime,
  addNewSubAnnotation,
  selectedAnnotationStart
) {
  // getting references
  const refStartTime = React.createRef();

  // getting the current time of the video when the user ask for it
  const getTime = e => {
    const time = moment("2015-01-01")
      .startOf("day")
      .seconds(getCurrentTime())
      .format("H:mm:ss");
    refStartTime.current.value = time;
  };

  const handleSubmit = async () => {
    const localNewAnnotation = {
      startTime: refStartTime.current.value,
      endTime: "",
      start:
        moment.duration(refStartTime.current.value).asSeconds() -
        selectedAnnotationStart,
      end:
        moment.duration(refStartTime.current.value).asSeconds() -
        selectedAnnotationStart +
        1,
      annotation: "",
      id: "", //title + index of the subannotation
      title: "", // title from the DOM ref
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
    addNewSubAnnotation(localNewAnnotation);
  };

  const addTitle = event => {
    console.log(event.target.value);
  };

  return (
    <>
      <style jsx>
        {`
          .box-sub-annotation {
            position: relative;
            border-radius: 0.4em;
            border: 3px solid;
            padding: 5px;
            width: 800px;
            transition: left 1s;
          }
        `}
      </style>

      <div className="box-sub-annotation" id="box-sub-annotation">
        <label for="StartTime" style={{ margin: "3px", paddingLeft: "5px" }}>
          Annotation:
        </label>
        <RadioButtonGroup
          id="radio-button-group-component-1"
          options={[
            { value: "test1", lable: "Test1" },
            { value: "test2", lable: "Test2" }
          ]}
          onChange={addTitle}
        />
        <div className="input-group input-group-sm mb-3">
          <label for="StartTime" style={{ margin: "3px", paddingLeft: "5px" }}>
            Start:
          </label>
          <input
            id="StartTime"
            key={"startTime"}
            type="text"
            className="form-control"
            placeholder="Start time"
            aria-label="Start time"
            aria-describedby="button-addon2"
            defaultValue={""}
            ref={refStartTime}
          />
          <div className="input-group-append">
            <button
              onClick={getTime}
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
        </div>
      </div>
    </>
  );
}

export default SubAnnotationAddForm;
