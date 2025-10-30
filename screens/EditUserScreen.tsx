import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { getDatabase, ref, update } from "firebase/database";
import { getApp } from "firebase/app";
import { User } from "../types/user.t";

export default function EditUserScreen({ route, navigation }: any) {
  const { user } = route.params as { user: User };
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);

  const handleSave = async () => {
    try {
      const db = getDatabase(getApp());
      const userRef = ref(db, `${user.id}`); 
      await update(userRef, {
        username,
        email,
        password,
      });

      Alert.alert("Thành công", "Cập nhật thông tin người dùng thành công!");
      navigation.goBack(); // quay lại danh sách
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật người dùng.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa người dùng</Text>

      <Text style={styles.label}>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="💾 Lưu thay đổi" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
});
