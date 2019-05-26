const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const app = require("../firebaseConfig");
firebase.initializeApp(app);
const db = firebase.firestore();


db.collection("test")
  .add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
