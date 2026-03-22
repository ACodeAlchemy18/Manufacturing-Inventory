import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const handleSignup = () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Save user in localStorage
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="h-screen w-full flex bg-[#f6f5f2]">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center px-20">

    
        <h2 className="text-5xl font-bold mb-10 text-gray-900">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Your name"
          className="w-full mb-4 px-4 py-3 border rounded-md"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Your business email"
          className="w-full mb-4 px-4 py-3 border rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border rounded-md"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Button */}
        <button
          onClick={handleSignup}
          className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-md w-48"
        >
          Create Account
        </button>

        {/* Login Link */}
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center relative">

        <div className="absolute w-[400px] h-[250px] bg-white rounded-xl shadow-md rotate-6 opacity-40"></div>
        <div className="absolute w-[400px] h-[250px] bg-white rounded-xl shadow-md -rotate-6 opacity-40"></div>

        <div className="w-[420px] h-[260px] bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
          <div className="text-xl font-semibold text-gray-800">
            Join us today!
          </div>
          <p className="text-gray-500 mt-2">
            Create your account to get started
          </p>
        </div>
      </div>
    </div>
  );
}