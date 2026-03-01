import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";

export const VendorProfile = () => {
  const { user } = useContext(AuthContext);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", photoURL: "" });
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://ticketbari-server-1.onrender.com/users/${user.email}`, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVendorData(data);
        setForm({ name: data.name, photoURL: data.photoURL });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch vendor data:", err);
        setLoading(false);
      });
  }, [user?.email, user.accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://ticketbari-server-1.onrender.com/users/${user.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setVendorData(data.user);
        setEditMode(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <div className="p-5">Loading vendor info...</div>;
  if (!vendorData)
    return <div className="p-5 text-red-500">Vendor data not found!</div>;

  return (
    <div
      className={`p-6 max-w-md mx-auto bg-white dark:bg-zinc-700 shadow-md rounded-md mt-10 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Vendor Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={form.photoURL || "https://i.ibb.co/ZxQJk0K/user.png"}
          alt={form.name || "Vendor"}
          className="w-24 h-24 rounded-full mb-2"
        />

        {editMode ? (
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-1 rounded mb-2"
          />
        ) : (
          <h3 className="text-xl font-semibold">{vendorData.name}</h3>
        )}

        <p className="text-gray-500">{vendorData.role}</p>
      </div>

      {editMode && (
        <div className="mb-4">
          <label className="block mb-1">Profile Image URL:</label>
          <input
            type="text"
            name="photoURL"
            value={form.photoURL}
            onChange={handleChange}
            className="w-full border p-1 rounded"
          />
        </div>
      )}

      <div className="flex space-x-2">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {!editMode && (
        <div className="space-y-2 mt-4">
          <div>
            <strong>Email:</strong> {vendorData.email}
          </div>
          <div>
            <strong>Role:</strong> {vendorData.role}
          </div>
        </div>
      )}
    </div>
  );
};
