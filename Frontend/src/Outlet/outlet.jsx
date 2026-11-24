import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/sideBar.jsx";

export default function Outlets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
