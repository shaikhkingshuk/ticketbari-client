import React from "react";
import { NavLink, Outlet } from "react-router";

export const VendorDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl mt-5 flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-5">
        <h2 className="text-xl font-semibold mb-6">Vendor Panel</h2>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Vendor Profile
          </NavLink>

          <NavLink
            to="/dashboard/vendor/addTicket"
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
            to="requestedBookings"
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
