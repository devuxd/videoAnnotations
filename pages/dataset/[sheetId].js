import React from "react";
import { useRouter } from "next/router";
import Layouts from "../../components/shared/layouts";
import { cachData, getDataset } from "../../API/db";
import VideoListing from "../../components/datasetePage/videoListing";

export default class dataset extends React.Component {
  static async getInitialProps({ query }) {
    return { query };
  }

  constructor() {
    super();
    this.state = { dataSet: [], sheetId: null, isLoaded: false };
  }

  // This function fetch the data from google sheet
  async componentDidMount() {
    let localDataSet;
    try {
      localDataSet = await getDataset(this.props.query.sheetId);
    } catch (e) {
      console.error(e);
    }
    this.setState({
      dataSet: localDataSet,
      sheetId: this.props.query.sheetId,
      isLoaded: true
    });
  }

  render() {
    if (!this.state.isLoaded) {
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
          <p style={{ paddingLeft: "5%" }}>
            Viewing dataset: {this.state.sheetId} <br />
            <b>Click an annotation to view each video further in detail.</b>
          </p>
          <br />
          <div class="card-deck">
            <div class="container">
              <div class="row">
                {this.state.dataSet.map((video, index) => {
                  if ((index + 1) % 2 === 0)
                    return (
                      <>
                        <div class="col">
                          <VideoListing
                            video={video}
                            sheetId={this.state.sheetId}
                          />
                        </div>
                        <div class="w-100"></div>
                        <br />
                      </>
                    );
                  return (
                    <div class="col">
                      <VideoListing
                        video={video}
                        sheetId={this.state.sheetId}
                      />
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
}
