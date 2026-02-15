import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user ONLY
  const [role, setRole] = useState(null); // Role from backend
  const [loading, setLoading] = useState(true);

  const refreshRole = useCallback(async () => {
    if (!auth.currentUser) return;

    const token = await auth.currentUser.getIdToken(true);

    const res = await fetch(
      `https://ticketbari-server.onrender.com/users/${auth.currentUser.email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    setRole(data?.role || "user");
  }, []);

  // Register
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email login
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout
  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // ✅ ALWAYS get fresh Firebase ID token
          const token = await currentUser.getIdToken();

          const res = await fetch(
            `https://ticketbari-server.onrender.com/users/${currentUser.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!res.ok) throw new Error("Role fetch failed");

          const data = await res.json();
          setRole(data?.role || "user");
        } catch (err) {
          console.error("Role fetch error:", err);
          setRole("user");
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    refreshRole,
    createUser,
    signIn,
    googleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
