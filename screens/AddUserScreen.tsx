import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { getDatabase, ref, push, set } from "firebase/database";
import { getApp } from "firebase/app";

export default function AddUserScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Xem cảnh báo bảo mật bên dưới

  const handleSave = async () => {
    // Kiểm tra xem các trường có bị trống không
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const db = getDatabase(getApp());
      
      // 1. Trỏ đến node "users" (rất quan trọng)
      const usersListRef = ref(db, "/");

      // 2. Dùng push() để tạo một tham chiếu MỚI với ID duy nhất
      const newUserRef = push(usersListRef);

      // 3. Chuẩn bị dữ liệu người dùng mới
      const newUserData = {
        username: username,
        email: email,
        password: password, // Xem cảnh báo bảo mật
        deleted: false, // Mặc định khi tạo mới
      };

      // 4. Dùng set() để LƯU dữ liệu vào tham chiếu MỚI đó
      await set(newUserRef, newUserData);

      Alert.alert("Thành công", "Đã thêm người dùng mới!");

      // 5. Tự động quay lại màn hình danh sách
      navigation.goBack();

    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      Alert.alert("Lỗi", "Không thể thêm người dùng.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm người dùng mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập (username)"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Ẩn mật khẩu
      />

      <Button title="Lưu lại" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});