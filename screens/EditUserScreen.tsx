import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { getDatabase, ref, update } from "firebase/database";
import { getApp } from "firebase/app";
import { User } from "../types/user.t";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

import InputField from "../components/InputField";

export default function EditUserScreen({ route, navigation }: any) {
  const { user } = route.params as { user: User };
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [image, setImage] = useState(user.image || null);
  const [uploading, setUploading] = useState(false);

  // 3. THÊM HÀM XIN QUYỀN (Permissions)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Xin lỗi', 'Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh.');
        }
      }
    })();
  }, []);

  // 📸 Chọn ảnh từ thư viện
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const db = getDatabase(getApp());
      const userRef = ref(db, `${user.id}`);

      let imageUrl = image;

      // Nếu người dùng vừa chọn ảnh mới (từ local path)
      if (image && image.startsWith("file")) {
        setUploading(true);

        // !!! THAY THẾ BẰNG THÔNG TIN CỦA BẠN !!!
        const CLOUDINARY_CLOUD_NAME = "dcmlb1cto" ; 
        const CLOUDINARY_UPLOAD_PRESET = "user-management"; // (ví dụ: "react-native-app")
        
        const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      
        // Tạo FormData để gửi file
        const formData = new FormData();
        formData.append("file", {
            uri: image,
            type: "image/jpeg",
            name: `profile_${user.id}.jpg`,
          } as any);

        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      
        // Gửi request
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = await response.json();
        
        if (data.secure_url) {
          imageUrl = data.secure_url; // Lấy URL trả về
        } else {
          throw new Error("Upload lên Cloudinary thất bại");
        }
        
        setUploading(false);
      } // Kết thúc logic upload

      // 6. Cập nhật Realtime Database
      const updateData: any = {
        username: username,
        email: email,
        image: imageUrl, // Lưu URL mới (hoặc cũ)
      };

      if (password.length > 0) {
        updateData.password = password;
      }

      await update(userRef, updateData);

      Alert.alert("Thành công", "Cập nhật thông tin người dùng thành công!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật người dùng.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa người dùng</Text>

      {/* Ảnh đại diện */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>📷 Chọn ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Tên người dùng</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput style={styles.input} value={password} secureTextEntry onChangeText={setPassword} />

      <Button
        title={uploading ? "⏳ Đang tải ảnh..." : "💾 Lưu thay đổi"}
        onPress={handleSave}
        disabled={uploading}
      />
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
  avatarContainer: { alignSelf: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
