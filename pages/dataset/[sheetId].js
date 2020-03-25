import React, { useState, useEffect } from "react";
import Layouts from "../../components/shared/layouts";
import { getDataset } from "../../API/db";
import Videos from "../../components/datasetePage/videos";
import { useRouter } from "next/router";
import { secondsToStringFormat } from "../../API/time";
import { totalTime, getAnnotationsTime } from "../../API/statstics";

function Dataset() {
  const [dataset, updateDataset] = useState([]);
  const [datasetIsStillLoading, updateDatasetIsStillLoading] = useState(true);
  const [tabId, updateTabId] = useState(0);
  const router = useRouter();
  const { sheetId } = router.query;
  useEffect(() => {
    const fetchDataset = async () => {
      const localDataSet = await getDataset(sheetId);
      updateDataset(localDataSet);
      updateDatasetIsStillLoading(false);
    };
    // sheetId might be undefined, not sure why userRouter does this 😒`
    if (sheetId !== undefined) {
      fetchDataset();
    }
  }, [sheetId]);

  if (datasetIsStillLoading) {
    return (
      <div>
        <Layouts>
          <div>
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
          </div>{" "}
          <div className="d-flex justify-content-center">
            <div className="spinner-border" style={{ role: "status" }}>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Layouts>
      </div>
    );
  }
  const getTabcontent = () => {
    if (tabId === 0) {
      return (
        <div className="row">
          {dataset.map((video, index) => {
            if ((index + 1) % 2 === 0)
              return (
                <React.Fragment key={index}>
                  <div className="col">
                    <Videos video={video} sheetId={sheetId} />
                  </div>
                  <div className="w-100"></div>
                  <br />
                </React.Fragment>
              );
            return (
              <div className="col" key={index}>
                <Videos video={video} sheetId={sheetId} />
              </div>
            );
          })}
        </div>
      );
    }
    if (tabId === 1) {
      const annotationsTotolaTime = getAnnotationsTime(dataset);
      return (
        <>
          <h3>
            Total Time:{" "}
            {secondsToStringFormat(
              totalTime(dataset.map(video => video.videoLength))
            )}
          </h3>
          {annotationsTotolaTime.map(annotation => (
            <h3>
              {annotation[0]}: {secondsToStringFormat(annotation[1])}
            </h3>
          ))}
        </>
      );
    }
  };
  return (
    <div>
      <Layouts>
        <div>
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
        <div>
          <div className="container">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a
                  class={`nav-link ${tabId === 0 ? "active" : ""}`}
                  onClick={() => updateTabId(0)}
                  href="#"
                >
                  Dataset
                </a>
              </li>
              <li class="nav-item">
                <a
                  class={`nav-link ${tabId === 1 ? "active" : ""}`}
                  onClick={() => updateTabId(1)}
                  href="#"
                >
                  Statstics
                </a>
              </li>
            </ul>
            <br />
            {getTabcontent()}
          </div>
        </div>
      </Layouts>
    </div>
  );
}
export default Dataset;
