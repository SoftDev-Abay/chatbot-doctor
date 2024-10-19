import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "../Constants/types";

import HomeScreen from "../Screens/HomeScreen";
import ChatScreen from "../Screens/ChatScreen";
import Sidebar from "../Components/Sidebar";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logOut } from "../Services/authService";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack({ navigation }: any) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  return (
    <>
      <Sidebar
        navigation={navigation}
        isOpen={isOpenSidebar}
        setIsOpen={setIsOpenSidebar}
      />
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={24}
          color="black"
          onPress={() => setIsOpenSidebar(!isOpenSidebar)}
        />

        <Text
            style={styles.headerText}
        >AI-Bolit</Text>

        <Ionicons
          name="log-out"
          size={24}
          color="black"
          onPress={() => logOut()}
        />
      </View>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  chatItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
  },

  headerText: {
    fontSize: 20,
  },
});
