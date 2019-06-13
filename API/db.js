// const firebase = require("firebase");
// require("firebase/firestore");
// const app = require("../firebaseConfig");
// firebase.initializeApp(app);
// const db = firebase.firestore();

// db.collection("test")
//   .add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   })
//   .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
//   })
//   .catch(function(error) {
//     console.error("Error adding document: ", error);
//   });

let collection = [
  {
    VideoURL: "https://youtu.be/L2DJhwANoUQ",
    VideoLength: {
      hours: "2",
      minutes: "57",
      seconds: "35"
    },
    NumberAnnotations: "3",
    Annotator: {
      Name: "Abdulaziz",
      email: "aalaboud@gmu.edu"
    },
    Annotations: [
      {
        Duration: {
          start: { hours: "0", minutes: "10", seconds: "20" },
          end: { hours: "0", minutes: "11", seconds: "26" }
        },
        Tags: ["Compiler Error", "Debugging", "python"],
        Description:
          "The developer fixes compiler errors. Notice how the error message tells exactly what the problem is"
      },
      {
        Duration: {
          start: { hours: "1", minutes: "45", seconds: "`14`" },
          end: { hours: "2", minutes: "17", seconds: "12" }
        },
        Tags: [
          "Code navigation",
          "Debugging",
          "vim",
          "slow debugging",
          "python"
        ],
        Description:
          "The debugging process was slow because each time the application restart, it hast to load an index big files. The developers utilized this time by reading on API documentation that he want to do and actually implementing it. the fixes are easy but the time to restart the application is every expensive. he suggested that to make debugging easier is to create smaller application with less indexes:2:16:00"
      },
      {
        Duration: {
          start: { hours: "2", minutes: "23", seconds: "0" },
          end: { hours: "2", minutes: "42", seconds: "34" }
        },
        Tags: [
          "Wrong output",
          "Debugging",
          "Code navigation",
          "logging",
          "API",
          "python"
        ],
        Description:
          "developer used new API and he is trying to make it work. He is not sure how to properly use an API to implement a feature."
      }
    ]
  },
  {
    VideoURL: "https://youtu.be/xxmNU-Myokc",
    VideoLength: {
      hours: "1",
      minutes: "25",
      seconds: "28"
    },
    NumberAnnotations: "3",
    Annotator: {
      Name: "Abdulaziz",
      email: "aalaboud@gmu.edu"
    },
    Annotations: [
      {
        Duration: {
          start: { hours: "0", minutes: "31", seconds: "51" },
          end: { hours: "0", minutes: "52", seconds: "5" }
        },
        Tags: ["Compiler Error", "Debugging", "C++", "Hypothesis"],
        Description:
          "The developer wrote code for half an hour and now trying to make it compile. Some one from the chat help him in debugging."
      },
      {
        Duration: {
          start: { hours: "0", minutes: "52", seconds: "5" },
          end: { hours: "0", minutes: "59", seconds: "39" }
        },
        Tags: ["Code navigation", "Debugging", "vim", "C++", "Hardware", "API"],
        Description:
          "The developer is trying to use another camera to record his face. The main camera is currently busy recording the live-stream."
      },
      {
        Duration: {
          start: { hours: "0", minutes: "59", seconds: "39" },
          end: { hours: "1", minutes: "3", seconds: "59" }
        },
        Tags: ["Compiler Error", "Debugging", "C++", "slip"],
        Description:
          "The developer is stuck not knowing what to do ``Dear bug where are you?'' he rewrites the command line and it fixed, he forgot to add -o the first time"
      }
    ]
  }
];
module.exports = collection;
