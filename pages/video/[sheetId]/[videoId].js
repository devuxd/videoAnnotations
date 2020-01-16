import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import moment from "moment";
import Layouts from "../../../components/shared/layouts";
import AnnotationsPage from "../../../components/videoPage/annotationsPage";
import {
  getVideoAnnotations,
  saveVideoAnnotations,
  cacheVideoAnnotation
} from "../../../API/db";

/**
 * Dynamic page for each individual video post page
 *
 */

//TODO: use context for player
function MainVideoPage() {
  const [videoAnnotations, updateVideoAnnotations] = useState();
  const [
    videoAnnotationIsStillLoading,
    updateVideoAnnotationIsStillLoading
  ] = useState(true);
  const { videoId, sheetId } = useRouter().query;
  const [YTplaying, changeYTplaying] = useState(false);
  const [videoProgress, changeVideoProgress] = useState(0);
  const YTplayerRef = useRef(null);
  useEffect(() => {
    const fetchVideo = async () => {
      let localVideoAnnotations = await getVideoAnnotations(videoId, sheetId);
      updateVideoAnnotations(localVideoAnnotations);
      updateVideoAnnotationIsStillLoading(false);
    };
    if (sheetId !== undefined) {
      fetchVideo();
    }
  }, [sheetId]);

  const [
    subAnnotationProgressState,
    changeSubAnnotationProgressState
  ] = useState("hide");

  useEffect(() => {
    if (YTplayerRef.current) {
      YTplayerRef.current.wrapper.onmouseover = () =>
        changeSubAnnotationProgressState("show");

      YTplayerRef.current.wrapper.onmouseout = () => {
        if (subAnnotationProgressState == "pause") return;
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

  const seekTo = seconds => {
    YTplayerRef.current.seekTo(seconds);
    changeYTplaying(true);
  };
  const seekTo_subAnnotations = seconds => {
    YTplayerRef.current.seekTo(moment.duration(seconds).asSeconds());
    changeYTplaying(true);
  };
  const getCurrentTime = () => YTplayerRef.current.getCurrentTime();

  const updateAnnotations = newAnnotation => {
    // update the annotation with the newSubAnnotations
    const annotations = videoAnnotations.annotations.map(currentAnnotation => {
      if (currentAnnotation.id == newAnnotation.id) {
        return newAnnotation;
      }
      return currentAnnotation;
    });
    saveAnnotations(annotations, newAnnotation, newAnnotation.id);
  };
  const addAnnotation = newAnnotation => {
    const annotations = [...videoAnnotations.annotations, newAnnotation];
    saveAnnotations(annotations, newAnnotation, newAnnotation.id);
  };

  // update local copy, localStorage copy and then save it in the spreedseet
  const saveAnnotations = (annotations, newAnnotation, newAnnotationId) => {
    let localVideoAnnotations = { ...videoAnnotations, annotations };
    updateVideoAnnotations(localVideoAnnotations);
    cacheVideoAnnotation(
      localVideoAnnotations,
      localVideoAnnotations.id,
      localStorage.key(0)
    );
    saveVideoAnnotations(
      localStorage.key(0),
      `${localVideoAnnotations.id}!A${newAnnotationId}`,
      newAnnotation
    );
  };
  const deleteAnotation = annotation => {
    const annotations = videoAnnotations.annotations.filter(
      currentAnnotation => currentAnnotation.id !== annotation.id
    );
    saveAnnotations(annotations, {}, annotation.id);
  };

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
                    marginBottom: "7%"
                  }}
                  src="https://i.ibb.co/JmfYfBD/observedev.png"
                />
              </a>
            </nav>
            <br />
          </div>
          <div class="d-flex justify-content-center">
            <div
              className="spinner-border"
              style={{ width: "3rem; height: 3rem;", role: "status" }}
            >
              <span class="sr-only">Loading...</span>
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
                  marginBottom: "7%"
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
            gridTemplateRows: "800px 400px"
          }}
        >
          <div
            style={{
              gridColumnStart: "2",
              gridColumnEnd: "2",
              gridRowStart: "1",
              gridRowEnd: "span 1"
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
                changeVideoProgress(playedSeconds)
              }
              onPause={() => changeSubAnnotationProgressState("pause")}
              onPlay={() => changeSubAnnotationProgressState("hide")}
            />
          </div>

          <div
            style={{
              gridColumnStart: "1",
              gridColumnEnd: "span 3",
              gridRowStart: "2",
              gridRowEnd: "span 2"
            }}
          >
            <AnnotationsPage
              videoLength={videoAnnotations.videoLength}
              annotations={videoAnnotations.annotations}
              player={{ seekTo, seekTo_subAnnotations, getCurrentTime }}
              updateAnnotations={updateAnnotations}
              addAnnotation={addAnnotation}
              deleteAnotation={deleteAnotation}
              videoProgress={videoProgress}
              subAnnotationProgressState={subAnnotationProgressState}
            />
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default MainVideoPage;
