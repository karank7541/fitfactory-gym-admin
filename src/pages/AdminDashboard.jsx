import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import managerPic from "../assets/manager.jpg";

const AdminDashboard = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    activePlans: 0
  });

  const [loading, setLoading] = useState(true);
  const adminToken = localStorage.getItem("adminToken");

  // ===============================
  // FETCH DASHBOARD STATS (WITHOUT ATTENDANCE)
  // ===============================
  const fetchStats = async () => {
    try {
      // 1️⃣ Fetch Clients
      const clientsRes = await fetch("http://localhost:5001/api/admin/users", {
        headers: { Authorization: adminToken },
      });
      const clients = await clientsRes.json();

      // 2️⃣ Fetch Active Subscriptions
      const subRes = await fetch("http://localhost:5001/api/admin/subscriptions", {
        headers: { Authorization: adminToken },
      });
      const subs = await subRes.json();

      setStats({
        totalClients: clients.length,
        activePlans: subs.filter((u) => u.status === "active").length
      });

      setLoading(false);
    } catch (error) {
      console.error("Dashboard load error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="pt-24 text-center text-xl">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex">

      {/* Sidebar */}
      <AdminSidebar
        open={openSidebar}
        closeSidebar={() => setOpenSidebar(false)}
      />

      {/* Main */}
      <div className="flex-1 md:ml-64 pt-24 px-3 sm:px-6 md:px-10 min-h-screen bg-gray-100 w-full">

        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden fixed top-5 left-5 bg-blue-600 text-white p-2 rounded-lg shadow-lg z-40"
          onClick={() => setOpenSidebar(true)}
        >
          ☰
        </button>

        {/* Welcome */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center mb-10 w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome Manager of FitFactory 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your gym & membership system
          </p>

          <div className="flex justify-center mt-6">
            <img
              src={managerPic}
              alt="Manager"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-600 shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Dashboard Stats (Attendance removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">

          {/* Total Clients */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-bold text-blue-600">Clients</h3>
            <p className="text-gray-600 mt-1">Total registered members</p>
            <p className="text-4xl font-bold mt-3">
              {stats.totalClients}
            </p>
          </div>

          {/* Active Plans */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer">
            <h3 className="text-2xl font-bold text-purple-600">Active Plans</h3>
            <p className="text-gray-600 mt-1">Memberships currently active</p>
            <p className="text-4xl font-bold mt-3">
              {stats.activePlans}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;