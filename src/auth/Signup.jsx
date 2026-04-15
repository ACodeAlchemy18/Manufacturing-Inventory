import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [gst, setGst] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  // OTP states
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [generatedEmailOtp, setGeneratedEmailOtp] = useState("");
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // NEW: control visibility
  const [showEmailOtpField, setShowEmailOtpField] = useState(false);
  const [showPhoneOtpField, setShowPhoneOtpField] = useState(false);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

  const sendEmailOtp = () => {
    if (!email) return alert("Enter email first");
    const otp = generateOtp();
    setGeneratedEmailOtp(otp.toString());
    setShowEmailOtpField(true);
    alert("Email OTP: " + otp);
  };

  const sendPhoneOtp = () => {
    if (!phone) return alert("Enter phone number first");
    const otp = generateOtp();
    setGeneratedPhoneOtp(otp.toString());
    setShowPhoneOtpField(true);
    alert("Phone OTP: " + otp);
  };

  const verifyEmailOtp = () => {
    if (emailOtp === generatedEmailOtp) {
      setIsEmailVerified(true);
      alert("Email Verified ✅");
    } else {
      alert("Invalid Email OTP ❌");
    }
  };

  const verifyPhoneOtp = () => {
    if (phoneOtp === generatedPhoneOtp) {
      setIsPhoneVerified(true);
      alert("Phone Verified ✅");
    } else {
      alert("Invalid Phone OTP ❌");
    }
  };

  const handleSignup = () => {
    setError("");

    if (
      !name ||
      !email ||
      !companyName ||
      !industryType ||
      !address ||
      !phone ||
      !pinCode ||
      !state ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      return setError("All fields are required except GST Number");
    }

    if (!isEmailVerified || !isPhoneVerified) {
      return setError("Please verify Email and Phone using OTP");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const user = {
      name,
      email,
      companyName,
      industryType,
      address,
      phone,
      pinCode,
      state,
      city,
      gst,
      password,
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f6f5f2]">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center px-20 py-10">

        <h2 className="text-4xl font-bold mb-8 text-gray-900">
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
        <div className="flex gap-3 mb-4">
          <input
            type="email"
            placeholder="Your business email"
            className="flex-1 px-4 py-3 border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendEmailOtp}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send OTP
          </button>
        </div>

        {/* Email OTP (conditional) */}
        {showEmailOtpField && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter Email OTP"
              className="flex-1 px-4 py-3 border rounded-md"
              onChange={(e) => setEmailOtp(e.target.value)}
            />
            <button
              onClick={verifyEmailOtp}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Verify
            </button>
          </div>
        )}

        {/* Company + Industry */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Company Name"
            className="w-1/2 px-4 py-3 border rounded-md"
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Industry Type"
            className="w-1/2 px-4 py-3 border rounded-md"
            onChange={(e) => setIndustryType(e.target.value)}
          />
        </div>

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          className="w-full mb-4 px-4 py-3 border rounded-md"
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Phone */}
        <div className="flex gap-3 mb-4">
          <input
            type="tel"
            placeholder="Phone Number"
            className="flex-1 px-4 py-3 border rounded-md"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={sendPhoneOtp}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send OTP
          </button>
        </div>

        {/* Phone OTP */}
        {showPhoneOtpField && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter Phone OTP"
              className="flex-1 px-4 py-3 border rounded-md"
              onChange={(e) => setPhoneOtp(e.target.value)}
            />
            <button
              onClick={verifyPhoneOtp}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Verify
            </button>
          </div>
        )}

        {/* Pin */}
        <input
          type="text"
          placeholder="Pin Code"
          className="w-full mb-4 px-4 py-3 border rounded-md"
          onChange={(e) => setPinCode(e.target.value)}
        />

        {/* State + City */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="State"
            className="w-1/2 px-4 py-3 border rounded-md"
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            className="w-1/2 px-4 py-3 border rounded-md"
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* GST */}
        <input
          type="text"
          placeholder="GST Number (Optional)"
          className="w-full mb-4 px-4 py-3 border rounded-md"
          onChange={(e) => setGst(e.target.value)}
        />

        {/* Password */}
        <div className="flex gap-4 mb-4">
          <div className="relative w-1/2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="relative w-1/2">
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
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleSignup}
          className="bg-lime-400 hover:bg-lime-500 text-black font-medium py-3 rounded-md w-48"
        >
          Create Account
        </button>

        <p className="mt-5 text-sm text-gray-600">
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
      <div className="w-1/2 flex items-center justify-center">

        <div className="w-[500px] h-[350px] bg-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center">

          <img
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="signup"
            className="w-28 mb-5"
          />

          <div className="text-2xl font-semibold text-gray-800">
            Join us today!
          </div>

          <p className="text-gray-500 mt-3 text-center">
            Create your account and start managing your business smoothly
          </p>

        </div>
      </div>
    </div>
  );
}