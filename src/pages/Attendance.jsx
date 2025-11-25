import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  // Fetch attendance from backend
  const fetchAttendance = async () => {
    try {
      const res = await fetch("https://fitfactory-backend1-production.up.railway.app/api/admin/attendance", {
        headers: {
          Authorization: adminToken,
        },
      });

      if (!res.ok) {
        setError("Failed to load attendance logs");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAttendance(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Server Error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ---------------------------------------------------------
  // DATE PARSER — "24 Nov 2025, 11:23 AM" → JS Date object
  // ---------------------------------------------------------
  const parseEntryDate = (entryStr) => {
    const [dateStr] = entryStr.split(","); // "24 Nov 2025"

    const parts = dateStr.trim().split(" "); // ["24", "Nov", "2025"]
    const day = parseInt(parts[0]);
    const monthName = parts[1];
    const year = parseInt(parts[2]);

    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    return new Date(year, monthMap[monthName], day);
  };

  // ---------------------------------------------------------
  // TODAY COUNT
  // ---------------------------------------------------------
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const todayCount = attendance.filter((log) => {
    const d = parseEntryDate(log.entry);
    return (
      d.getDate() === todayDay &&
      d.getMonth() === todayMonth &&
      d.getFullYear() === todayYear
    );
  }).length;

  // TOTAL COUNT
  const totalCount = attendance.length;

  // ---------------------------------------------------------
  // WEEKLY COUNT — last 7 days
  // ---------------------------------------------------------
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyCount = attendance.filter((log) => {
    const d = parseEntryDate(log.entry);
    return d >= oneWeekAgo;
  }).length;

  // Loading UI
  if (loading)
    return (
      <div className="pt-24 text-center text-xl">Loading attendance...</div>
    );

  // Error UI
  if (error)
    return <div className="pt-24 text-center text-red-600 text-xl">{error}</div>;

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-16 md:ml-64 min-h-screen bg-gray-100">

      <h2 className="text-3xl font-bold mb-6">Attendance Logs 📅</h2>

      {/* ───────── STATS ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold text-blue-600">Today</h3>
          <p className="text-gray-600 mt-2">QR Scans</p>
          <p className="text-4xl font-bold mt-3">{todayCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold text-green-600">This Week</h3>
          <p className="text-gray-600 mt-2">Total Entries</p>
          <p className="text-4xl font-bold mt-3">{weeklyCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold text-purple-600">Total</h3>
          <p className="text-gray-600 mt-2">All-time Attendance</p>
          <p className="text-4xl font-bold mt-3">{totalCount}</p>
        </div>

      </div>

      {/* ───────── DESKTOP TABLE ───────── */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((log, index) => {
              const [date, time] = log.entry.split(",");

              return (
                <tr key={index} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3">{log.name}</td>
                  <td className="p-3">{log.email}</td>
                  <td className="p-3">{date}</td>
                  <td className="p-3">{time.trim()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ───────── MOBILE CARD VIEW ───────── */}
      <div className="md:hidden space-y-5 mt-6">
        {attendance.map((log, index) => {
          const [date, time] = log.entry.split(",");

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="text-xl font-bold">{log.name}</h3>
              <p className="text-gray-700">{log.email}</p>

              <p className="mt-3"><strong>Date:</strong> {date}</p>
              <p><strong>Time:</strong> {time.trim()}</p>

              <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Present
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Attendance;