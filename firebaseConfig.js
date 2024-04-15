// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBiynfcHS_l94IHGXlZDT4Ez-K_kd2Z-yk",

  authDomain: "crossplatformproject-8babd.firebaseapp.com",

  projectId: "crossplatformproject-8babd",

  storageBucket: "crossplatformproject-8babd.appspot.com",

  messagingSenderId: "436355126742",

  appId: "1:436355126742:web:710a8f349ffad1d1ee8077"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app)

export {db, auth}