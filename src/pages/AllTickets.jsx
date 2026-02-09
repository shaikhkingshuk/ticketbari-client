import React, { useEffect, useState } from "react";
import { Link } from "react-router";

export const AllTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Available Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="border rounded-xl shadow hover:shadow-md bg-white overflow-hidden"
          >
            <img
              src={ticket.image}
              alt={ticket.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <p>
                {ticket.from} → {ticket.to}
              </p>
              <p>Transport: {ticket.transportType}</p>
              <p>Price: ৳{ticket.price}</p>
              <p>Quantity: {ticket.quantity}</p>

              <p className="text-sm text-gray-600">
                Departure: {new Date(ticket.departureDateTime).toLocaleString()}
              </p>

              <div className="mt-3">
                <Link
                  to={`/tickets/${ticket._id}`}
                  className="btn btn-sm btn-primary w-full"
                >
                  See Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
