import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const VendorProfile = () => {
  const { user } = useContext(AuthContext);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    // Fetch vendor data from backend
    fetch(`http://localhost:3000/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setVendorData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch vendor data:", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) {
    return <div className="p-5">Loading vendor info...</div>;
  }

  if (!vendorData) {
    return <div className="p-5 text-red-500">Vendor data not found!</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Vendor Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={vendorData.photoURL || "https://i.ibb.co/ZxQJk0K/user.png"}
          alt={vendorData.name || "Vendor"}
          className="w-24 h-24 rounded-full mb-2"
        />
        <h3 className="text-xl font-semibold">{vendorData.name}</h3>
        <p className="text-gray-500">{vendorData.role}</p>
      </div>

      <div className="space-y-2">
        <div>
          <strong>Email:</strong> {vendorData.email}
        </div>
        <div>
          <strong>Role:</strong> {vendorData.role}
        </div>
        {/* Add more fields if needed */}
      </div>
    </div>
  );
};
