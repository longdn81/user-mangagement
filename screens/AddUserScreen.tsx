import React, { useEffect, useState } from "react";
import {
  View,
  Text,Image ,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, push, set } from "firebase/database";
import { getApp } from "firebase/app";
import * as ImagePicker from "expo-image-picker"; 
import InputField from "../components/InputField"; 


export default function AddUserScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Xem cảnh báo bảo mật bên dưới

  const [image, setImage] = useState<string | null>(null); // State cho URI ảnh
  const [uploading, setUploading] = useState(false);
  // Xin quyền truy cập thư viện ảnh
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Xin lỗi",
            "Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh."
          );
        }
      }
    })();
  }, []);

  // Hàm chọn ảnh
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
  // Hàm 
  async function handleSave() {
    // Kiểm tra xem các trường có bị trống không
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setUploading(true); // Bắt đầu loading
      let finalImageUrl: string | null = null;

      //  Upload ảnh lên Cloudinary NẾU người dùng đã chọn
      if (image) {
       
         const CLOUDINARY_CLOUD_NAME = "dcmlb1cto" ; 
        const CLOUDINARY_UPLOAD_PRESET = "user-management"; 

        const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        const formData = new FormData();

        formData.append("file", {
          uri: image,
          type: "image/jpeg",
          name: `profile_${Date.now()}.jpg`,
        } as any); 
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = await response.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
        } else {
          throw new Error("Upload lên Cloudinary thất bại");
        }
      } // Kết thúc upload

      //  Lưu dữ liệu (bao gồm cả URL ảnh) vào Firebase
      const db = getDatabase(getApp());
      
      const usersListRef = ref(db, "/");
      const newUserRef = push(usersListRef);

      const newUserData = {
        username: username,
        email: email,
        password: password,
        deleted: false,
        image: finalImageUrl, // Thêm URL ảnh vào đây
      };

      await set(newUserRef, newUserData);

      setUploading(false);

      Alert.alert("Thành công", "Đã thêm người dùng mới!");

      // 5. Tự động quay lại màn hình danh sách
      navigation.goBack();

    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      Alert.alert("Lỗi", "Không thể thêm người dùng.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm người dùng mới</Text>

      {/* Vùng chọn ảnh */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>📷 Chọn ảnh</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Dùng InputField cho nhất quán */}
      <InputField
        label="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập tên đăng nhập"
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
        placeholder="Nhập mật khẩu"
        secure
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title={uploading ? "⏳ Đang tải lên..." : "💾 Lưu lại"}
          onPress={handleSave}
          disabled={uploading}
        />
      </View>
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
  
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});