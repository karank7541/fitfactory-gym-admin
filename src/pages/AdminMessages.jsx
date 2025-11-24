import React, { useEffect, useState } from "react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/admin/messages", {
        headers: {
          Authorization: adminToken,
        },
      });

      if (!res.ok) {
        setError("Failed to load messages");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Server Error");
      setLoading(false);
    }
  };

  // Delete a message
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/messages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: adminToken,
          },
        }
      );

      if (!res.ok) {
        alert("Delete failed!");
        return;
      }

      alert("Message deleted!");
      setMessages(messages.filter((m) => m._id !== id)); // Remove from UI instantly
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Loading UI
  if (loading)
    return (
      <div className="pt-24 text-center text-xl">Loading messages...</div>
    );

  // Error UI
  if (error)
    return <div className="pt-24 text-center text-red-600 text-xl">{error}</div>;

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-16 md:ml-64 bg-gray-100 min-h-screen w-full">
      <h2 className="text-3xl font-bold mb-6">Contact Messages 📩</h2>

      {/* ───────── DESKTOP TABLE ───────── */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((m) => (
              <tr
                key={m._id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.message}</td>

                <td className="p-3">
                  {new Date(m.createdAt).toLocaleString()}
                </td>

                <td className="p-3">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => deleteMessage(m._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ───────── MOBILE CARD VIEW ───────── */}
      <div className="md:hidden space-y-5">
        {messages.map((m) => (
          <div
            key={m._id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <h3 className="text-xl font-bold">{m.name}</h3>
            <p className="text-gray-700">{m.email}</p>

            <p className="mt-3">
              <strong>Message:</strong> {m.message}
            </p>

            <p className="mt-2 text-gray-600">
              {new Date(m.createdAt).toLocaleString()}
            </p>

            <button
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => deleteMessage(m._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;