// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Thêm Firebase Auth
import { getFirestore } from "firebase/firestore";  // Thêm Firestore nếu cần

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBcciEjpQ_4KEH1XhEar_cjLNPTJw7-NYU",
  authDomain: "chuyende-13cb1.firebaseapp.com",
  databaseURL: "https://chuyende-13cb1-default-rtdb.firebaseio.com",
  projectId: "chuyende-13cb1",
  storageBucket: "chuyende-13cb1.appspot.com",
  messagingSenderId: "8220361854",
  appId: "1:8220361854:web:08c8fac1a4d8e940d6442f",
  measurementId: "G-T5X9079H88"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth và Firestore nếu cần
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
