import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import useTheme from "../hooks/useTheme";
import { AuthContext } from "../context/AuthContext";

export const AllTickets = () => {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transportType, setTransportType] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchTickets = async () => {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (transportType) params.append("transportType", transportType);
    if (sort) params.append("sort", sort);

    const res = await fetch(
      `https://ticketbari-server-1.onrender.com/tickets?${params.toString()}`,
      {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    const data = await res.json();

    setTickets(data.tickets);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const params = new URLSearchParams({ page, limit: 8 });
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (transportType) params.append("transportType", transportType);
      if (sort) params.append("sort", sort);

      const res = await fetch(
        `https://ticketbari-server-1.onrender.com/tickets?${params.toString()}`,
        {
          headers: {
            authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      const data = await res.json();

      setTickets(data.tickets);
      setTotalPages(data.totalPages);
    };

    fetchTickets();
  }, [page, from, to, transportType, sort, user?.accessToken]); // ✅ all deps included

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} max-w-7xl mx-auto px-4 py-10`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
        Available Tickets
      </h2>

      {/* SEARCH / FILTER / SORT */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="input input-bordered"
        />

        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="input input-bordered"
        />

        <select
          value={transportType}
          onChange={(e) => setTransportType(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Transport</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Launch">Launch</option>
          <option value="Air">Air</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Sort by Price</option>
          <option value="price_low">Low → High</option>
          <option value="price_high">High → Low</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchTickets();
          }}
          className="btn btn-primary"
        >
          Apply
        </button>
      </div>

      {/* TICKETS */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
        {tickets.map((ticket) => (
          //card start

          <div
            key={ticket._id}
            className="flex flex-col overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700
  bg-white dark:bg-zinc-900
  shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <img
              src={ticket.image}
              alt={ticket.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-5 flex flex-col grow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {ticket.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {ticket.from} → {ticket.to}
              </p>

              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                <p>Transport: {ticket.transportType}</p>
                <p>৳{ticket.price}</p>
              </div>

              <Link
                to={`/tickets/${ticket._id}`}
                className="btn btn-sm btn-primary w-full mt-5"
              >
                See Details
              </Link>
            </div>
          </div>

          //card end
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-10">
        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n + 1)}
            className={`btn btn-sm ${
              page === n + 1 ? "btn-primary" : "btn-outline"
            }`}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
