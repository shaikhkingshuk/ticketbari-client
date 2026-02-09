import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useParams } from "react-router";

export const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [bookQty, setBookQty] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => setTicket(data));
  }, [id]);

  if (!ticket) return null;

  const departureTime = new Date(ticket.departureDateTime);
  const now = new Date();
  const isExpired = departureTime <= now;
  const disableBook = isExpired || ticket.quantity === 0;

  const handleBooking = async () => {
    if (bookQty > ticket.quantity) {
      return toast.error("Booking quantity exceeds available tickets");
    }

    const bookingData = {
      ticketId: ticket._id,
      title: ticket.title,
      price: ticket.price,
      bookedQuantity: bookQty,
      userEmail: user.email,
      userName: user.displayName,
    };

    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      toast.success("Booking successful");
      setTicket((prev) => ({
        ...prev,
        quantity: prev.quantity - bookQty,
      }));
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={ticket.image} className="w-full h-72 object-cover rounded" />

      <div className="mt-6 space-y-2">
        <h2 className="text-3xl font-bold">{ticket.title}</h2>
        <p>
          {ticket.from} → {ticket.to}
        </p>
        <p>Transport: {ticket.transportType}</p>
        <p>Price: ৳{ticket.price}</p>
        <p>Available: {ticket.quantity}</p>
        <p>
          Perks:{" "}
          {Array.isArray(ticket.perks) && ticket.perks.length > 0
            ? ticket.perks
                .map((p) => (typeof p === "string" ? p : p.name))
                .join(", ")
            : "No perks"}
        </p>
        <p>Departure: {departureTime.toLocaleString()}</p>

        <button
          disabled={disableBook}
          onClick={() => setShowModal(true)}
          className="btn btn-primary mt-4 disabled:opacity-50"
        >
          Book Now
        </button>
      </div>

      {/* BOOK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-semibold mb-4">Book Ticket</h3>

            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={bookQty}
              onChange={(e) => setBookQty(Number(e.target.value))}
              className="input input-bordered w-full"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleBooking}
                className="btn btn-primary flex-1"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
