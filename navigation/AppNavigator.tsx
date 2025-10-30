import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserListScreen from "../screens/UserListScreen";
import AddUserScreen from "../screens/AddUserScreen";
import EditUserScreen from "../screens/EditUserScreen";

const Stack = createNativeStackNavigator();
// Hàm xử lý đăng xuất
const handleLogout = (navigation: any) => {
  Alert.alert(
    "Đăng xuất", // Tiêu đề
    "Bạn có chắc chắn muốn đăng xuất?", // Thông báo
    [
      // Nút 1: Hủy
      {
        text: "Hủy",
        style: "cancel",
      },
      // Nút 2: OK (Đăng xuất)
      {
        text: "OK",
        onPress: () => {
          // Reset stack và quay về màn hình Login
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#007bff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Đăng nhập" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Đăng ký" }}
        />
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={({ navigation }) => ({
            title: "Danh sách người dùng",
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>  
                {/* Nút Đăng xuất */}
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => handleLogout(navigation)} // Gọi hàm
                >
                  <Ionicons name="log-out-outline" size={28} color="white" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AddUser"
          component={AddUserScreen}
          options={{ title: "Thêm người dùng" }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{ title: "Sửa người dùng" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
