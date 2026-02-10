import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import useTheme from "../hooks/useTheme";

export const HomePage = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [adsRes, latestRes] = await Promise.all([
          fetch("https://ticketbari-server.onrender.com/homepage/ads"),
          fetch(
            "https://ticketbari-server.onrender.com/homepage/latest-tickets",
          ),
        ]);

        const advertised = await adsRes.json();
        const latest = await latestRes.json();

        setAdvertisedTickets(Array.isArray(advertised) ? advertised : []);
        setLatestTickets(Array.isArray(latest) ? latest : []);
      } catch (err) {
        console.error("Homepage load failed", err);
        setAdvertisedTickets([]);
        setLatestTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading homepage...</div>;
  }

  return (
    <div
      className={`space-y-20 max-w-7xl mx-auto mt-10 ${theme === "dark" ? "dark" : ""}`}
    >
      {/* HERO SECTION */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop
        className="h-100"
      >
        {[
          "https://images.unsplash.com/photo-1503220317375-aaad61436b1b",
          "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
        ].map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              className="w-full h-full object-cover"
              alt="banner"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ADVERTISEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Featured Tickets</h2>

        {advertisedTickets.length === 0 ? (
          <p className="text-gray-500">No featured tickets available.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* LATEST TICKETS */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Latest Tickets</h2>

        {latestTickets.length === 0 ? (
          <p className="text-gray-500">No tickets available.</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {latestTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* EXTRA SECTION 1 */}
      <section className="relative py-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-5y00 via-indigo-500 to-purple-500 dark:from-gray-900 dark:via-gray-800 dark:to-black" />

        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <h2 className="text-4xl font-extrabold text-center mb-12">
            Why Choose <span className="text-yellow-300">TicketBari?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Vendors",
                desc: "Every vendor is checked and approved by our admin team.",
                icon: "✅",
              },
              {
                title: "Secure Payments",
                desc: "Stripe-powered payments with full transaction safety.",
                icon: "🔒",
              },
              {
                title: "Instant Booking",
                desc: "Book tickets instantly with real-time availability.",
                icon: "⚡",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center
                     hover:scale-105 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-5xl mb-4 animate-bounce">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA SECTION 2 */}
      <section className="py-20 bg-gray-200 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
            Popular Routes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Most booked travel routes by our customers
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Dhaka → Cox’s Bazar",
              "Dhaka → Chittagong",
              "Dhaka → Sylhet",
              "Dhaka → Rajshahi",
              "Dhaka → Rangpur",
            ].map((route, i) => (
              <div
                key={i}
                className="px-6 py-4 rounded-full text-lg font-semibold
                     bg-white dark:bg-gray-800
                     text-gray-800 dark:text-gray-100
                     shadow-md hover:shadow-xl
                     hover:-translate-y-1 hover:scale-105
                     transition-all duration-300"
              >
                🚍 {route}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const TicketCard = ({ ticket }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img
        src={ticket.image}
        alt={ticket.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{ticket.title}</h3>
        <p>Price: ৳{ticket.price}</p>
        <p>Available: {ticket.quantity}</p>
        <p>Transport: {ticket.transportType}</p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Perks:</span>{" "}
          {Array.isArray(ticket.perks) && ticket.perks.length > 0
            ? ticket.perks.join(", ")
            : "No perks"}
        </p>
        <Link
          to={`/tickets/${ticket._id}`}
          className="inline-block mt-3 text-blue-600 font-semibold"
        >
          See details →
        </Link>
      </div>
    </div>
  );
};
