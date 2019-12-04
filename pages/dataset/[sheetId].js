import React, { useState, useEffect } from "react";
import Layouts from "../../components/shared/layouts";
import { getDataset } from "../../API/db";
import Videos from "../../components/datasetePage/videos";
import { useRouter } from "next/router";

function Dataset() {
  const [dataset, updateDataset] = useState([]);
  const [datasetIsStillLoading, updateDatasetIsStillLoading] = useState(true);
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
          <div className="container">
            <div className="loader"></div>
          </div>
          <div className="container">
            Loading dataset...
            <br />
          </div>
          <style jsx>
            {`
              .container {
                height: 10em;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .loader {
                border: 16px solid #f3f3f3;
                border-radius: 50%;
                border-top: 16px solid gray;
                width: 120px;
                height: 120px;
                -webkit-animation: spin 2s linear infinite; /* Safari */
                animation: spin 2s linear infinite;
              }

              /* Safari */
              @-webkit-keyframes spin {
                0% {
                  -webkit-transform: rotate(0deg);
                }
                100% {
                  -webkit-transform: rotate(360deg);
                }
              }

              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </Layouts>
      </div>
    );
  }
  return (
    <div style={{ fontFamily: "Lato" }}>
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
        <br />
        <div className="card-deck">
          <div className="container">
            <div className="row">
              {dataset.map((video, index) => {
                if ((index + 1) % 2 === 0)
                  return (
                    <>
                      <div className="col" key={index}>
                        <Videos video={video} sheetId={sheetId} />
                      </div>
                      <div className="w-100"></div>
                      <br />
                    </>
                  );
                return (
                  <div className="col" key={index}>
                    <Videos video={video} sheetId={sheetId} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}
export default Dataset;
