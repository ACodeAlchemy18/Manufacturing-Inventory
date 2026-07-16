import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuth(!!auth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("loggedInUser");
    setIsAuth(false);
    navigate("/login");
  };

  // Smooth scroll
  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  // Logged in user
  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#f5f3ee]/90 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold tracking-wide text-black cursor-pointer"
      >
        Manufacto
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
        <span
          onClick={() => scrollToSection("features")}
          className="hover:text-black cursor-pointer transition"
        >
          Features
        </span>

        <span
          onClick={() => scrollToSection("usecases")}
          className="hover:text-black cursor-pointer transition"
        >
          Use Cases
        </span>

        <span className="hover:text-black cursor-pointer transition">
          Resources
        </span>

        <span
          onClick={() => scrollToSection("pricing")}
          className="hover:text-black cursor-pointer transition"
        >
          Pricing
        </span>
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">

        {!isAuth ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-black transition"
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
            {/* Dashboard Button */}
            <button
              onClick={() => navigate("/inventory")}
              className="bg-lime-400 px-5 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Go to Dashboard
            </button>

            {/* Profile Dropdown */}
            <div className="relative">

              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-2xl shadow-sm"
              >
                <FaUserCircle />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold">
                      {user.name || "Admin"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email || "admin@gmail.com"}
                    </p>
                  </div>

                  {/* Profile */}
                  <button
                    onClick={() => {
                      navigate("/inventory/profile");
                      setShowProfile(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                  >
                    Profile
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-16 left-0 w-full bg-[#f5f3ee] px-6 py-6 shadow-md md:hidden"
          >
            <div className="flex flex-col space-y-5 text-gray-700 font-medium">

              <span
                onClick={() => scrollToSection("features")}
                className="cursor-pointer"
              >
                Features
              </span>

              <span
                onClick={() => scrollToSection("usecases")}
                className="cursor-pointer"
              >
                Use Cases
              </span>

              <span className="cursor-pointer">
                Resources
              </span>

              <span
                onClick={() => scrollToSection("pricing")}
                className="cursor-pointer"
              >
                Pricing
              </span>

              <div className="pt-4 border-t flex flex-col space-y-3">

                {!isAuth ? (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-left"
                    >
                      Log in
                    </button>

                    <button className="border border-black px-4 py-2 rounded-lg">
                      Get a demo
                    </button>

                    <button
                      onClick={() => navigate("/signup")}
                      className="bg-lime-400 px-4 py-2 rounded-lg font-semibold"
                    >
                      Get started free
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/inventory")}
                      className="bg-lime-400 px-4 py-2 rounded-lg font-semibold"
                    >
                      Go to Dashboard
                    </button>

                    <button
                      onClick={() => navigate("/inventory/profile")}
                      className="border border-black px-4 py-2 rounded-lg"
                    >
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}