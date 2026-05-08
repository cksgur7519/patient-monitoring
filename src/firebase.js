/* import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"

  apiKey: "AIzaSyDubSFser3QrdTizPQE8hr30yYEJ1Fp5Rs",
  authDomain: "patient-monitoring-9dbfd.firebaseapp.com",
  projectId: "patient-monitoring-9dbfd",
  storageBucket: "patient-monitoring-9dbfd.firebasestorage.app",
  messagingSenderId: "1020824873560",
  appId: "1:1020824873560:web:dd1d23aaad94c7ba8af82d",
  measurementId: "G-VNXNVE7JPS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDubSFser3QrdTizPQE8hr30yYEJ1Fp5Rs",
  authDomain: "patient-monitoring-9dbfd.firebaseapp.com",
  projectId: "patient-monitoring-9dbfd",
  storageBucket: "patient-monitoring-9dbfd.firebasestorage.app",
  messagingSenderId: "1020824873560",
  appId: "1:1020824873560:web:dd1d23aaad94c7ba8af82d",
  measurementId: "G-VNXNVE7JPS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();