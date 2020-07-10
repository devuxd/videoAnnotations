import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import Layouts from "../../../components/shared/layouts";
import AnnotationsPage from "../../../components/videoPage/annotationsPage";
import {
  getVideoAnnotations,
  saveVideoAnnotations,
  getAnnotationsTitle,
} from "../../../API/db";

import { mainColor, secondColor } from "../../../API/color";

/**
 * Dynamic page for each individual video post page
 *
 */

//TODO: use context for player
function MainVideoPage() {
  const [videoAnnotations, updateVideoAnnotations] = useState();
  const [
    videoAnnotationIsStillLoading,
    updateVideoAnnotationIsStillLoading,
  ] = useState(true);
  const { videoId, sheetId } = useRouter().query;
  const [YTplaying, changeYTplaying] = useState(true);
  const videoProgress = useRef(null);
  const YTplayerRef = useRef(null);
  const loadingIndicator = useRef(null);
  useEffect(() => {
    const fetchVideo = async () => {
      let localVideoAnnotations = await getVideoAnnotations(videoId, sheetId);
      updateVideoAnnotations(localVideoAnnotations);
      updateVideoAnnotationIsStillLoading(false);
    };
    if (sheetId !== undefined) {
      fetchVideo();
    }
    return () => {};
  }, [sheetId]);

  const [
    subAnnotationProgressState,
    changeSubAnnotationProgressState,
  ] = useState("hide");
  const annotationsTitle = getAnnotationsTitle();
  const levelOneColor = useRef(null);
  const levelTowColor = useRef(null);
  levelOneColor.current = mainColor(annotationsTitle.annotations);
  levelTowColor.current = secondColor(annotationsTitle.subAnnotations);

  useEffect(() => {
    if (YTplayerRef.current) {
      YTplayerRef.current.wrapper.onmouseover = () => {
        changeSubAnnotationProgressState("show");
      };

      YTplayerRef.current.wrapper.onmouseout = () => {
        changeSubAnnotationProgressState("hide");
      };
    }
    return () => {
      if (YTplayerRef.current) {
        YTplayerRef.current.wrapper.onmouseover = undefined;
        YTplayerRef.current.wrapper.onmouseout = undefined;
      }
    };
  });

  const seekTo = (seconds) => {
    YTplayerRef.current.seekTo(seconds);
    changeYTplaying(true);
  };

  const playVideo = (flag) => {
    changeYTplaying(flag);
  };
  const getCurrentTime = () => {
    return YTplayerRef.current.getCurrentTime();
  };

  const updateAnnotations = async (newAnnotation) => {
    // update the annotation with the newSubAnnotations
    const annotations = videoAnnotations.annotations.map(
      (currentAnnotation) => {
        if (currentAnnotation.id == newAnnotation.id) {
          return newAnnotation;
        }
        return currentAnnotation;
      }
    );
    try {
      const localVideoAnnotations = await saveAnnotations(
        annotations,
        newAnnotation,
        newAnnotation.id
      );
      updateVideoAnnotations(localVideoAnnotations);
    } catch (e) {
      return;
    }
  };
  const addAnnotation = async (newAnnotation) => {
    const annotations = [...videoAnnotations.annotations, newAnnotation];
    try {
      const localVideoAnnotations = await saveAnnotations(
        annotations,
        newAnnotation,
        newAnnotation.id
      );
      updateVideoAnnotations(localVideoAnnotations);
    } catch (e) {
      return;
    }
  };
  const deleteAnnotation = async (annotation) => {
    const annotations = videoAnnotations.annotations.filter(
      (currentAnnotation) => currentAnnotation.id !== annotation.id
    );
    try {
      const localVideoAnnotations = await saveAnnotations(
        annotations,
        {},
        annotation.id
      );
      updateVideoAnnotations(localVideoAnnotations);
    } catch (e) {
      return;
    }
  };
  const mergeAnnotation = async (
    mergedAnnotation,
    shouldBeRemovedAnnotation
  ) => {
    let annotations = videoAnnotations.annotations.map((currentAnnotation) => {
      if (currentAnnotation.id == mergedAnnotation.id) {
        return mergedAnnotation;
      }
      return currentAnnotation;
    });
    try {
      await saveAnnotations(annotations, mergedAnnotation, mergedAnnotation.id);
    } catch (e) {
      return;
    }
    annotations = annotations.filter(
      (currentAnnotation) =>
        currentAnnotation.id !== shouldBeRemovedAnnotation.id
    );
    try {
      const localVideoAnnotations = await saveAnnotations(
        annotations,
        {},
        shouldBeRemovedAnnotation.id
      );
      updateVideoAnnotations(localVideoAnnotations);
    } catch (e) {
      return;
    }
  };

  // update local copy, localStorage copy and then save it in the spreedseet
  const saveAnnotations = async (
    annotations,
    newAnnotation,
    newAnnotationId
  ) => {
    let localVideoAnnotations = { ...videoAnnotations, annotations };
    const range = [];
    const annotationsToBeSaved = [];
    range.push(`${localVideoAnnotations.id}!A${newAnnotationId}`);
    if (JSON.stringify(newAnnotation).length > 50000) {
      range.push(`${localVideoAnnotations.id}!B${newAnnotationId}`);
      const firstHalf = {
        ...newAnnotation,
        subAnnotations: newAnnotation.subAnnotations.slice(
          0,
          newAnnotation.subAnnotations.length / 2
        ),
      };
      const secondHalf = newAnnotation.subAnnotations.slice(
        newAnnotation.subAnnotations.length / 2,
        newAnnotation.subAnnotations.length
      );
      annotationsToBeSaved.push(firstHalf);
      annotationsToBeSaved.push(secondHalf);
    } else {
      annotationsToBeSaved.push(newAnnotation);
    }
    try {
      loadingIndicator.current.style.display = "block";
      await Promise.all(
        annotationsToBeSaved.map((annotation, index) =>
          saveVideoAnnotations(sheetId, range[index], annotation)
        )
      );
      console.log(`saved!`);
      loadingIndicator.current.style.display = "none";
      return localVideoAnnotations;
    } catch (e) {
      console.log(e.message);
      loadingIndicator.current.style.display = "none";
      return new Error("Unable to save!");
    }
  };
  const getVideoProgress = () => videoProgress.current;

  if (videoAnnotationIsStillLoading) {
    return (
      <div>
        <Layouts>
          <div>
            <nav className="navbar navbar-eannotationpand-lg navbar-light bg-white">
              <a className="navbar-brand" style={{ width: "20%" }} href="/">
                <img
                  style={{
                    width: "100%",
                    display: "block",
                    marginLeft: "1%",
                    marginRight: "0px",
                    marginBottom: "7%",
                  }}
                  src="https://i.ibb.co/JmfYfBD/observedev.png"
                />
              </a>
            </nav>
            <br />
          </div>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" style={{ role: "status" }}>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Layouts>
      </div>
    );
  }
  return (
    <div style={{ fontFamily: "Lato" }}>
      <Layouts>
        <div id="nav-bar">
          <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <a className="navbar-brand" style={{ width: "20%" }} href="/">
              <img
                style={{
                  width: "100%",
                  display: "block",
                  marginLeft: "1%",
                  marginRight: "0px",
                  marginBottom: "7%",
                }}
                src="https://i.ibb.co/JmfYfBD/observedev.png"
              />
            </a>
          </nav>
          <br />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10% 75% 15%",
            gridTemplateRows: "800px 400px",
          }}
        >
          <div
            style={{
              gridColumnStart: "2",
              gridColumnEnd: "2",
              gridRowStart: "1",
              gridRowEnd: "span 1",
            }}
            id="YTplayer"
          >
            <ReactPlayer
              url={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              ref={YTplayerRef}
              controls={true}
              width="100%"
              height="100%"
              playing={YTplaying}
              onProgress={({ playedSeconds }) =>
                (videoProgress.current = playedSeconds)
              }
              progressInterval={100}
            />
          </div>
          <div
            style={{
              gridColumnStart: "3",
              gridColumnEnd: "3",
              gridRowStart: "3",
              gridRowEnd: "span 3",
              placeSelf: "center",
              display: "none",
            }}
            ref={loadingIndicator}
          >
            Synching changes ....
          </div>
          <div
            style={{
              gridColumnStart: "1",
              gridColumnEnd: "span 3",
              gridRowStart: "2",
              gridRowEnd: "span 2",
            }}
          >
            <AnnotationsPage
              videoLength={videoAnnotations.videoLength}
              annotations={videoAnnotations.annotations}
              player={{ seekTo, getCurrentTime, playVideo }}
              updateAnnotations={updateAnnotations}
              addAnnotation={addAnnotation}
              deleteAnnotation={deleteAnnotation}
              getVideoProgress={getVideoProgress}
              subAnnotationProgressState={subAnnotationProgressState}
              colorScheme={{
                mainColor: levelOneColor.current,
                secondColor: levelTowColor.current,
              }}
              annotationsTitle={annotationsTitle}
              mergeAnnotation={mergeAnnotation}
            />
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default MainVideoPage;
