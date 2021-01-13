import React, { useState, useEffect, useRef } from "react";
import Layouts from "../../components/shared/layouts";
import { getDataset } from "../../API/db";
import VideosPage from "../../components/datasetePage/videosPage";
import StatsticsPage from "../../components/datasetePage/statsticsPage";
import { useRouter } from "next/router";
import Image from "next/image";

function Dataset() {
  const [dataset, updateDataset] = useState([]);
  const [datasetIsStillLoading, updateDatasetIsStillLoading] = useState(true);
  const [tabId, updateTabId] = useState(0);
  const router = useRouter();
  const { sheetId } = router.query;
  const rotateRef = useRef([]);
  useEffect(() => {
    const fetchDataset = async () => {
      const localDataSet = await getDataset(sheetId);
      updateDataset(localDataSet);
      updateDatasetIsStillLoading(false);
      window.dataset = localDataSet;
    };
    // sheetId might be undefined, not sure why userRouter does this 😒
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
                <Image width={15} src=" /observedevIcon.png" />
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
  const rotate = (domId, action) => {
    if (action === "open")
      rotateRef.current[domId].style.transform = "rotateY(180deg)";
    else rotateRef.current[domId].style.transform = "";
  };
  const getTabcontent = () => {
    if (tabId === 0) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            gridAutoRows: "minmax(800px, 400px)",
            gridGap: "10px",
          }}
        >
          {dataset.map((video, index) => (
            <div
              key={index}
              style={{
                transformStyle: "preserve-3d",
                transition: "all .8s ease",
              }}
              ref={(e) => (rotateRef.current[index] = e)}
            >
              <VideosPage
                video={video}
                sheetId={sheetId}
                domId={index}
                rotate={rotate}
              />
            </div>
          ))}
        </div>
      );
    }
    if (tabId === 1) {
      return <StatsticsPage dataset={dataset} />;
    }
  };

  return (
    <div>
      <Layouts>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <a className="navbar-brand" style={{ width: "20%" }} href="/">
              <Image width={15} src=" /observedevIcon.png" />
            </a>
          </nav>
          <br />
        </div>
        <div>
          <div className="container">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${tabId === 0 ? "active" : ""}`}
                  onClick={() => updateTabId(0)}
                  href="#"
                >
                  Dataset
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${tabId === 1 ? "active" : ""}`}
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
