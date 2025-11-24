import React, { useEffect, useState } from "react";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  // Fetch users from backend
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: adminToken,
        },
      });

      if (!res.ok) {
        setError("Failed to load clients");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setClients(data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Server error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Status badge
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

  // Loading UI
  if (loading) {
    return (
      <div className="pt-24 text-center text-xl">
        Loading clients...
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="pt-24 text-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-16 md:ml-64 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Clients List 👥</h2>

      {/* ───────── DESKTOP TABLE ───────── */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.plan}</td>

                <td className="p-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="p-3">{c.startDate || "-"}</td>

                <td className="p-3">
                  <button
                    onClick={() => (window.location.href = `/client/${c._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ───────── MOBILE CARD VIEW ───────── */}
      <div className="md:hidden space-y-5 mt-6">
        {clients.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <h3 className="text-xl font-bold">{c.name}</h3>
            <p className="text-gray-700">{c.email}</p>
            <p className="text-gray-700">{c.phone}</p>

            <p className="mt-3"><strong>Plan:</strong> {c.plan}</p>
            <p><strong>Joined:</strong> {c.startDate || "-"}</p>

            <div className="mt-2">
              <StatusBadge status={c.status} />
            </div>

            <button
              onClick={() => (window.location.href = `/client/${c._id}`)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Clients;