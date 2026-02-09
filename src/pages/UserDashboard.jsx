import React from "react";
import { NavLink, Outlet } from "react-router";

export const UserDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl mt-5 flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-5">
        <h2 className="text-xl font-semibold mb-6">User Panel</h2>

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
            User Profile
          </NavLink>

          <NavLink
            to="/dashboard/user/myBookedTickets"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            My Booked Tickets
          </NavLink>

          <NavLink
            to="/dashboard/user/transactions"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Transaction History
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
