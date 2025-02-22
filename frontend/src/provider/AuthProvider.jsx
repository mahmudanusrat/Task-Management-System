import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../firebase/firebaseConfig";
import axios from "axios";
import AuthContext from "./AuthContext";
import PropTypes from "prop-types";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email, displayName } = result.user;

      // Store user in MongoDB
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users`, // Adjust your API route
        { uid, email, displayName },
        { withCredentials: true }
      );

      return result;
    } catch (error) {
      console.error("Error with Google sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    setLoading(true);
    signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        setUser(currentUser);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/jwt`,
          {
            email: currentUser?.email,
          },
          { withCredentials: true }
        );
      } else {
        setUser(currentUser);
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {
          withCredentials: true,
        });
      }
      setLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    signIn,
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
