import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";

function AnnotationEditForm(props) {
  //based on the selected annotation, display the sub-annotations related to it.
  //If non is selected or there are no sub-annotations display nothing.
  const selectedAnnotation = props.selectedAnnotation || {};
  console.log(selectedAnnotation);

  return (
    <>
      {editAnnotation(
        props.currentTime,
        selectedAnnotation
        // updatedAnnotation
      )}
      <br />
    </>
  );
}

function editAnnotation(
  currentTime,
  selectedAnnotation
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
      <style jsx>
        {`
          .box-annotation {
            position: relative;
            border-radius: 0.4em;
            border: 3px solid;
            padding: 5px;
            width: 800px;
            transition: left 1s;
          }

          .arrow-annotation {
            content: "";
            position: relative;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top: 0;
            margin-left: -20px;
            transition: left 0.5s;
          }
          .allAnnotations-box {
            position: absolute;
            border-radius: 1.4em;
            border-top: 4px solid #d0d0d0;
            padding-top: 20px;
            display: none;
            margin-top: 10px;
          }

          .allAnnotations-arrow {
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
            transition: left 0.3s;
          }

          @keyframes mymove {
            from {
              padding-top: 0px;
            }
            to {
              padding-top: 2px;
            }
          }
        `}
      </style>
      <div className="arrow-annotation" id="arrow-annotation"></div>
      <div className="box-annotation" id="box-annotation">
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
        <label for="description">Description: </label>
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
            animation: "mymove 1s infinite"
          }}
        >
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            <FontAwesomeIcon
              style={{ width: "15px", paddingRight: "3px", display: "inline" }}
              icon={faArrowDown}
            />
            Expand to see sub-annotations
            <FontAwesomeIcon
              style={{ width: "15px", paddingLeft: "3px", display: "inline" }}
              icon={faArrowDown}
            />
          </button>
        </div>
        <br />
      </div>
    </>
  );
}

export default AnnotationEditForm;
