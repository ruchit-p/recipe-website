// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const addBookmark = async (recipeId) => {
    if (!currentUser) throw new Error("Not authenticated");

    const userDocRef = doc(db, "bookmarks", currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        bookmarks: arrayUnion(recipeId),
      });
    } else {
      await setDoc(userDocRef, { bookmarks: [recipeId] });
    }
  };

  const removeBookmark = async (recipeId) => {
    if (!currentUser) throw new Error("Not authenticated");

    const userDocRef = doc(db, "bookmarks", currentUser.uid);
    await updateDoc(userDocRef, {
      bookmarks: arrayRemove(recipeId),
    });
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    addBookmark,
    removeBookmark,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
