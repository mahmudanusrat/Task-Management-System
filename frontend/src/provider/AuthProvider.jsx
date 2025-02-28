import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../firebase/firebaseConfig";
import AuthContext from "./AuthContext";
import PropTypes from "prop-types";
import axios from "axios";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const viteApi = import.meta.env.VITE_API_URL;

  const signInWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
       axios.post(`${viteApi}/user`, {
          email: currentUser.email,
          uid: currentUser.uid,
          name: currentUser.displayName,
        }).catch((error) => {
          console.error("Error sending user data:", error);
        });
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [viteApi]);

  const authInfo = {
    user,
    setUser,
    loading,
    signInWithGoogle,
    logOut,
  };

  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthProvider;
