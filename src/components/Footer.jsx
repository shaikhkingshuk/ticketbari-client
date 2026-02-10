import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import stripeLogo from "../assets/stripe.png"; // optional local asset

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">TicketBari</h2>
          <p className="text-sm leading-relaxed">
            Book bus, train, launch & flight tickets easily. Travel smart,
            travel safe with TicketBari.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/allTickets" className="hover:text-primary">
                All Tickets
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-primary">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope />
              support@ticketbari.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt />
              +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <FaFacebook />
              facebook.com/ticketbari
            </li>
          </ul>
        </div>

        {/* Column 4: Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
          <div className="flex items-center gap-4">
            {/* If you don't want an image, text is fine too */}
            <img src={stripeLogo} alt="Stripe" className="h-8 object-contain" />
            <span className="text-sm">Secure payments via Stripe</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm">
          © 2025 TicketBari. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
