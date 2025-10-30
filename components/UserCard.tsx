import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { User } from "../types/user.t";

interface Props {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserCard({ user, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      {user.image ? (
        <Image source={{ uri: user.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>👤</Text>
        </View>
      )}

      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.buttonRow}>
        <Button title="Sửa" onPress={onEdit} />
        <Button title="Xóa" color="red" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignSelf: "center",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  email: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
