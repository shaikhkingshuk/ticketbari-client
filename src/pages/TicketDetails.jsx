import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import useTheme from "../hooks/useTheme";

export const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

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
    <div className={`${theme === "dark" ? "dark" : ""} max-w-4xl  mx-auto p-6`}>
      {/* Ticket Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-zinc-500 shadow-lg overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-72 object-cover"
        />

        <div className="p-6 space-y-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {ticket.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {ticket.from} → {ticket.to}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Departure: {departureTime.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white font-medium">
              Transport: {ticket.transportType}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-800 dark:text-white font-medium">
              Price: ৳{ticket.price}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-white font-medium">
              Available: {ticket.quantity}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-2">
            <strong>Perks:</strong>{" "}
            {Array.isArray(ticket.perks) && ticket.perks.length > 0
              ? ticket.perks
                  .map((p) => (typeof p === "string" ? p : p.name))
                  .join(", ")
              : "No perks"}
          </p>

          <button
            disabled={disableBook}
            onClick={() => setShowModal(true)}
            className="mt-4 w-full btn btn-primary disabled:opacity-50"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* BOOK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Book Ticket
            </h3>

            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={bookQty}
              onChange={(e) => setBookQty(Number(e.target.value))}
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
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
