import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import useTheme from "../hooks/useTheme";
import { ShieldCheck, CreditCard, Zap } from "lucide-react";
import chittagong from "../assets/chittagong.jpg";
import coxsbazar from "../assets/coxsbazar.jpg";
import rajshahi from "../assets/rajshahi.jpg";
import rangpur from "../assets/rangpur.jpg";
import sylhet from "../assets/sylhet.jpg";

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
          fetch("https://ticketbari-server-1.onrender.com/homepage/ads"),
          fetch(
            "https://ticketbari-server-1.onrender.com/homepage/latest-tickets",
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

  return (
    <div className={`space-y-20 mx-auto ${theme === "dark" ? "dark" : ""}`}>
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
      <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white text-center">
        Advertised Tickets
      </h2>
      <section className="relative py-16">
        {/* Glass Background Wrapper */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-none" />

        {/* Optional soft gradient (very subtle, not AI-looking) */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-white/10 dark:from-white/5 dark:to-transparent" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : advertisedTickets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No featured tickets available.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 lg:gap-10">
              {advertisedTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className=" rounded-2xl 
    backdrop-blur-lg 
    bg-white/40 dark:bg-white/10 
    border border-white/30 dark:border-white/10 
    shadow-md

    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-[1.02]
    hover:shadow-xl hover:border-primary/30"
                >
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* LATEST TICKETS */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Latest Tickets</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : latestTickets.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No tickets available.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-6">
            {latestTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                className="
    rounded-2xl 
    bg-white dark:bg-gray-800 
    border border-gray-200 dark:border-gray-700 
    shadow-md

    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-[1.02]
    hover:shadow-xl hover:border-primary/30
  "
                ticket={ticket}
              />
            ))}
          </div>
        )}
      </section>

      {/* EXTRA SECTION 1 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
            Why Choose <span className="text-primary">TicketBari</span>
          </h2>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 hover:border-primary/30">
            {[
              {
                title: "Verified Vendors",
                desc: "Every vendor is reviewed and approved to ensure trust and quality.",
                icon: ShieldCheck,
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                title: "Secure Payments",
                desc: "Safe and reliable transactions powered by modern payment systems.",
                icon: CreditCard,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                title: "Instant Booking",
                desc: "Real-time availability lets you book tickets instantly without delays.",
                icon: Zap,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="
              rounded-2xl p-8 
              bg-white/60 dark:bg-white/5 
              backdrop-blur-lg
              border border-gray-200/50 dark:border-white/10
              shadow-sm hover:shadow-lg
              transition duration-300
              hover:-translate-y-1
            "
                >
                  {/* Icon */}
                  <div
                    className={`
                w-12 h-12 mb-4 flex items-center justify-center 
                rounded-xl ${item.bg}
              `}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTRA SECTION 2 */}
      <section className="py-20 bg-gray-200 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Popular Routes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Most booked travel routes by our customers
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                name: "Cox’s Bazar",
                route: "Dhaka → Cox’s Bazar",
                img: coxsbazar,
              },
              {
                name: "Chittagong",
                route: "Dhaka → Chittagong",
                img: chittagong,
              },
              {
                name: "Sylhet",
                route: "Dhaka → Sylhet",
                img: sylhet,
              },
              {
                name: "Rajshahi",
                route: "Dhaka → Rajshahi",
                img: rajshahi,
              },
              {
                name: "Rangpur",
                route: "Dhaka → Rangpur",
                img: rangpur,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
    rounded-2xl overflow-hidden 
    bg-white dark:bg-gray-800
    shadow-md
    border border-gray-200 dark:border-gray-700

    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02]
  "
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.route}
                  </p>
                </div>
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
    <div
      className="
    flex flex-col overflow-hidden rounded-xl 
    border border-zinc-300 dark:border-zinc-700
    bg-white dark:bg-zinc-900
    shadow-sm

    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-[1.02]
    hover:shadow-xl hover:border-primary/30
  "
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="
        h-48 w-full object-cover
        transition-transform duration-500 ease-out
        hover:scale-110
      "
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {ticket.title}
        </h3>

        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
          <p>Price: ৳{ticket.price}</p>
          <p>Available: {ticket.quantity}</p>
          <p>Transport: {ticket.transportType}</p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span className="font-medium">Perks:</span>{" "}
          {Array.isArray(ticket.perks) && ticket.perks.length > 0
            ? ticket.perks.join(", ")
            : "No perks"}
        </p>

        <Link
          to={`/tickets/${ticket._id}`}
          className="
        btn btn-sm btn-primary w-full mt-5
        transition-all duration-300
        hover:scale-[1.02]
      "
        >
          See Details
        </Link>
      </div>
    </div>
  );
};
