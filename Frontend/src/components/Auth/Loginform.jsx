import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email format
    if (!email.endsWith("@gmail.com")) {
      return toast.error("Email must be a Gmail address!", {
        position: "top-center",
        autoClose: 1500,
      });
    }

    // Send login request
    axios
      .post("http://localhost:3001/api/Auth/Login", { email, password })
      .then((res) => {
        if (res.status === 200 && res.data.token) {
          login(res.data.token); // Call the login function from context
          toast.success("Login Successful!", {
            position: "top-center",
            autoClose: 1500,
          });
          navigate("/"); // Navigate to the home page
        } else if (res.status === 404) {
          toast.error("User not found!", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      })
      .catch(() => {
        toast.error("Invalid credentials! Please try again.", {
          position: "top-center",
          autoClose: 1500,
        });
      });

    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative py-3 sm:max-w-xs sm:mx-auto">
        <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <div className="flex flex-col justify-center items-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <p className="m-0 text-[25px] font-semibold dark:text-white">
                Login
              </p>
            </div>

            {/* Email */}
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-400">
                Email
              </label>
              <input
                placeholder="xyz@gmail.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg text-white px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
              />
            </div>

            {/* Password */}
            <div className="w-full flex flex-col gap-2 relative">
              <label className="font-semibold text-xs text-gray-400">
                Password
              </label>
              <input
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="border rounded-lg px-3 text-white py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
              />
              {/* Eye Icon for Password Toggle */}
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ?  <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="py-1 px-8 bg-blue-500 hover:bg-blue-800 text-white w-full rounded-lg"
              >
                Login
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-gray-300 mt-3">
              Don&apos;t have an account?
              <Link to="/SignupForm" className="text-purple-300 ml-3">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
