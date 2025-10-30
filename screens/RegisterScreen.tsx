import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView, // Thêm ScrollView để tránh che khuất khi bàn phím hiện
} from "react-native";
import InputField from "../components/InputField"; // Import component
import { getDatabase, ref, get, set, push, query, orderByChild, equalTo } from "firebase/database";
import { getApp } from "firebase/app";

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // 1. Kiểm tra các trường rỗng
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // 2. Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const db = getDatabase(getApp());
      const usersRef = ref(db, "/"); // Giả định node là "users"

      // 3. Kiểm tra xem email đã tồn tại chưa
      // Cách hiệu quả hơn là dùng query thay vì get() toàn bộ
      const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(emailQuery);

      if (snapshot.exists()) {
        // Nếu snapshot có dữ liệu, nghĩa là email đã tồn tại
        Alert.alert("Lỗi", "Email này đã được đăng ký. Vui lòng sử dụng email khác.");
        return;
      }

      // 4. Nếu email chưa tồn tại, tạo người dùng mới
      const newUserRef = push(usersRef); // Tạo ID duy nhất
      await set(newUserRef, {
        username: username,
        email: email,
        password: password, // Cảnh báo: Lưu mật khẩu plain text!
        deleted: false,
      });

      Alert.alert(
        "Thành công",
        "Đăng ký tài khoản thành công. Vui lòng đăng nhập."
      );
      navigation.goBack(); // Quay lại màn hình Login

    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      Alert.alert("Lỗi", "Không thể hoàn tất đăng ký.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>

      <InputField
        label="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập tên của bạn"
        autoCapitalize="words"
      />

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="vidu@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        placeholder="Tối thiểu 6 ký tự"
        secure // Tự động là true
      />

      <InputField
        label="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu"
        secure
      />

      <View style={{ marginVertical: 15 }}>
        <Button title="Đăng ký" onPress={handleRegister} />
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>
          Đã có tài khoản? <Text style={{ color: "blue" }}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Dùng contentContainerStyle cho ScrollView
  container: {
    flexGrow: 1, // Cho phép container lớn lên
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  loginText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});