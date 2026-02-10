import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export const HomePage = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [adsRes, latestRes] = await Promise.all([
          fetch("http://localhost:3000/homepage/ads"),
          fetch("http://localhost:3000/homepage/latest-tickets"),
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
    <div className="space-y-20 max-w-7xl mx-auto mt-10">
      {/* HERO SECTION */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop
        className="h-[400px]"
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
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose TicketBari?</h2>
          <p className="text-gray-600">
            Verified vendors, secure payments, instant booking confirmation.
          </p>
        </div>
      </section>

      {/* EXTRA SECTION 2 */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Popular Routes</h2>
        <p className="text-gray-600">
          Dhaka → Cox’s Bazar • Dhaka → Chittagong • Dhaka → Sylhet
        </p>
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
