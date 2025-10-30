import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import InputField from "../components/InputField";
import { getDatabase, ref, get, child } from "firebase/database";
import { getApp } from "firebase/app"; // để lấy app đã khởi tạo sẵn

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    try {
      const db = getDatabase(getApp());
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "/")); 
      if (snapshot.exists()) {
        const users = snapshot.val();

        // tìm user có email và password trùng
        const foundUser = Object.values(users).find(
          (user: any) => user.email === email && user.password === password
        );

        if (foundUser) {
          Alert.alert("Thành công", `Xin chào`);
          navigation.replace("UserList"); // chuyển sang màn UserList
        } else {
          Alert.alert("Đăng nhập thất bại", "Sai email hoặc mật khẩu!");
        }
      } else {
        Alert.alert("Lỗi", "Không tìm thấy dữ liệu người dùng.");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      Alert.alert("Lỗi", "Không thể kết nối cơ sở dữ liệu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <InputField label="Email" value={email} onChangeText={setEmail} />
      <InputField
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secure
      />

      <View style={{ marginVertical: 15 }}>
        <Button title="Đăng nhập" onPress={handleLogin} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={{ color: "blue" }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  registerText: { textAlign: "center", marginTop: 10, fontSize: 16 },
});
