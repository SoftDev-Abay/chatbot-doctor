// HomeScreen.tsx
import React, { useEffect, useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../Constants/types";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const createChatAndNavigate = async () => {
      try {
        // Reference to the 'chats' collection
        const chatsRef = collection(db, "chats");

        // Generate a unique chat name
        const newChatName = "Chat Room " + Math.floor(Math.random() * 10000);

        // Create a new chat document with initial bot message
        const newChatDoc = await addDoc(chatsRef, {
          chatName: newChatName,
          userId: user?.uid || "",
          messages: [
            {
              _id: 1,
              content:
                "Здравствуйте, меня зовут AI-Bolit, как я могу вам помочь?",
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
          createdAt: new Date(),
          updatedAt: serverTimestamp(),
        });

        // Reference to the user's document
        const usersRef = doc(db, "users", user?.email || "");

        // Update the user's chats array with the new chat
        await setDoc(
          usersRef,
          {
            chats: arrayUnion({
              chatId: newChatDoc.id,
              chatName: newChatName, // Use the local variable instead of newChatDoc.data()
            }),
          },
          { merge: true }
        );

        // Navigate to the Chat screen with the new chatId
        navigation.replace("Chat", { chatId: newChatDoc.id });
      } catch (error) {
        console.error("Error creating chat and navigating:", error);
        // Optionally, display an error message to the user
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      createChatAndNavigate();
    }
  }, [user, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#671ddf" />
      </View>
    );
  }

  return null; // Since we're redirecting, no UI is needed
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
