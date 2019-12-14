import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faArrowRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";

function AnnotationEditForm({
  currentTime,
  expandAnnotation,
  selectedAnnotation
}) {
  //based on the selected annotation, display the sub-annotations related to it.
  //If non is selected or there are no sub-annotations display nothing.

  return (
    <>
      {editAnnotation(
        currentTime,
        selectedAnnotation,
        // updatedAnnotation
        expandAnnotation
      )}
      <br />
    </>
  );
}

function editAnnotation(
  currentTime,
  selectedAnnotation,
  expandAnnotation
  // updatedAnnotation
) {
  // getting references
  const refStartTime = React.createRef();
  const refEndTime = React.createRef();
  const refDescription = React.createRef();
  const timeStartAndEnd = selectedAnnotation.duration.split(" ");
  const startTime = timeStartAndEnd[0];
  const endTime = timeStartAndEnd[2];
  // getting the current time of the video when the user ask for it
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
      id: selectedAnnotation.id,
      title: selectedAnnotation.title,
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
    selectedAnnotation.annotations = [
      ...selectedAnnotation.annotations.filter(
        annotation => annotation.id != localNewAnnotation.id
      ),
      localNewAnnotation
    ];
    addNewSubAnnotations(selectedAnnotation, localNewAnnotation);
  };

  return (
    <>
      <style jsx>{`
        .animation-expand-left {
          animation: mymove-left 1s infinite ease-in-out;
        }
        @keyframes mymove-left {
          0% {
            padding-right: 0px;
          }
          25% {
            padding-right: 2.5px;
          }
          50% {
            padding-right: 5px;
          }
          75% {
            padding-right: 2.5px;
          }
          100% {
            padding-right: 0px;
          }
        }
        .animation-expand-right {
          animation: mymove-right 1s infinite ease-in-out;
        }

        @keyframes mymove-right {
          0% {
            padding-left: 0px;
          }
          25% {
            padding-left: 2.5px;
          }
          50% {
            padding-left: 5px;
          }
          75% {
            padding-left: 2.5px;
          }
          100% {
            padding-left: 0px;
          }
        }
      `}</style>
      <div className="input-group input-group-sm mb-3">
        <label for="StartTime" style={{ margin: "3px", paddingLeft: "5px" }}>
          Start:
        </label>
        <input
          id="StartTime"
          key={selectedAnnotation.id + "startTime"}
          type="text"
          className="form-control"
          placeholder="Start time"
          aria-label="Start time"
          aria-describedby="button-addon2"
          defaultValue={startTime}
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
        <label for="EndTime" style={{ margin: "3px", paddingLeft: "5px" }}>
          End:
        </label>
        <input
          id="EndTime"
          key={selectedAnnotation.id + "endTime"}
          type="text"
          className="form-control"
          placeholder="End time  "
          aria-label="Start time"
          aria-described="button-addon2"
          style={{ marginLeft: "10px" }}
          defaultValue={endTime}
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
      <label for="description"> General description: </label>
      <textarea
        id="description"
        key={selectedAnnotation.id + "textarea"}
        className="form-control"
        id="exampleFormControlTextarea1"
        placeholder="Annotation description"
        rows="5"
        defaultValue={selectedAnnotation.annotation}
        ref={refDescription}
      ></textarea>

      <div
        style={{
          display: "grid",
          justifyContent: "center",
          paddingTop: "5px",
          maxHeight: "59px",
          alignContent: "center",
          gridTemplateColumns: "20px 250px 20px"
        }}
      >
        <p
          className={"animation-expand-left"}
          style={{ display: "inline-block", margin: "0 auto" }}
        >
          <FontAwesomeIcon style={{ width: "15px" }} icon={faArrowLeft} />
        </p>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => expandAnnotation(true)}
        >
          Expand to see sub-annotations
        </button>
        <p
          className={"animation-expand-right"}
          style={{ display: "inline-block", margin: "0 auto" }}
        >
          <FontAwesomeIcon style={{ width: "15px" }} icon={faArrowRight} />
        </p>
      </div>
    </>
  );
}

export default AnnotationEditForm;
