// authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";

import { doc, setDoc } from "firebase/firestore";

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Create a new document in the 'users' collection with the user's email as the document ID
  await setDoc(doc(db, "users", email), {
    chats: [], // Initialize 'chats' as an empty array
  });

  return userCredential;
};

export const logIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return signOut(auth);
};
