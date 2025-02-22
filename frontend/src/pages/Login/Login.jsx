
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation()

  const from = location.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace={true} />;

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("User Signed In:", result.user);
        navigate("/tasks");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className=" p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Login to Task Manager</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
