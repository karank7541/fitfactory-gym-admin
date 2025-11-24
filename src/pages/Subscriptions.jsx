import React, { useEffect, useState } from "react";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  // ===============================
  // FETCH SUBSCRIPTIONS FROM BACKEND
  // ===============================
  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("https://fitfactory-backend1.onrender.com/api/admin/subscriptions", {
        headers: {
          Authorization: adminToken,
        },
      });

      const data = await res.json();

      setSubscriptions(data);
      setLoading(false);
    } catch (error) {
      console.error("Subscription load error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // ===============================
  // STATUS BADGE COMPONENT
  // ===============================
  const StatusBadge = ({ status }) => {
    if (status === "active") {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          Active
        </span>
      );
    }
    if (status === "expired") {
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
          Expired
        </span>
      );
    }
    return (
      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
        Not Subscribed
      </span>
    );
  };

  if (loading)
    return (
      <div className="pt-24 text-center text-xl">Loading subscriptions...</div>
    );

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-16 md:ml-64 min-h-screen bg-gray-100">

      <h2 className="text-3xl font-bold mb-6">Subscription Manager 📅</h2>

      {/* ───────── DESKTOP VERSION ───────── */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg overflow-x-auto">

        <table className="w-full border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">Expiry Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id} className="border-b hover:bg-gray-100 transition">

                <td className="p-3">{sub.name}</td>
                <td className="p-3">{sub.email}</td>
                <td className="p-3">{sub.plan}</td>
                <td className="p-3">{sub.startDate}</td>
                <td className="p-3">{sub.expiryDate}</td>

                <td className="p-3">
                  <StatusBadge status={sub.status} />
                </td>

                <td className="p-3">
                  <button
                    onClick={() => (window.location.href = `/client/${sub._id}`)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Manage
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ───────── MOBILE VERSION (Cards) ───────── */}
      <div className="md:hidden space-y-5 mt-6">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="bg-white p-5 rounded-xl shadow border">

            <h3 className="text-xl font-bold">{sub.name}</h3>
            <p>{sub.email}</p>

            <p className="mt-3"><strong>Plan:</strong> {sub.plan}</p>
            <p><strong>Start:</strong> {sub.startDate}</p>
            <p><strong>Expiry:</strong> {sub.expiryDate}</p>

            <div className="mt-2">
              <StatusBadge status={sub.status} />
            </div>

            <button
              onClick={() => (window.location.href = `/client/${sub._id}`)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Manage
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Subscriptions;