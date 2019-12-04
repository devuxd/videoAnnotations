const fetch = require("node-fetch");
const { key, clientId } = require("./config"); // create file in API folder and call it config.js

const getDataset = sheetId =>
  new Promise((res, rej) => {
    if (sheetId === undefined) rej("sheet id cannot be undefined");

    return fetch(
      `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true&fields=sheets(data(rowData(values(hyperlink%2Cnote%2CuserEnteredValue))))&key=${key}`
    )
      .then(response => response.json())
      .then(rowDataset => parse(rowDataset))
      .then(dataset => {
        cacheData(dataset, sheetId);
        res(dataset);
      })
      .catch(e => rej(e));
  });

const getVideoAnnotations = (videoId, sheetId) =>
  new Promise((res, rej) => {
    const dataset = JSON.parse(localStorage.getItem(sheetId));
    if (dataset) {
      return res(findVideo(dataset, videoId));
    } else {
      return res(
        getDataset(sheetId).then(dataset => findVideo(dataset, videoId))
      );
    }
  });
const cacheVideoAnnotation = (videoAnnotations, videoId, sheetId) => {
  const dataset = JSON.parse(localStorage.getItem(sheetId));
  const newDataset = dataset.map(video =>
    video.id === videoId ? videoAnnotations : video
  );
  cacheData(newDataset, sheetId);
};
const findVideo = (dataset, videoId) =>
  dataset.find(
    video => video.videoURL.replace("https://youtu.be/", "") == videoId
  );
const cacheData = (dataset, id) =>
  localStorage.setItem(id, JSON.stringify(dataset));

const parse = rowDataset => {
  try {
    let dataset = rowDataset.sheets.map(({ data }, sheetIndex) => {
      let videoJSON = {};
      let video = data[0].rowData[2];
      videoJSON.id = `Video${sheetIndex + 1}`;
      videoJSON.videoTitle = video.values[0].userEnteredValue.stringValue;
      videoJSON.videoURL = video.values[1].userEnteredValue.stringValue;
      videoJSON.videoLength = { hours: "", minutes: "", seconds: "" };
      videoJSON.videoLength.hours =
        video.values[2].userEnteredValue.numberValue;
      videoJSON.videoLength.minutes =
        video.values[3].userEnteredValue.numberValue;
      videoJSON.videoLength.seconds =
        video.values[4].userEnteredValue.numberValue;

      videoJSON.programmingLanguage = video.values[5].userEnteredValue
        ? video.values[5].userEnteredValue.stringValue
        : "";
      videoJSON.programmingTools = video.values[6].userEnteredValue
        ? video.values[6].userEnteredValue.stringValue
        : "";
      videoJSON.githubURL = video.values[7].userEnteredValue
        ? video.values[7].userEnteredValue.stringValue
        : "";

      videoJSON.projectSize = video.values[8].userEnteredValue
        ? video.values[8].userEnteredValue.numberValue
        : "";

      videoJSON.developerGithubURL = video.values[9].userEnteredValue
        ? video.values[9].userEnteredValue.stringValue
        : "";

      let annotationsData = data[0].rowData.splice(10, data[0].rowData.length);
      videoJSON.annotations = [];
      let annotationIndex = 11;
      videoJSON.annotations = annotationsData.map(annotation => {
        let annotationJSON = {};
        annotationJSON.duration = { start: {}, end: {} };
        annotationJSON.duration.start.hours =
          annotation.values[0].userEnteredValue.numberValue;
        annotationJSON.duration.start.minutes =
          annotation.values[1].userEnteredValue.numberValue;
        annotationJSON.duration.start.seconds =
          annotation.values[2].userEnteredValue.numberValue;
        annotationJSON.duration.end.hours =
          annotation.values[3].userEnteredValue.numberValue;
        annotationJSON.duration.end.minutes =
          annotation.values[4].userEnteredValue.numberValue;
        annotationJSON.duration.end.seconds =
          annotation.values[5].userEnteredValue.numberValue;
        annotationJSON.tags = annotation.values[6].userEnteredValue.stringValue;
        annotationJSON.description =
          annotation.values[7].userEnteredValue.stringValue;
        annotationJSON.id = annotationIndex;
        annotationJSON.subAnnotations = annotation.values[8]
          ? JSON.parse(annotation.values[8].userEnteredValue.stringValue)
          : [];
        annotationIndex++;
        return annotationJSON;
      });

      return videoJSON;
    });
    return dataset;
  } catch (e) {
    throw Error("The template you used cannot be parsed : " + e);
  }
};
const googleLogin = () => {
  return new Promise((res, rej) =>
    gapi.load("client:auth2", () =>
      gapi.client
        .init({
          apiKey: key,
          clientId: clientId,
          scope: "https://www.googleapis.com/auth/spreadsheets",
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4"
          ]
        })
        .then(
          () => {
            gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(signedIn => res(true));
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              res(true);
            } else {
              gapi.auth2.getAuthInstance().signIn();
            }
          },
          function(error) {
            console.log(JSON.stringify(error, null, 2));
            rej(false);
          }
        )
    )
  );
};

const saveVideoAnnotations = (spreadsheetId, range, annotations) =>
  gapi.load("client:auth2", () =>
    gapi.client
      .init({
        apiKey: key,
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4"
        ]
      })
      .then(
        () => {
          const handleSignedIn = signedIn => {
            if (signedIn) {
              gapi.client.sheets.spreadsheets.values
                .update(
                  { spreadsheetId, range, valueInputOption: "RAW" },
                  { values: [[JSON.stringify(annotations)]] }
                )
                .then(() => {
                  console.log("saved");
                });
            }
          };
          gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(signedIn => handleSignedIn(signedIn));
          if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            handleSignedIn(true);
          } else {
            gapi.auth2.getAuthInstance().signIn();
          }
        },
        function(error) {
          console.log(JSON.stringify(error, null, 2));
        }
      )
  );

module.exports = {
  cacheData,
  getDataset,
  getVideoAnnotations,
  saveVideoAnnotations,
  googleLogin,
  cacheVideoAnnotation
};
