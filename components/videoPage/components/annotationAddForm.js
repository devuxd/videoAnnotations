import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { googleLogin } from "../../../API/db";
import RadioButtonGroup from "./TitleDropBox";
import {
  stringToSecondsFormat,
  secondsToStringFormat
} from "../../../API/time";

function AnnotationAddForm({
  player: { getCurrentTime, playVideo, seekTo },
  addNewSubAnnotation,
  offsetTime,
  annotationTitles,
  newAnnotationId,
  defaultStartTime,
  annotationDefualtLength
}) {
  // getting references
  const refStartTime = React.createRef();
  const [title, changeTitle] = useState("");
  // getting the current time of the video when the user ask for it
  const getTime = e => {
    const time = secondsToStringFormat(getCurrentTime());
    refStartTime.current.value = time;
  };
  playVideo(false);
  const handleSubmit = async e => {
    e.preventDefault();
    //TODO remove inSeonds
    const localNewAnnotation = {
      duration: {
        start: {
          time: refStartTime.current.value
        },
        end: {
          time: secondsToStringFormat(annotationDefualtLength)
        }
      },
      id: newAnnotationId,
      title: title,
      description: ""
    };
    try {
      await googleLogin();
    } catch (e) {
      return;
    }
    addNewSubAnnotation(localNewAnnotation);
    seekTo(stringToSecondsFormat(localNewAnnotation.duration.start.time));
    playVideo(true);
  };

  const addTitle = ([newTitle, ...rest]) => {
    const title = newTitle?.label ?? "";
    changeTitle(title);
  };

  return (
    <>
      <style jsx>
        {`
          .box-sub-annotation {
            border-radius: 0.4em;
            border: 3px solid;
            padding: 5px;
            margin: 20px auto;
            transition: left 1s;
          }
        `}
      </style>

      <div style={{ display: "grid" }}>
        <form className="box-sub-annotation" id="box-sub-annotation">
          <label
            htmlFor="StartTime"
            style={{ margin: "3px", paddingLeft: "5px" }}
          >
            Select an existing title or create new one:
          </label>
          <div
            className="rainbow-p-around_x-large rainbow-align-content_center"
            style={{ display: "grid", justifyContent: "center" }}
          >
            <RadioButtonGroup
              options={annotationTitles}
              selected={title}
              onChange={addTitle}
            />
          </div>

          <div className="input-group input-group-sm mb-3">
            <label
              htmlFor="StartTime"
              style={{ margin: "3px", paddingLeft: "5px" }}
            >
              Start:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Start time"
              aria-label="Start time"
              aria-describedby="button-addon2"
              defaultValue={defaultStartTime ?? ""}
              ref={refStartTime}
            />
            <div className="input-group-append">
              <button
                onClick={getTime}
                className="btn btn-outline-secondary"
                type="button"
                id="start"
                style={{ width: "42px", paddingTop: "1px" }}
                data-placement="button"
                title="Get current time"
              >
                <FontAwesomeIcon icon={faClock} />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
            <button
              type="submit"
              className="btn btn-success"
              style={{ gridColumnStart: "2" }}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AnnotationAddForm;
