import { useContext, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { backendUrl, setToken, setUser, getUserCredits } = useContext(AppContext);
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputVal((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const { data } = await axios.post(
          backendUrl + "/api/user/register",
          inputVal,
        );
        if (data.success) {
          await getUserCredits();
          toast.success("Account created succesfully!");
          navigate("/");
          setUser(true);
          setToken(localStorage.setItem("token", data.token));
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/user/login",
          inputVal,
        );
        if (data.success) {
          await getUserCredits();
          toast.success("User logged In succesfully");
          navigate("/");
          setUser(true);
          setToken(localStorage.setItem("token", data.token));
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={handleFormSubmit}
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {isSignup ? "Sign Up" : "Sign In"}
        </h1>

        <p className="text-sm">
          {isSignup
            ? "Create your account to continue"
            : "Welcome back! Please sign in to continue"}
        </p>

        {isSignup && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.profile_icon} alt="" className="w-6 h-6" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="outline-none text-sm"
              name="name"
              value={inputVal.name}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
          <img src={assets.email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            required
            className="outline-none text-sm"
            name="email"
            value={inputVal.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
          <img src={assets.lock_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            required
            className="outline-none text-sm"
            name="password"
            value={inputVal.password}
            onChange={handleInputChange}
          />
        </div>

        {!isSignup && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-5">
          {isSignup ? "Create Account" : "Login"}
        </button>

        {isSignup ? (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsSignup(false)}
            >
              Log In
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </motion.form>
    </div>
  );
};

export default Login;
