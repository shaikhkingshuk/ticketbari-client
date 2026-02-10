import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import useTheme from "../../hooks/useTheme";

export const AddTicket = () => {
  const { user } = useContext(AuthContext);
  const [perks, setPerks] = useState([]);
  const { theme } = useTheme();

  const image_host_key = import.meta.env.VITE_image_host;

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

  const handlePerks = (perk) => {
    if (perks.includes(perk)) {
      setPerks(perks.filter((p) => p !== perk));
    } else {
      setPerks([...perks, perk]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const imageFile = form.image.files[0];
    const imageData = new FormData();
    imageData.append("image", imageFile);

    try {
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

      const imageURL = imgData.data.display_url;

      const ticketData = {
        title: form.title.value,
        from: form.from.value,
        to: form.to.value,
        transportType: form.transportType.value,
        price: parseFloat(form.price.value),
        quantity: parseInt(form.quantity.value),
        departureDateTime: form.departureDateTime.value,
        perks,
        image: imageURL,
        vendorName: user?.displayName,
        vendorEmail: user?.email,
      };

      const res = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (res.ok) {
        toast.success("Ticket added successfully (Pending approval)");
        form.reset();
        setPerks([]);
      } else {
        toast.error("Failed to add ticket");
      }
    } catch (error) {
      toast.error("Something went wrong", error);
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto p-6 bg-white dark:bg-zinc-700 rounded shadow ${theme === "dark" ? "dark" : ""}`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Title */}
        <input
          type="text"
          name="title"
          placeholder="Ticket Title"
          required
          className="input input-bordered w-full"
        />

        {/* From */}
        <select name="from" required className="select select-bordered w-full">
          <option value="">From (Division)</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* To */}
        <select name="to" required className="select select-bordered w-full">
          <option value="">To (Division)</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Transport Type */}
        <select
          name="transportType"
          required
          className="select select-bordered w-full"
        >
          <option value="">Transport Type</option>
          <option value="Air">Air</option>
          <option value="Launch">Launch</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
        </select>

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price per unit"
          required
          className="input input-bordered w-full"
        />

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          placeholder="Ticket Quantity"
          required
          className="input input-bordered w-full"
        />

        {/* Departure */}
        <input
          type="datetime-local"
          name="departureDateTime"
          required
          className="input input-bordered w-full"
        />

        {/* Perks */}
        <div className="flex flex-wrap gap-4">
          {["AC", "Breakfast", "WiFi"].map((perk) => (
            <label key={perk} className="flex items-center gap-2">
              <input type="checkbox" onChange={() => handlePerks(perk)} />
              {perk}
            </label>
          ))}
        </div>

        {/* Image */}
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="file-input file-input-bordered w-full"
        />

        {/* Vendor Name */}
        <input
          type="text"
          defaultValue={user?.displayName}
          readOnly
          className="input input-bordered w-full bg-gray-100 dark:bg-zinc-600"
        />

        {/* Vendor Email */}
        <input
          type="email"
          defaultValue={user?.email}
          readOnly
          className="input input-bordered w-full bg-gray-100 dark:bg-zinc-600"
        />

        <button className="btn btn-primary w-full">Add Ticket</button>
      </form>
    </div>
  );
};
