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
    if (!user?.email) return; // 🛑 wait for auth

    fetch(`http://localhost:3000/bookedTickets/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error("Failed to load bookings"));
  }, [user]);

  const isExpired = (date) => new Date(date) < new Date();

  const handleCheckout = async (booking) => {
    const res = await fetch("http://localhost:3000/create-checkout-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bookingId: booking._id,
        title: booking.title,
        price: booking.price,
        quantity: booking.bookedQuantity,
        ticketId: booking.ticketId,
      }),
    });

    const data = await res.json();

    // if (data.url) {
    //   window.location.href = data.url; // 🔥 Redirect to Stripe
    // } else {
    //   toast.error("Failed to initiate payment");
    // }

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
            <div
              key={b._id}
              className="border rounded-xl bg-white dark:bg-zinc-700 shadow"
            >
              <img
                src={ticket.image}
                className="h-44 w-full object-cover rounded-t-xl"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{b.title}</h3>

                <p className="text-sm">
                  {ticket.from} → {ticket.to}
                </p>

                <p>Quantity: {b.bookedQuantity}</p>
                <p>Total Price: ৳ {b.price * b.bookedQuantity}</p>

                <p className="text-sm">
                  Departure:{" "}
                  {new Date(ticket.departureDateTime).toLocaleString()}
                </p>

                {/* STATUS */}
                <span
                  className={`badge ${
                    b.status === "pending"
                      ? "badge-warning"
                      : b.status === "accepted"
                        ? "badge-success"
                        : b.status === "paid"
                          ? "badge-info"
                          : "badge-error"
                  }`}
                >
                  {b.status}
                </span>

                {/* COUNTDOWN */}
                {b.status !== "rejected" && !expired && (
                  <div className="text-sm text-blue-600">
                    <Countdown date={new Date(ticket.departureDateTime)} />
                  </div>
                )}

                {/* PAY NOW */}
                {b.status === "accepted" && !expired && (
                  <button
                    onClick={() => handleCheckout(b)}
                    className="btn btn-primary btn-sm w-full mt-2"
                  >
                    Pay Now
                  </button>
                )}

                {expired && (
                  <p className="text-red-500 text-sm">Departure time passed</p>
                )}
              </div>
            </div>
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
