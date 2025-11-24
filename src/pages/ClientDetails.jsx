import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    plan: "",
    duration: 30,
    startDate: "",
  });

  const adminToken = localStorage.getItem("adminToken");

  // Fetch user details
  const fetchClient = async () => {
    try {
      const res = await fetch(`https://fitfactory-backend1.onrender.com/api/admin/user/${id}`, {
        headers: { Authorization: adminToken },
      });

      if (!res.ok) {
        setError("Could not load client data");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setClient(data);

      setEditData({
        plan: data.plan,
        duration: 30,
        startDate: data.startDate !== "-" ? data.startDate.substring(0, 10) : "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Server error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  // UPDATE subscription info
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      plan: editData.plan,
      duration: editData.duration,
      startDate: editData.startDate,
    };

    try {
      const res = await fetch(
        `https://fitfactory-backend1.onrender.com/api/admin/update-plan/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: adminToken,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Subscription Updated!");
      setEditOpen(false);
      fetchClient();
    } catch (error) {
      alert("Server Error");
      console.log(error);
    }
  };

  // DELETE USER
  const deleteUser = async () => {
    if (!window.confirm("Delete this client?")) return;

    try {
      const res = await fetch(
        `https://fitfactory-backend1.onrender.com/api/admin/delete-user/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: adminToken },
        }
      );

      if (!res.ok) {
        alert("Delete failed!");
        return;
      }

      alert("Client deleted.");
      window.location.href = "/admin/clients";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading) return <div className="pt-24 text-xl text-center">Loading...</div>;
  if (error) return <div className="pt-24 text-red-600 text-xl text-center">{error}</div>;
  if (!client) return null;

  const StatusBadge = ({ status }) => {
    if (status === "active")
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Active</span>;
    if (status === "expired")
      return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">Expired</span>;
    return <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Not Subscribed</span>;
  };

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-16 md:ml-64 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Client Details 📄</h2>

      <div className="bg-white p-6 rounded-2xl shadow-xl">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-28 h-28 rounded-full bg-gray-200 text-4xl flex items-center justify-center border-4 border-blue-500 shadow-lg">
            {client.name.charAt(0)}
          </div>

          <div className="mt-6 md:mt-0 md:ml-6 text-center md:text-left">
            <h3 className="text-3xl font-bold">{client.name}</h3>
            <p>{client.email}</p>
            <p>{client.phone}</p>
            <div className="mt-3">
              <StatusBadge status={client.status} />
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-gray-50 p-5 rounded-xl shadow">
            <h4 className="text-xl font-semibold mb-2">Subscription Info</h4>
            <p><strong>Plan:</strong> {client.plan}</p>
            <p><strong>Start:</strong> {client.startDate || "-"}</p>
            <p><strong>Expiry:</strong> {client.expiryDate || "-"}</p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl shadow">
            <h4 className="text-xl font-semibold mb-2">Recent Attendance</h4>
            <ul className="list-disc ml-5">
              {(client.attendance || []).slice(-5).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setEditOpen(true)} className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600">
            Edit Client
          </button>

          <button onClick={() => setEditOpen(true)} className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Assign Plan
          </button>

          <button onClick={() => setEditOpen(true)} className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Extend Subscription
          </button>

          <button onClick={deleteUser} className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
            Delete Client
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
          onClick={() => setEditOpen(false)}
        >
          <div className="bg-white p-6 rounded-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Update Subscription</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              {/* PLAN DROPDOWN */}
              <select
                value={editData.plan}
                onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
                className="w-full border p-3 rounded-lg"
              >
                <option value="None">No Plan</option>
                <option value="Basic (1 Month)">Basic (1 Month)</option>
                <option value="Basic (3 Months)">Basic (3 Months)</option>
                <option value="Premium (1 Month)">Premium (1 Month)</option>
                <option value="Premium (3 Months)">Premium (3 Months)</option>
              </select>

              {/* START DATE CALENDAR */}
              <input
                type="date"
                value={editData.startDate}
                onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              {/* SUBSCRIPTION DURATION */}
              <select
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                className="w-full border p-3 rounded-lg"
              >
                <option value="30">1 Month (30 days)</option>
                <option value="90">3 Months (90 days)</option>
                <option value="180">6 Months (180 days)</option>
                <option value="365">1 Year (365 days)</option>
              </select>

              <div className="flex justify-between mt-4">
                <button type="button" className="px-6 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setEditOpen(false)}>
                  Cancel
                </button>

                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;