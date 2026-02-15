import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";

export const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.email) return;

    // Fetch user data from backend
    fetch(`https://ticketbari-server.onrender.com/users/${user.email}`, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) {
    return <div className="p-5">Loading user info...</div>;
  }

  if (!userData) {
    return <div className="p-5 text-red-500">User data not found!</div>;
  }

  return (
    <div
      className={`p-6 max-w-md mx-auto bg-white dark:bg-zinc-700 shadow-md rounded-md mt-10 ${theme === "dark" ? "dark" : ""}`}
    >
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={userData.photoURL || "https://i.ibb.co/ZxQJk0K/user.png"}
          alt={userData.name || "User"}
          className="w-24 h-24 rounded-full mb-2"
        />
        <h3 className="text-xl font-semibold">{userData.name}</h3>
        <p className="text-gray-500">{userData.role}</p>
      </div>

      <div className="space-y-2">
        <div>
          <strong>Email:</strong> {userData.email}
        </div>
        <div>
          <strong>Role:</strong> {userData.role}
        </div>
      </div>
    </div>
  );
};
