import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";

export const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://ticketbari-server.onrender.com/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setAdminData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch admin data:", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) {
    return <div className="p-5">Loading admin info...</div>;
  }

  if (!adminData) {
    return <div className="p-5 text-red-500">Admin data not found!</div>;
  }

  return (
    <div
      className={`p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md mt-10 ${theme === "dark" ? "dark" : ""}`}
    >
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={adminData.photoURL || "https://i.ibb.co/ZxQJk0K/user.png"}
          alt={adminData.name || "Admin"}
          className="w-24 h-24 rounded-full mb-2"
        />
        <h3 className="text-xl font-semibold">{adminData.name}</h3>
        <p className="text-gray-500 capitalize">{adminData.role}</p>
      </div>

      <div className="space-y-2">
        <div>
          <strong>Email:</strong> {adminData.email}
        </div>
        <div>
          <strong>Role:</strong> {adminData.role}
        </div>
        {/* UID intentionally NOT shown */}
      </div>
    </div>
  );
};
