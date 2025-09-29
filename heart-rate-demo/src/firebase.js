import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrs_sGZ20jBXgXLnrTVQcFyxNeaGWr5fY",
  authDomain: "windy-lyceum-472823-a6-ab51f.firebaseapp.com",
  projectId: "windy-lyceum-472823-a6-ab51f",
  storageBucket: "windy-lyceum-472823-a6-ab51f.appspot.com",
  messagingSenderId: "33571850044",
  appId: "1:33571850044:web:a73c60d28189b519338039",
  measurementId: "G-NWB6NGKNEB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
