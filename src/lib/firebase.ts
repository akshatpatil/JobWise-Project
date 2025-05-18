// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtqkEIduyUV3K0Eq5lJdpg8E2Mg3IHE5s",
  authDomain: "jobwise-fc8e1.firebaseapp.com",
  projectId: "jobwise-fc8e1",
  storageBucket: "jobwise-fc8e1.firebasestorage.app",
  messagingSenderId: "704200061273",
  appId: "1:704200061273:web:069f2cb342e23ea95d9c48",
  measurementId: "G-3BFRMSXPER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const functions = getFunctions(app);
// const messaging = getMessaging(app);
// const performance = getPerformance(app);
export { app, auth, analytics };
