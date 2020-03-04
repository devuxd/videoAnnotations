import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import Layouts from "../../../components/shared/layouts";
import AnnotationsPage from "../../../components/videoPage/annotationsPage";
import {
  getVideoAnnotations,
  saveVideoAnnotations,
  cacheVideoAnnotation
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
    updateVideoAnnotationIsStillLoading
  ] = useState(true);
  const { videoId, sheetId } = useRouter().query;
  const [YTplaying, changeYTplaying] = useState(true);
  const videoProgress = useRef(null);
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
    return () => {};
  }, [sheetId]);

  const [
    subAnnotationProgressState,
    changeSubAnnotationProgressState
  ] = useState("hide");

  const levelOneColor = useRef(null);
  const levelTowColor = useRef(null);
  levelOneColor.current = mainColor();
  levelTowColor.current = secondColor();

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

  const seekTo = seconds => {
    YTplayerRef.current.seekTo(seconds);
    changeYTplaying(true);
  };

  const playVideo = flag => {
    changeYTplaying(flag);
  };
  const getCurrentTime = () => {
    return YTplayerRef.current.getCurrentTime();
  };

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
  const saveAnnotations = async (
    annotations,
    newAnnotation,
    newAnnotationId
  ) => {
    let localVideoAnnotations = { ...videoAnnotations, annotations };
    try {
      await saveVideoAnnotations(
        sheetId,
        `${localVideoAnnotations.id}!A${newAnnotationId}`,
        newAnnotation
      );
      console.log(`saved!`);
    } catch (e) {
      console.log(e.message);
      return;
    }
    updateVideoAnnotations(localVideoAnnotations);
    cacheVideoAnnotation(
      localVideoAnnotations,
      localVideoAnnotations.id,
      sheetId
    );
  };
  const deleteAnotation = annotation => {
    const annotations = videoAnnotations.annotations.filter(
      currentAnnotation => currentAnnotation.id !== annotation.id
    );
    saveAnnotations(annotations, {}, annotation.id);
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
                    marginBottom: "7%"
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
                (videoProgress.current = playedSeconds)
              }
              progressInterval={100}
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
              player={{ seekTo, getCurrentTime, playVideo }}
              updateAnnotations={updateAnnotations}
              addAnnotation={addAnnotation}
              deleteAnotation={deleteAnotation}
              getVideoProgress={getVideoProgress}
              subAnnotationProgressState={subAnnotationProgressState}
              colorScheme={{
                mainColor: levelOneColor.current,
                secondColor: levelTowColor.current
              }}
            />
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default MainVideoPage;
