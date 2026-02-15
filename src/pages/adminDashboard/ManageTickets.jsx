import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch("https://ticketbari-server.onrender.com/admin/tickets", {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);

  const handleStatusChange = (id, status) => {
    fetch(`https://ticketbari-server.onrender.com/admin/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(`Ticket ${status}`);
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === id
              ? { ...ticket, verificationStatus: status }
              : ticket,
          ),
        );
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Tickets</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Route</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td>
                  {ticket.from} → {ticket.to}
                </td>
                <td>{ticket.vendorName}</td>
                <td>{ticket.price} ৳</td>

                <td>
                  <span
                    className={`badge ${
                      ticket.verificationStatus === "approved"
                        ? "badge-success"
                        : ticket.verificationStatus === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                    }`}
                  >
                    {ticket.verificationStatus}
                  </span>
                </td>

                <td className="flex gap-2">
                  <button
                    disabled={ticket.verificationStatus === "approved"}
                    onClick={() => handleStatusChange(ticket._id, "approved")}
                    className="btn btn-xs btn-success"
                  >
                    Approve
                  </button>

                  <button
                    disabled={ticket.verificationStatus === "rejected"}
                    onClick={() => handleStatusChange(ticket._id, "rejected")}
                    className="btn btn-xs btn-error"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
