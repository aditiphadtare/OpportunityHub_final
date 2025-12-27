import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBinsk2kH0l48OSCUFAc72qnpASg9URX4",
    authDomain: "opportunityhub-6321a.firebaseapp.com",
    projectId: "opportunityhub-6321a",
    storageBucket: "opportunityhub-6321a.appspot.com",
    messagingSenderId: "1041772408386",
    appId: "1:1041772408386:web:5cbf7740d5285d971707db",
  };
  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

