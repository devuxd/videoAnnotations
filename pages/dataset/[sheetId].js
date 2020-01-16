import React, { useState, useEffect } from "react";
import Layouts from "../../components/shared/layouts";
import { getDataset } from "../../API/db";
import Videos from "../../components/datasetePage/videos";
import { useRouter } from "next/router";
import { secondsToStringFormat } from "../../API/time";

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
        <h3>
          Total Time:
          {secondsToStringFormat(
            dataset.reduce(
              (prevoiusValue, currentValue) =>
                prevoiusValue + currentValue.videoLength,
              0
            )
          )}
        </h3>
        <br />
        <div className="card-deck" style={{ margin: "0px;!import" }}>
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
