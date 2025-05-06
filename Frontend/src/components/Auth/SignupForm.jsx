import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim spaces from names and username
    const cleanFirstname = firstname.replace(/\s/g, "");
    const cleanLastname = lastname.replace(/\s/g, "");
    const cleanUsername = username.replace(/\s/g, "");

    if (!email.endsWith("@gmail.com")) {
      return toast.error("Email must be a @gmail.com address.", {
        theme: "dark",
      });
    }
    if (!validatePassword(password)) {
      return toast.error(
        "Password must contain at least one uppercase, one lowercase, one digit, one special character, and be at least 8 characters long!.",
        { theme: "dark" }
      );
    } 

    try {
      const response = await axios.post(
        "http://localhost:3001/api/Auth/signup",
        {
          firstname: cleanFirstname,
          lastname: cleanLastname,
          username: cleanUsername,
          email,
          password,
        }
      );

      toast.success(response.data, { theme: "dark" });
      navigate("/Loginform");
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          toast.error("User with this email already exists.", {
            theme: "dark",
          });
        } else if (status === 500) {
          toast.error("Internal Server Error. Please try again later.", {
            theme: "dark",
          });
        }
      } else {
        toast.error("An unexpected error occurred. Please try again!", {
          theme: "dark",
        });
      }
    }

    setFirstname("");
    setLastname("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <p className="m-0 text-[32px] font-sans font-semibold dark:text-white">
          Signup
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative py-3 sm:max-w-xs sm:mx-auto cursor-auto">
          <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            <div className="flex flex-col justify-center items-center h-full select-none">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between flex-row">
                  <div className="flex flex-col w-1/2 gap-2">
                    <label className="font-semibold text-xs text-gray-400">
                      Firstname
                    </label>
                    <input
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      required
                      placeholder="Firstname"
                      className="text-white border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 gap-2">
                    <label className="font-semibold text-xs text-gray-400">
                      Lastname
                    </label>
                    <input
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      required
                      placeholder="Lastname"
                      className="text-white border rounded-lg px-3 py-2 mb-5 ml-2 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                  className="text-white border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="font-semibold text-xs text-gray-400">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xyz@gmail.com"
                className="text-white border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                type="email"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2 relative">
              <label className="font-semibold text-xs text-gray-400">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-white border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                type={showPassword ? "text" : "password"}
                required
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <button
              type="submit"
              className="py-1 px-8 bg-blue-500 hover:bg-blue-800 text-white w-full rounded-lg"
            >
              Create Account
            </button>
            <div className="text-center text-gray-300 mt-3">
              Already have an account?
              <Link to="/Loginform" className="text-purple-300 ml-3">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default SignupForm;
