import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import AppRoutes from "./inventory/routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;