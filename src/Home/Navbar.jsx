import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuth(!!auth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#f5f3ee] px-12 py-6 flex items-center justify-between">
      
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold tracking-wide text-black cursor-pointer"
      >
        Manufacto
      </h1>

      {/* Center Menu */}
      <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
        <span className="hover:text-black cursor-pointer">Features</span>
        <span className="hover:text-black cursor-pointer">Use cases</span>
        <span className="hover:text-black cursor-pointer">Resources</span>
        <span className="hover:text-black cursor-pointer">Pricing</span>
      </div>

      {/* Right Buttons */}
      <div className="hidden md:flex items-center space-x-4">

        {/* If NOT Logged In */}
        {!isAuth ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-black"
            >
              Log in
            </button>

            <button className="border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition">
              Get a demo
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-lime-400 px-5 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Get started free
            </button>
          </>
        ) : (
          <>
            {/* After Login */}
            <button
              onClick={() => navigate("/inventory")}
              className="bg-lime-400 px-5 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}