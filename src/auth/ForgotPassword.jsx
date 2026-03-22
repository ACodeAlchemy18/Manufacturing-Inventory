import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Verify Email
  const handleEmailCheck = () => {
    setError("");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!email) return setError("Email is required");

    if (!storedUser || storedUser.email !== email) {
      return setError("User not found");
    }

    setStep(2);
  };

  // Step 2: Reset Password
  const handleReset = () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...storedUser,
      password: newPassword,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setSuccess("Password reset successful!");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="h-screen w-full flex bg-[#f6f5f2]">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center px-20">

        <h2 className="text-5xl font-bold mb-10 text-gray-900">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mb-4 px-4 py-3 border rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleEmailCheck}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-md w-40"
            >
              Verify Email
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* New Password */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-4 py-3 border rounded-md"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
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
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              onClick={handleReset}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-md w-48"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Messages */}
        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mt-3">{success}</p>
        )}

        {/* Back to Login */}
        <p className="mt-6 text-sm text-gray-600">
          Remember password?{" "}
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
            Reset your password
          </div>
          <p className="text-gray-500 mt-2">
            Secure your account with a new password
          </p>
        </div>
      </div>
    </div>
  );
}