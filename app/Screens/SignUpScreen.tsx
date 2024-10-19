// SignUpScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { signUp } from "../Services/authService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../Constants/types";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerH1}>Sign Up</Text>
          <Text style={styles.headerH6}>
            Create an account to start using AI-Bolit
          </Text>
        </View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style = {styles.buttomText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Already have an account?
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.helperTextHighlight}> Log In</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
  },
  main: {
    maxWidth: 1000,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  header: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 22,
  },
  headerH1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerH6: {
    fontSize: 16,
    color: "gray",
  },

  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#7f0bfd",
    alignItems: "center",
    justifyContent: "center",
  },
  buttomText: {
    color: "white",
  },

  helperText: {
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  helperTextHighlight: {
    fontWeight: "500",
    marginLeft: 4,
  },
});
