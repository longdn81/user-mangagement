import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import UserCard from "../components/UserCard";
import { getDatabase, ref, get, child, update } from "firebase/database";
import { getApp } from "firebase/app";
import { User } from "../types/user.t";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from "@react-navigation/native";


export default function UserListScreen({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);

  const isFocused = useIsFocused();

  // 🧩 Lấy danh sách user từ Realtime Database
  const fetchUsers = async () => {
    try {
      const db = getDatabase(getApp());
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "/"));

      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: User[] = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...(value as Omit<User, "id">),
        }));

        // lọc user chưa bị xóa mềm
        setUsers(list.filter((u) => !u.deleted));
      } else {
        Alert.alert("Thông báo", "Không có người dùng nào trong cơ sở dữ liệu.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
    }
  };

  // 🗑️ Xóa mềm user
  const handleDelete = async (id: string) => {
    try {
      const db = getDatabase(getApp());
      const userRef = ref(db, `${id}`);
      await update(userRef, { deleted: true });
      Alert.alert("Thành công", "Người dùng đã bị ẩn (xóa mềm)");
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể xóa người dùng");
    }
  };

  // ✏️ Sửa user (minh họa)
  const handleEdit = (user: User) => {
    navigation.navigate("EditUser", { user });
  };

  useEffect(() => {
    // Chỉ fetch khi màn hình được focus
    if (isFocused) { 
      console.log("Màn hình được focus, đang tải lại dữ liệu...");
      fetchUsers();
    }
  }, [isFocused]); // <-- Thay đổi dependency thành [isFocused]

  return (
    <View style={styles.container}>
          
      <View style={styles.headerRow}>
        {/* Tiêu đề bên trái */}
        <Text style={styles.title}>Danh sách người dùng</Text>

        {/* Nút cộng bên phải */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddUser')} 
        >
          <FontAwesome name="user-plus" size={32} color= "black" /> 
        </TouchableOpacity>
      </View>

      {users.length === 0 ? (
        <Text>Không có người dùng nào</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id + ""}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id + "")}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", flex: 1 , textAlign: "center"},
  headerRow: {
    flexDirection: 'row',       // Xếp con theo chiều ngang
    justifyContent: 'space-between', // Đẩy 2 con về 2 phía
    alignItems: 'center',      // Căn giữa theo chiều dọc
    marginBottom: 20,          // Giữ khoảng cách cũ của title
  },
  addButton: {
    padding: 5, 
  }
});
