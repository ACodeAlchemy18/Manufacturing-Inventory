import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./Home/Home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";

// Inventory (Protected)
import AppRoutes from "./inventory/routes/AppRoutes";

// 🔐 Protected Route Component
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("auth");

  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* 🔒 Protected Inventory Routes */}
        <Route
          path="/inventory/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;