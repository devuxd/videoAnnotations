const fetch = require("node-fetch");
const { key } = require("./config"); // create file in API folder and call it config.js

const getDataset = id =>
  new Promise((res, rej) =>
    fetch(
      `https://content-sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&fields=sheets(data(rowData(values(hyperlink%2Cnote%2CuserEnteredValue))))&key=${key}`
    )
      .then(response => response.json())
      .then(rowDataset => parse(rowDataset))
      .then(dataset => {
        cachData(dataset, id);
        res(dataset);
      })
      .catch(e => rej(e))
  );
const getvideData = (videoId, sheetId) =>
  new Promise((res, rej) => {
    try {
      const dataset = JSON.parse(localStorage.getItem(sheetId));
      if (dataset) {
        return res(findVideo(dataset, videoId));
      } else {
        return res(
          getDataset(sheetId).then(dataset => findVideo(dataset, videoId))
        );
      }
    } catch (e) {
      rej(e);
    }
  });
const findVideo = (dataset, videoId) =>
  dataset.find(
    video => video.VideoURL.replace("https://youtu.be/", "") == videoId
  );
const cachData = (dataset, id) =>
  localStorage.setItem(id, JSON.stringify(dataset));

const parse = rowDataset => {
  try {
    let dataset = rowDataset.sheets.map(({ data }, sheetIndex) => {
      let videoJSON = {};
      let video = data[0].rowData[2];
      videoJSON.Id = sheetIndex;
      videoJSON.VideoTitle = video.values[0].userEnteredValue.stringValue;
      videoJSON.VideoURL = video.values[1].userEnteredValue.stringValue;
      videoJSON.VideoLength = { hours: "", minutes: "", seconds: "" };
      videoJSON.VideoLength.hours =
        video.values[2].userEnteredValue.numberValue;
      videoJSON.VideoLength.minutes =
        video.values[3].userEnteredValue.numberValue;
      videoJSON.VideoLength.seconds =
        video.values[4].userEnteredValue.numberValue;

      videoJSON.ProgrammingLanguage = video.values[5].userEnteredValue
        ? video.values[5].userEnteredValue.stringValue
        : "";
      videoJSON.ProgrammingTools = video.values[6].userEnteredValue
        ? video.values[6].userEnteredValue.stringValue
        : "";
      videoJSON.GithubURL = video.values[7].userEnteredValue
        ? video.values[7].userEnteredValue.stringValue
        : "";

      videoJSON.ProjectSize = video.values[8].userEnteredValue
        ? video.values[8].userEnteredValue.numberValue
        : "";

      videoJSON.DeveloperGithubURL = video.values[9].userEnteredValue
        ? video.values[9].userEnteredValue.stringValue
        : "";

      let annotationsData = data[0].rowData.splice(10, data[0].rowData.length);
      videoJSON.Annotations = [];
      let annotationIndex = 11;
      videoJSON.Annotations = annotationsData.map(annotation => {
        let annotationJSON = {};
        annotationJSON.Duration = { start: {}, end: {} };
        annotationJSON.Duration.start.hours =
          annotation.values[0].userEnteredValue.numberValue;
        annotationJSON.Duration.start.minutes =
          annotation.values[1].userEnteredValue.numberValue;
        annotationJSON.Duration.start.seconds =
          annotation.values[2].userEnteredValue.numberValue;
        annotationJSON.Duration.end.hours =
          annotation.values[3].userEnteredValue.numberValue;
        annotationJSON.Duration.end.minutes =
          annotation.values[4].userEnteredValue.numberValue;
        annotationJSON.Duration.end.seconds =
          annotation.values[5].userEnteredValue.numberValue;
        annotationJSON.Tags = annotation.values[6].userEnteredValue.stringValue;
        annotationJSON.Description =
          annotation.values[7].userEnteredValue.stringValue;
        annotationJSON.Id = annotationIndex;
        annotationIndex++;
        return annotationJSON;
      });

      return videoJSON;
    });
    return dataset;
  } catch (e) {
    return new Error("The template you used cannot be parsed : " + e);
  }
};

module.exports = { cachData, getDataset, getvideData };
