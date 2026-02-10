import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";

export const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const res = await fetch("http://localhost:3000/admin/tickets");
      const data = await res.json();

      setTickets(data.filter((t) => t.verificationStatus === "approved"));
      setLoading(false);
    };

    fetchTickets();
  }, []); // ✅ EMPTY dependency array (IMPORTANT)

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

  const handleToggle = async (ticket) => {
    try {
      const res = await fetch(
        `http://localhost:3000/admin/tickets/advertise/${ticket._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isAdvertised: !ticket.isAdvertised,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      // refetch
      const updated = await fetch("http://localhost:3000/admin/tickets");
      const data = await updated.json();
      setTickets(data.filter((t) => t.verificationStatus === "approved"));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className={`p-6 max-w-7xl mx-auto mt-5 ${theme === "dark" ? "dark" : ""}`}
    >
      <h2 className="text-xl font-bold mb-4">
        Advertise Tickets ({advertisedCount}/6)
      </h2>

      <table className="w-full border">
        <thead className="bg-gray-200 dark:bg-gray-500">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Route</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Advertise</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td className="border p-2">{ticket.title}</td>
              <td className="border p-2">
                {ticket.from} → {ticket.to}
              </td>
              <td className="border p-2">৳{ticket.price}</td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={!!ticket.isAdvertised}
                  onChange={() => handleToggle(ticket)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
