import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TitleDropBox from "../../shared/TitleDropBox";
import { googleLogin } from "../../../API/db";
import {
  stringToSecondsFormat,
  secondsToStringFormat
} from "../../../API/time";

function AnnotationEditForm({
  selectedAnnotation,
  getCurrentTime,
  update,
  selectedAnnotationStart,
  seekTo,
  annotationTitles
}) {
  const refStartTime = useRef(null);
  const refEndTime = useRef(null);
  const refDescription = useRef(null);
  const refTitle = useRef(null);
  // getting the current time of the video when the user ask for it
  const getTime = e => {
    const time = secondsToStringFormat(getCurrentTime());
    if (e.currentTarget.id === "start") {
      refStartTime.current.value = time;
    } else if (e.currentTarget.id === "end") {
      refEndTime.current.value = time;
    }
  };

  const handleSubmit = async () => {
    const localNewAnnotation = {
      duration: {
        start: {
          time: refStartTime.current.value,
          inSeconds:
            stringToSecondsFormat(refStartTime.current.value) -
            selectedAnnotationStart
        },
        end: {
          time: refEndTime.current.value,
          inSeconds:
            stringToSecondsFormat(refEndTime.current.value) -
            selectedAnnotationStart
        }
      },
      id: selectedAnnotation.id,
      title: refTitle.current ?? selectedAnnotation.title,
      description: refDescription.current.value
    };
    try {
      await googleLogin();
    } catch (e) {
      return;
    }
    update(localNewAnnotation);
  };
  const SeekToEnd = () => {
    seekTo(selectedAnnotation.duration.end.inSeconds + selectedAnnotationStart);
  };
  const addTitle = ([newTitle, ...rest]) => {
    const title = newTitle?.label ?? "";
    refTitle.current = title;
    handleSubmit();
  };

  return (
    <>
      <div
        className="input-group input-group-sm mb-3"
        style={{ padding: "10px" }}
      >
        <label
          htmlFor="StartTime"
          style={{ margin: "3px", paddingLeft: "5px" }}
        >
          Title:
        </label>
        <TitleDropBox
          options={annotationTitles}
          selected={selectedAnnotation.title}
          onChange={addTitle}
        />
      </div>
      <div
        className="input-group input-group-sm mb-3"
        style={{ padding: "10px" }}
      >
        <label
          htmlFor="StartTime"
          style={{ margin: "3px", paddingLeft: "5px" }}
        >
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
          defaultValue={selectedAnnotation.duration.start.time}
          ref={refStartTime}
          onBlur={handleSubmit}
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
            onBlur={handleSubmit}
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
        <label htmlFor="EndTime" style={{ margin: "3px", paddingLeft: "5px" }}>
          End:
        </label>
        <input
          id="EndTime"
          key={selectedAnnotation.id + "endTime"}
          type="text"
          className="form-control"
          placeholder="End time  "
          aria-label="Start time"
          aria-describedby="button-addon2"
          style={{ marginLeft: "10px" }}
          defaultValue={selectedAnnotation.duration.end.time}
          ref={refEndTime}
          onBlur={handleSubmit}
        />
        <div className="input-group-append">
          <button
            onClick={getTime}
            className="btn btn-outline-secondary"
            type="button"
            id="end"
            style={{ width: "42px", paddingTop: "1px" }}
            data-placement="bottom"
            title="Get current time"
            onBlur={handleSubmit}
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
          <button
            onClick={SeekToEnd}
            className="btn btn-outline-secondary"
            type="button"
            id="end"
            style={{ width: "37px", paddingTop: "1px" }}
            data-placement="bottom"
            title="Seek to end"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      <label htmlFor="description">Description: </label>
      <textarea
        id="description"
        key={selectedAnnotation.id + "textarea"}
        className="form-control"
        id="exampleFormControlTextarea1"
        placeholder="Annotation description"
        rows="5"
        defaultValue={selectedAnnotation.description}
        ref={refDescription}
        onBlur={handleSubmit}
      ></textarea>
    </>
  );
}

export default AnnotationEditForm;
