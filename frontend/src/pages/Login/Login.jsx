import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  if (user) {
    return <Navigate to="/" />;
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <div className="p-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg text-center border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-black">Login to Task Manager</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-lg font-semibold"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
