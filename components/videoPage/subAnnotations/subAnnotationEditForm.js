import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faArrowRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { googleLogin } from "../../../API/db";

function SubAnnotationEditForm({
  selectedSubAnnotation,
  currentTime,
  updateSubAnnotations,
  expandAnnotation
}) {
  //based on the selected annotation, display the sub-annotations related to it.
  //If non is selected or there are no sub-annotations display nothing.
  // const newTitle = useRef(null);

  // revisit this
  // const myColor = d3
  //   .scaleOrdinal()
  //   .domain(selectedSubAnnotation.map(element => element.annotations).flat(1))
  //   .range(d3.schemeSet2);

  // const getBackgroundColor = title => {
  //   return color(myColor(title)).darken(0.5);
  // };

  // adding new sub-annotation category
  const handleSubmitSubAnnotationTitle = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...selectedSubAnnotation,
      {
        title: newTitle.current.value,
        annotations: []
      }
    ];
    addSubAnnotation(newSubAnnotations);
    // newTitle.current.value = "";
  };
  // const updateSubAnnotation

  const addNewSubAnnotations = (newAnnotations, localNewAnnotation) => {
    //locating under what sub-annotation category the new added subannoation belong
    // then replace the new sub-annotations with the old one
    const localSubAnnotations = selectedSubAnnotation.map(annotation =>
      annotation.title === newAnnotations.title ? newAnnotations : annotation
    );
    addSubAnnotation(localSubAnnotations);

    changeActiveSubAnnotationIndex(localNewAnnotation.id);
    changeActiveSubAnnotation(localNewAnnotation);
  };

  const editAnnotation = annotation => {
    changeActiveSubAnnotation(annotation);
    activateTab(
      selectedSubAnnotation.findIndex(
        subAnnotation => subAnnotation.title === annotation.title
      )
    );
  };

  return (
    <>
      {editSubAnnotation(
        currentTime,
        selectedSubAnnotation,
        addNewSubAnnotations,
        expandAnnotation
      )}
      <br />
    </>
  );
}

function editSubAnnotation(
  currentTime,
  selectedSubAnnotation,
  addNewSubAnnotations,
  expandAnnotation
) {
  // getting references
  const refStartTime = React.createRef();
  const refEndTime = React.createRef();
  const refDescription = React.createRef();

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
    selectedSubAnnotation.annotations = [
      ...selectedSubAnnotation.annotations.filter(
        annotation => annotation.id != localNewAnnotation.id
      ),
      localNewAnnotation
    ];
    addNewSubAnnotations(selectedSubAnnotation, localNewAnnotation);
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
        `}
      </style>
      <div className="arrow-sub-annotation" id="arrow-sub-annotation"></div>

      <div className="box-sub-annotation" id="box-sub-annotation">
        <div className="input-group input-group-sm mb-3">
          <label for="StartTime" style={{ margin: "3px", paddingLeft: "5px" }}>
            {" "}
            Start:{" "}
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
            End:{" "}
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
          key={selectedSubAnnotation.id + "textarea"}
          className="form-control"
          id="exampleFormControlTextarea1"
          placeholder="Annotation description"
          rows="5"
          defaultValue={selectedSubAnnotation.annotation}
          ref={refDescription}
        ></textarea>
        <span
          className="badge badge-pill badge-primary"
          id="subAnnotationTitleBadget"
        >
          {selectedSubAnnotation.title}
        </span>

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
            <FontAwesomeIcon style={{ width: "15px" }} icon={faArrowRight} />
          </p>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => expandAnnotation(false)}
          >
            Collapse sub-annotations
          </button>
          <p
            className={"animation-expand-right"}
            style={{ display: "inline-block", margin: "0 auto" }}
          >
            <FontAwesomeIcon style={{ width: "15px" }} icon={faArrowLeft} />
          </p>
        </div>
      </div>
      <br />
    </>
  );
}

export default SubAnnotationEditForm;
