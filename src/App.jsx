import { Routes, Route, Navigate } from "react-router-dom";

// Components
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";

// Admin Pages
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Clients from "./pages/Clients.jsx";
import ClientDetails from "./pages/ClientDetails.jsx";
import Attendance from "./pages/Attendance.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import AdminMessages from "./pages/AdminMessages.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";   // ⭐ NEW IMPORT

function App() {
  return (
    <>
      <Routes>

        {/* Redirect root to admin login */}
        <Route path="/" element={<Navigate to="/admin-login" replace />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <AdminDashboard />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* Clients */}
        <Route
          path="/admin/clients"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <Clients />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* Single Client */}
        <Route
          path="/client/:id"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <ClientDetails />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* Attendance Logs */}
        <Route
          path="/admin/attendance"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <Attendance />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* Subscriptions */}
        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <Subscriptions />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* Messages */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <AdminMessages />
              </div>
            </ProtectedAdminRoute>
          }
        />

        {/* ⭐ NEW FEEDBACK PAGE */}
        <Route
          path="/admin/feedback"
          element={
            <ProtectedAdminRoute>
              <div className="flex">
                <AdminSidebar />
                <AdminFeedback />
              </div>
            </ProtectedAdminRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;