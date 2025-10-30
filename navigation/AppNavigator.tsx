import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
import UserListScreen from "../screens/UserListScreen";
import AddUserScreen from "../screens/AddUserScreen";
import EditUserScreen from "../screens/EditUserScreen";

const Stack = createNativeStackNavigator();

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
        {/* <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Đăng ký" }}
        /> */}
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={{ title: "Danh sách người dùng" }}
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
