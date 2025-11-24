import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ open, closeSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-50 
      transform ${open ? "translate-x-0" : "-translate-x-64"} 
      transition-transform duration-300 md:translate-x-0`}
    >
      <h2 className="text-2xl font-bold mb-10 text-blue-600">
        FitFactory Admin
      </h2>

      <ul className="space-y-6 text-lg">

        <li>
          <Link
            to="/admin/dashboard"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/admin/clients"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Clients
          </Link>
        </li>

        <li>
          <Link
            to="/admin/attendance"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Attendance Logs
          </Link>
        </li>

        <li>
          <Link
            to="/admin/subscriptions"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Subscription Manager
          </Link>
        </li>

        <li>
          <Link
            to="/admin/messages"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Messages
          </Link>
        </li>

        {/* ⭐ NEW — Feedback Section */}
        <li>
          <Link
            to="/admin/feedback"
            className="hover:text-blue-600"
            onClick={closeSidebar}
          >
            Feedback
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default AdminSidebar;