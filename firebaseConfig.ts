// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚙️ Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDxTGyPACEPCSUoMsD_cIkGjwrhn5NXp00",
  authDomain: "users-1cd4a.firebaseapp.com",
  databaseURL: "https://users-1cd4a-default-rtdb.firebaseio.com",
  projectId: "users-1cd4a",
  storageBucket: "users-1cd4a.firebasestorage.app",
  messagingSenderId: "656422959703",
  appId: "1:656422959703:web:478465d0665086975c0112",
};

// 🚀 Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// 🗃️ Lấy Firestore
export const db = getFirestore(app);

export const storage = getStorage(app);
