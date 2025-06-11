import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgVXagd4POZY24sCO7Fnj5xKU6u5fhyLU",
  authDomain: "caresync-3f64f.firebaseapp.com",
  projectId: "caresync-3f64f",
  storageBucket: "caresync-3f64f.firebasestorage.app",
  messagingSenderId: "268175545019",
  appId: "1:268175545019:web:c555a6204ed6038c474f9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Sign up function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out function
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}; 