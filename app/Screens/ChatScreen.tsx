import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
  IMessage,
  BubbleProps,
  InputToolbarProps,
  SendProps,
} from "react-native-gifted-chat";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../Constants/types";
import { db } from "@/firebase";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";
import GlobalApi from "../Services/GlobalApi";
import Markdown from "react-native-markdown-display"; // Import Markdown renderer

type ChatScreenRouteProp = RouteProp<AppStackParamList, "Chat">;

interface ChatMessage extends IMessage {
  role: "user" | "bot";
}

export default function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    const chatDocRef = doc(db, "chats", chatId);

    // Set up real-time listener for chat messages
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        const fetchedMessages = chatData.messages || [];

        // Map Firestore messages to ChatMessage format
        const giftedMessages = fetchedMessages
          .map((msg: any) => ({
            _id: msg._id,
            text: msg.content,
            createdAt: msg.createdAt.toDate
              ? msg.createdAt.toDate()
              : new Date(),
            user: msg.user,
            role: msg.role,
          }))
          .sort(
            (a: ChatMessage, b: ChatMessage) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setMessages(giftedMessages);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const chatDocRef = doc(db, "chats", chatId);

      // Map the messages to add the 'role' property and unique _id
      const messagesWithRole: ChatMessage[] = newMessages.map((message) => ({
        ...message,
        _id: message._id || Math.random().toString(),
        role: "user",
      }));

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messagesWithRole)
      );

      const message = messagesWithRole[0];

      const messageData = {
        _id: message._id,
        content: message.text,
        createdAt: new Date(),
        role: "user",
        user: {
          _id: user?.uid || "1",
          name: user?.email || "User",
          avatar: user?.photoURL || null,
        },
      };

      // Update Firestore with the new message
      await updateDoc(chatDocRef, {
        messages: arrayUnion(messageData),
        updatedAt: serverTimestamp(),
      });

      // Call the API to get the bot's response
      if (message.text) {
        getBotResponse(message.text, chatDocRef);
      }
    },
    [chatId, user]
  );

  const getBotResponse = async (msg: string, chatDocRef: any) => {
    setLoading(true);
    try {
      const resp = await GlobalApi.getBardApi(msg);
      setLoading(false);

      const content = resp.data?.resp || "Sorry, I cannot help with it";
      const isEmergency = resp.data?.emergency || false; // Extract the 'emergency' property

      const botMessage: ChatMessage = {
        _id: Math.random().toString(),
        text: content,
        createdAt: new Date(),
        user: {
          _id: "2",
          name: "ChatDoc",
          avatar:
            "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png",
        },
        role: "bot",
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );

      const messageData = {
        _id: botMessage._id,
        content: botMessage.text,
        createdAt: new Date(),
        role: "bot",
        user: botMessage.user,
      };

      // Update Firestore with the bot's message
      await updateDoc(chatDocRef, {
        messages: arrayUnion(messageData),
        updatedAt: serverTimestamp(),
      });

      // If emergency is true, show the pop-up
      if (isEmergency) {
        setShowEmergencyModal(true);
      }
    } catch (error) {
      console.error("Error getting bot response:", error);
      setLoading(false);
    }
  };

  const handleCallEmergencyNumber = () => {
    setShowEmergencyModal(false);
    const phoneNumber = "tel:9102";
    Linking.openURL(phoneNumber).catch((err) =>
      Alert.alert("Error", "Could not make a call. Please try again.")
    );
  };

  // Add renderMessageText function
  const renderMessageText = (props: any) => {
    const { currentMessage, position } = props;

    const textStyle = {
      color: position === "left" ? "#000" : "#fff",
    };

    return (
      <Markdown
        style={{
          body: {
            ...textStyle,
          },
          strong: {
            fontWeight: "bold",
          },
          em: {
            fontStyle: "italic",
          },
          code_inline: {
            backgroundColor: "#eaeaea",
            borderRadius: 4,
            padding: 4,
          },
        }}
      >
        {currentMessage.text}
      </Markdown>
    );
  };

  const renderBubble = (props: BubbleProps<ChatMessage>) => {
    return (
      <Bubble
        {...props}
        renderMessageText={renderMessageText}
        wrapperStyle={{
          right: {
            backgroundColor: "#671ddf",
            paddingRight: 15,
            paddingLeft: 15,
          },
          left: {
            backgroundColor: "#f0f0f0",
            paddingRight: 15,
            paddingLeft: 15,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: InputToolbarProps<ChatMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          padding: 3,
          backgroundColor: "#671ddf",
          maxHeight: 100,
          overflow: "hidden",
        }}
      />
    );
  };

  const renderSend = (props: SendProps<ChatMessage>) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <FontAwesome name="send" size={24} color="white" />
        </View>
      </Send>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat<ChatMessage>
        messages={messages}
        isTyping={loading}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?.uid || "1",
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />
      {showEmergencyModal && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showEmergencyModal}
          onRequestClose={() => setShowEmergencyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Emergency Detected</Text>
              <Text style={styles.modalMessage}>
                Our assistant has detected that you might need immediate medical
                assistance.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCallEmergencyNumber}
              >
                <Text style={styles.modalButtonText}>
                  Call Emergency Services
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEmergencyModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#671ddf",
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
