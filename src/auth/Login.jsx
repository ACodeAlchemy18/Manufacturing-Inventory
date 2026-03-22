import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("No user found. Please signup first.");
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    localStorage.setItem("auth", "true");
    navigate("/inventory");
  } else {
    alert("Invalid credentials");
  }
};

  return (
    <div className="h-screen w-full flex bg-[#f6f5f2]">

      {/* LEFT SIDE (FORM) */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        

        {/* Heading */}
        <h2 className="text-5xl font-bold mb-10 text-gray-900">
          SIGN IN
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Your business email"
          className="w-full mb-4 px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Your password"
          className="w-full mb-2 px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-lime-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot */}
        <p
          className="text-sm text-gray-500 mb-6 cursor-pointer"
          onClick={() => navigate("/forgot")}
        >
          Don’t remember your password?
        </p>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-md w-40"
        >
          Sign in
        </button>

        {/* Signup */}
        <p className="mt-6 text-sm text-gray-600">
          Don’t have account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer"
          >
            Signup
          </span>
        </p>
      </div>

      {/* RIGHT SIDE (ILLUSTRATION) */}
      <div className="w-1/2 flex items-center justify-center relative">
        
        {/* Background Cards Effect */}
        <div className="absolute w-[400px] h-[250px] bg-white rounded-xl shadow-md rotate-6 opacity-40"></div>
        <div className="absolute w-[400px] h-[250px] bg-white rounded-xl shadow-md -rotate-6 opacity-40"></div>

        {/* Main Card */}
        <div className="w-[420px] h-[260px] bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
          
          <div className="text-xl font-semibold text-gray-800">
            You’re almost there!
          </div>
          <p className="text-gray-500 mt-2">
            Now let’s get you signed in
          </p>
        </div>
      </div>
    </div>
  );
}