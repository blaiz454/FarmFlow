import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import CropManagement from "./pages/CropManagement";
import LivestockManagement from "./pages/LivestockManagement";
import FarmTasks from "./pages/FarmTasks";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Livestock from "./pages/Livestock";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* ---- Public, indexable marketing site ---- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/crop-management" element={<CropManagement />} />
        <Route path="/livestock-management" element={<LivestockManagement />} />
        <Route path="/farm-tasks" element={<FarmTasks />} />
        <Route path="/contact" element={<Contact />} />
        {/* Login lives outside the app shell but still gets header/footer chrome */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---- Private application, noindex + auth-gated ---- */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/livestock" element={<Livestock />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
