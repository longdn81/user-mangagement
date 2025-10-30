import { db, storage } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../types/user.t";

const userCollection = collection(db, "users");

// 🟢 Thêm người dùng mới
export const addUser = async (user: User, imageFile?: any) => {
  let imageUrl = "";
  if (imageFile) {
    const imageRef = ref(storage, `users/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  await addDoc(userCollection, { ...user, image: imageUrl, deleted: false });
};

// 🟣 Lấy danh sách người dùng (chỉ hiển thị chưa bị xóa)
export const getUsers = async (): Promise<User[]> => {
  const q = query(userCollection, where("deleted", "==", false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
};

// 🟡 Cập nhật thông tin người dùng
export const updateUser = async (id: string, user: Partial<User>) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, user);
};

// 🔴 Xóa mềm người dùng (chỉ đánh dấu deleted = true)
export const softDeleteUser = async (id: string) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, { deleted: true });
};
