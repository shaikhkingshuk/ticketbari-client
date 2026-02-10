import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://ticketbari-server.onrender.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const updateRole = (id, role) => {
    fetch(`https://ticketbari-server.onrender.com/users/role/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(`Role updated to ${role}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u)),
        );
      });
  };

  const markFraud = (id) => {
    fetch(`https://ticketbari-server.onrender.com/users/fraud/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then(() => {
        toast.error("Vendor marked as fraud");
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role: "fraud", isFraud: true } : u,
          ),
        );
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className="badge badge-outline">{user.role}</span>
              </td>

              <td className="flex gap-2">
                <button
                  onClick={() => updateRole(user._id, "admin")}
                  className="btn btn-xs btn-info"
                >
                  Make Admin
                </button>

                <button
                  onClick={() => updateRole(user._id, "vendor")}
                  className="btn btn-xs btn-success"
                >
                  Make Vendor
                </button>

                {user.role === "vendor" && (
                  <button
                    onClick={() => markFraud(user._id)}
                    className="btn btn-xs btn-error"
                  >
                    Mark Fraud
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
