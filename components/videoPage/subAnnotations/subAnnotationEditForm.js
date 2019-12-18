import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";

function SubAnnotationEditForm({
  selectedSubAnnotation,
  getCurrentTime,
  updateSubAnnotations,
  selectedAnnotationStart
}) {
  if (selectedSubAnnotation != null)
    return (
      <>
        {editSubAnnotation(
          getCurrentTime,
          selectedSubAnnotation,
          updateSubAnnotations,
          selectedAnnotationStart
        )}
      </>
    );
  return <></>;
}

function editSubAnnotation(
  getCurrentTime,
  selectedSubAnnotation,
  updateSubAnnotations,
  selectedAnnotationStart
) {
  // getting references
  const refStartTime = React.createRef();
  const refEndTime = React.createRef();
  const refDescription = React.createRef();

  // getting the current time of the video when the user ask for it
  const getTime = e => {
    const time = moment("2015-01-01")
      .startOf("day")
      .seconds(getCurrentTime())
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
        selectedAnnotationStart,
      end:
        moment.duration(refEndTime.current.value).asSeconds() -
        selectedAnnotationStart,
      annotation: refDescription.current.value,
      id: selectedSubAnnotation.id,
      title: selectedSubAnnotation.title,
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
    updateSubAnnotations(localNewAnnotation);
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

          .arrow-sub-annotation {
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
        `}
      </style>

      <div className="arrow-sub-annotation" id="arrow-sub-annotation"></div>
      <div className="box-sub-annotation" id="box-sub-annotation">
        <div className="input-group input-group-sm mb-3">
          <label for="StartTime" style={{ margin: "3px", paddingLeft: "5px" }}>
            Start:
          </label>
          <input
            id="StartTime"
            key={selectedSubAnnotation.id + "startTime"}
            type="text"
            className="form-control"
            placeholder="Start time"
            aria-label="Start time"
            aria-describedby="button-addon2"
            defaultValue={selectedSubAnnotation.startTime}
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
          <label for="EndTime" style={{ margin: "3px", paddingLeft: "5px" }}>
            End:
          </label>
          <input
            id="EndTime"
            key={selectedSubAnnotation.id + "endTime"}
            type="text"
            className="form-control"
            placeholder="End time  "
            aria-label="Start time"
            aria-described="button-addon2"
            style={{ marginLeft: "10px" }}
            defaultValue={selectedSubAnnotation.endTime}
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
          </div>
        </div>
        <label for="description">Description: </label>
        <textarea
          id="description"
          key={selectedSubAnnotation.id + "textarea"}
          className="form-control"
          id="exampleFormControlTextarea1"
          placeholder="Annotation description"
          rows="5"
          defaultValue={selectedSubAnnotation.annotation}
          ref={refDescription}
          onBlur={handleSubmit}
        ></textarea>
      </div>
    </>
  );
}

export default SubAnnotationEditForm;
