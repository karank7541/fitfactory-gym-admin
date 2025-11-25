import React, { useEffect, useState } from "react";

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  const fetchFeedback = async () => {
    const res = await fetch("https://fitfactory-backend1-production.up.railway.app/api/admin/feedback", {
      headers: { Authorization: adminToken },
    });

    const data = await res.json();
    setFeedbackList(data);
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    await fetch(`https://fitfactory-backend1-production.up.railway.app/api/admin/feedback/${id}`, {
      method: "DELETE",
      headers: { Authorization: adminToken },
    });

    setFeedbackList(feedbackList.filter((f) => f._id !== id));
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="pt-24 px-6 md:ml-64 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Feedback 💬</h1>

      {feedbackList.length === 0 && (
        <p className="text-center text-gray-600">No feedback yet.</p>
      )}

      <div className="space-y-4">
        {feedbackList.map((f) => (
          <div
            key={f._id}
            className="bg-white p-5 rounded-xl shadow border flex justify-between"
          >
            <div>
              <h2 className="text-xl font-bold">{f.name}</h2>
              <p className="text-gray-600">Rating: ⭐ {f.rating}</p>
              <p className="mt-2">{f.feedback}</p>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(f.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteFeedback(f._id)}
              className="text-red-600 text-lg"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeedback;