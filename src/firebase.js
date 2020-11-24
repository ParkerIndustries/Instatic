import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyCtttwia8iHToeYqMg0nirG2NMvstog9Dg",
        authDomain: "instatic-ms2099.firebaseapp.com",
        databaseURL: "https://instatic-ms2099.firebaseio.com",
        projectId: "instatic-ms2099",
        storageBucket: "instatic-ms2099.appspot.com",
        messagingSenderId: "503938361064",
        appId: "1:503938361064:web:d983a9cfd268422e33cb5d",
        measurementId: "G-L6SVPGN8MP"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};