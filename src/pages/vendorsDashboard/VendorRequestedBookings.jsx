import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const VendorRequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    fetch(
      `https://ticketbari-server.onrender.com/vendor/bookings?email=${user.email}`,
    )
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error("Failed to load bookings"));
  }, [user]);

  const handleAction = async (id, action) => {
    const res = await fetch(
      `https://ticketbari-server.onrender.com/bookings/${action}/${id}`,
      {
        method: "PATCH",
      },
    );

    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id
            ? { ...b, status: action === "accept" ? "accepted" : "rejected" }
            : b,
        ),
      );
      toast.success(`Booking ${action}ed`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-6">Requested Bookings</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Ticket</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>
                  <p className="font-medium">{b.userName}</p>
                  <p className="text-sm text-gray-500">{b.userEmail}</p>
                </td>

                <td>{b.title}</td>

                <td>{b.bookedQuantity}</td>

                <td>৳ {b.price * b.bookedQuantity}</td>

                <td>
                  <span
                    className={`badge ${
                      b.status === "pending"
                        ? "badge-warning"
                        : b.status === "accepted"
                          ? "badge-success"
                          : "badge-error"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    disabled={b.status !== "pending"}
                    onClick={() => handleAction(b._id, "accept")}
                    className="btn btn-sm btn-success"
                  >
                    Accept
                  </button>

                  <button
                    disabled={b.status !== "pending"}
                    onClick={() => handleAction(b._id, "reject")}
                    className="btn btn-sm btn-error"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No booking requests found
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorRequestedBookings;
