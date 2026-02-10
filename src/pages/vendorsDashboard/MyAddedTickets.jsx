import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import useTheme from "../../hooks/useTheme";

export const MyAddedTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [perks, setPerks] = useState([]);
  const { theme } = useTheme();

  const divisions = [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const image_host_key = import.meta.env.VITE_image_host;

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let imageURL = selectedTicket.image;

    // Upload new image only if selected
    if (form.image.files[0]) {
      const imageData = new FormData();
      imageData.append("image", form.image.files[0]);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${image_host_key}`,
        {
          method: "POST",
          body: imageData,
        },
      );

      const imgData = await imgRes.json();
      if (!imgData.success) {
        return toast.error("Image upload failed");
      }

      imageURL = imgData.data.display_url;
    }

    const updatedTicket = {
      title: form.title.value,
      from: form.from.value,
      to: form.to.value,
      transportType: form.transportType.value,
      price: Number(form.price.value),
      quantity: Number(form.quantity.value),
      departureDateTime: form.departureDateTime.value,
      perks,
      image: imageURL,
    };

    const res = await fetch(
      `http://localhost:3000/tickets/${selectedTicket._id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedTicket),
      },
    );

    if (res.ok) {
      toast.success("Ticket updated successfully");

      setTickets((prev) =>
        prev.map((t) =>
          t._id === selectedTicket._id
            ? {
                ...t,
                ...updatedTicket,
                verificationStatus: "pending",
              }
            : t,
        ),
      );

      setSelectedTicket(null);
    } else {
      toast.error("Update failed");
    }
  };

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
    <div
      className={`max-w-7xl mx-auto px-4 py-8 ${theme === "dark" ? "dark" : ""}`}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">My Added Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-zinc-100">
          No tickets added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden bg-white dark:bg-zinc-700"
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

                <p className="text-sm text-gray-600 dark:text-zinc-200 mb-1">
                  {ticket.from} → {ticket.to}
                </p>

                <div className="text-sm text-gray-700 dark:text-zinc-200 space-y-1">
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
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setPerks(ticket.perks || []);
                    }}
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
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Update Ticket
            </h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                defaultValue={selectedTicket.title}
                required
                className="input input-bordered w-full"
              />

              <select
                name="from"
                defaultValue={selectedTicket.from}
                className="select select-bordered w-full"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                name="to"
                defaultValue={selectedTicket.to}
                className="select select-bordered w-full"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                name="transportType"
                defaultValue={selectedTicket.transportType}
                className="select select-bordered w-full"
              >
                <option value="Air">Air</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Launch">Launch</option>
              </select>

              <input
                type="number"
                name="price"
                defaultValue={selectedTicket.price}
                className="input input-bordered w-full"
              />

              <input
                type="number"
                name="quantity"
                defaultValue={selectedTicket.quantity}
                className="input input-bordered w-full"
              />

              <input
                type="datetime-local"
                name="departureDateTime"
                defaultValue={selectedTicket.departureDateTime?.slice(0, 16)}
                className="input input-bordered w-full"
              />

              <div className="flex flex-wrap gap-4">
                {["AC", "Breakfast", "WiFi"].map((perk) => (
                  <label key={perk} className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={perks.includes(perk)}
                      onChange={() =>
                        setPerks((prev) =>
                          prev.includes(perk)
                            ? prev.filter((p) => p !== perk)
                            : [...prev, perk],
                        )
                      }
                    />
                    {perk}
                  </label>
                ))}
              </div>

              <input
                type="file"
                name="image"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />

              <div className="flex gap-3">
                <button className="btn btn-primary flex-1">Update</button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
