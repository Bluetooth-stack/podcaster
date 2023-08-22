// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_RAPID_API_KEY,
  authDomain: "podcasters-3bd1f.firebaseapp.com",
  projectId: "podcasters-3bd1f",
  storageBucket: "podcasters-3bd1f.appspot.com",
  messagingSenderId: "139014090631",
  appId: process.env.REACT_APP_RAPID_APP_ID,
  measurementId: "G-0ZPBRK10EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db }
export const gProvider = new GoogleAuthProvider();
export const fbProvider = new FacebookAuthProvider();