import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const MyAddedTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/tickets/vendor/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load tickets");
        setLoading(false);
      });
  }, [user?.email]);

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this ticket?",
    );
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/tickets/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Ticket deleted");
        setTickets(tickets.filter((t) => t._id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading tickets...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">My Added Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">No tickets added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden bg-white"
            >
              {/* IMAGE */}
              <img
                src={ticket.image}
                alt={ticket.title}
                className="h-44 w-full object-cover"
              />
              {console.log(ticket)}

              {/* CONTENT */}
              <div className="p-4 flex flex-col grow">
                <h3 className="text-lg font-semibold mb-1">{ticket.title}</h3>

                <p className="text-sm text-gray-600 mb-1">
                  {ticket.from} → {ticket.to}
                </p>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>Transport: {ticket.transportType}</p>
                  <p>Price: ৳{ticket.price}</p>
                  <p>Quantity: {ticket.quantity}</p>
                  <p>
                    Departure:{" "}
                    {new Date(ticket.departureDateTime).toLocaleString()}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`mt-3 self-start px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                    ticket.verificationStatus,
                  )}`}
                >
                  {ticket.verificationStatus.toUpperCase()}
                </span>

                {/* ACTIONS */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    disabled={ticket.verificationStatus === "rejected"}
                    className="btn btn-sm btn-outline disabled:opacity-50"
                  >
                    Update
                  </button>

                  <button
                    disabled={ticket.verificationStatus === "rejected"}
                    onClick={() => handleDelete(ticket._id)}
                    className="btn btn-sm btn-error disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
