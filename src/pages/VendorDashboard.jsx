import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";

export const VendorDashboard = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="mx-auto max-w-7xl min-h-screen flex relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className={` absolute top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded ${open && "fixed top-4 left-4 z-50"}  `}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-full w-64 bg-gray-100 border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          
          pt-16 
        `}
      >
        <h2 className="text-xl font-semibold mb-6 px-5">Vendor Panel</h2>

        <nav className="flex flex-col gap-3 px-5">
          <NavLink
            to="/dashboard/vendor"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            User Profile
          </NavLink>

          <NavLink
            to="/dashboard/vendor/addTicket"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Add Ticket
          </NavLink>

          <NavLink
            to="/dashboard/vendor/myAddedTickets"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            My Added Tickets
          </NavLink>

          <NavLink
            to="/dashboard/vendor/requestedBookings"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Requested Bookings
          </NavLink>

          <NavLink
            to="revenueOverview"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Revenue Overview
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
