import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useTheme from "../../hooks/useTheme";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const MyBookedTickets = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [payBooking, setPayBooking] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.email) return;

    fetch(
      `https://ticketbari-server-1.onrender.com/bookedTickets/user/${user.email}`,
      {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error("Failed to load bookings"));
  }, [user]);

  const isExpired = (date) => new Date(date) < new Date();

  const handleCheckout = async (booking) => {
    const res = await fetch(
      "https://ticketbari-server-1.onrender.com/create-checkout-session",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          title: booking.title,
          price: booking.price,
          quantity: booking.bookedQuantity,
          ticketId: booking.ticketId,
        }),
      },
    );

    const data = await res.json();

    if (data.url) {
      window.location.assign(data.url);
    } else {
      toast.error("Failed to initiate payment");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  return (
    <div className={`max-w-7xl mx-auto p-6 ${theme === "dark" ? "dark" : ""}`}>
      <h2 className="text-3xl font-bold mb-8 text-center">My Booked Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookings.map((b) => {
          const ticket = b.ticket;
          const expired = isExpired(ticket.departureDateTime);

          return (
            //card start
            <div
              key={b._id}
              className="flex flex-col overflow-hidden rounded-xl 
  border border-zinc-300 dark:border-zinc-700
  bg-white dark:bg-zinc-900
  shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* IMAGE */}
              <img
                src={ticket.image}
                alt={b.title}
                className="h-48 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {b.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {ticket.from} → {ticket.to}
                </p>

                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                  <p>Quantity: {b.bookedQuantity}</p>
                  <p>Total Price: ৳ {b.price * b.bookedQuantity}</p>
                  <p>
                    Departure:{" "}
                    {new Date(ticket.departureDateTime).toLocaleString()}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`mt-3 self-start px-3 py-1 text-xs font-semibold rounded-full
        ${
          b.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : b.status === "accepted"
              ? "bg-green-100 text-green-700"
              : b.status === "paid"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
        }`}
                >
                  {b.status}
                </span>

                {/* COUNTDOWN */}
                {b.status !== "rejected" && !expired && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    <Countdown date={new Date(ticket.departureDateTime)} />
                  </div>
                )}

                {/* PAY NOW */}
                {b.status === "accepted" && !expired && (
                  <button
                    onClick={() => handleCheckout(b)}
                    className="btn btn-sm btn-primary w-full mt-4"
                  >
                    Pay Now
                  </button>
                )}

                {expired && (
                  <p className="text-red-500 text-sm mt-2">
                    Departure time passed
                  </p>
                )}
              </div>
            </div>

            //card end
          );
        })}
      </div>

      {/* PAYMENT MODAL */}
      {payBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                booking={payBooking}
                close={() => setPayBooking(null)}
                refresh={setBookings}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookedTickets;
