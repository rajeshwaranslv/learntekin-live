import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6dbehEp7W1xLcy_mKajeAxwEMAJkCR1Y",
  authDomain: "learntekin-965be.firebaseapp.com",
  databaseURL: "https://learntekin-965be-default-rtdb.firebaseio.com",
  projectId: "learntekin-965be",
  storageBucket: "learntekin-965be.appspot.com",
  messagingSenderId: "224295322327",
  appId: "1:224295322327:web:f6c1bde3f6494a17eae692",
  measurementId: "G-M4C0ZWRMS0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.database();
export const db = firebase.firestore();
export default firebase;
