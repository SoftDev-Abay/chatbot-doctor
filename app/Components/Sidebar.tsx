// Sidebar.tsx
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "@/firebase";
import { AuthContext } from "../Context/AuthContext";
import { doc, getDoc, collection, addDoc, setDoc } from "firebase/firestore";
import { logOut } from "../Services/authService";
import Ionicons from "@expo/vector-icons/Ionicons";

const Sidebar = ({
  navigation,
  isOpen,
  setIsOpen,
}: {
  navigation: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<{ id: string; chatName: string }[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.email || "");
        const userDocSnap = await getDoc(userDocRef);

        console.log("User Doc Snap:", userDocSnap.data());

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setChats(userData.chats || []);
        }
      }
    };

    fetchChats();
  }, [user]);

  const AddNewChat = async () => {
    const collectionRef = collection(db, "chats");

    const newName = "Chat Room" + Math.floor(Math.random() * 10000);

    const docRef = await addDoc(collectionRef, {
      chatName: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          _id: 1,
          content:
            "Здравствуйте, меня зовут AI-Bolit, как я могу вам помочь ?",
          role: "bot",
          user: {
            _id: 2,
            name: "AI-Bolit",
            avatar:
              "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png",
          },
          createdAt: new Date(),
        },
      ],
    });

    const userDocRef = doc(db, "users", user?.email || "");
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const newChats = [
        ...(userData?.chats || []),
        {
          id: docRef.id,
          chatName: newName,
        },
      ];
      await setDoc(userDocRef, { chats: newChats });
      setChats(newChats);
    }

    navigation.navigate("Chat", { chatId: docRef.id });
  };

  // Only render sidebar if `isOpen` is true
  if (!isOpen) return null;

  return (
    <View style={styles.sidebar}>
      <Ionicons
        name="close"
        size={25}
        color="gray"
        style={styles.closeIcon}
        onPress={() => setIsOpen(false)}
      />

      <View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={AddNewChat} style={styles.logoutView}>
            <Ionicons name="chatbox-ellipses" size={20} color="gray" />
            <Text style={styles.chatItem}>AI-Bolit</Text>
          </TouchableOpacity>
        </View>
        <View>
          {chats.map(({ id, chatName }) => (
            <TouchableOpacity
              key={id}
              onPress={() => {
                navigation.navigate("Chat", { chatId: id });
                setIsOpen(false);
              }}
            >
              <Text style={styles.chatItem}>{chatName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.logoutView}>
        <Ionicons name="log-out" size={20} color="gray" />
        <Text style={styles.logOutText} onPress={logOut}>
          Logout
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: "60%", // Set the width of the sidebar
    height: "100%",
    backgroundColor: "#111",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 20,
    zIndex: 1,
    fontSize: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  controls: {
    marginBottom: 20,
    // paddingLeft: 12,
    // paddingRight: 12,
  },
  chatItem: {
    padding: 12,
    color: "#fff",
  },
  logoutView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  logOutText: {
    color: "white",
  },
  closeIcon: {
    position: "absolute",
    top: 28,
    right: 20,
    zIndex: 2,
  },
});

export default Sidebar;
