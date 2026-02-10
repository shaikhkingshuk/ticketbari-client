import React, { useContext, useState } from "react";
import useTheme from "../hooks/useTheme";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

export const Header = () => {
  const { user, role, loading, logOut } = useContext(AuthContext); // ✅ get role directly
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Set dashboard path based on role
  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : role === "user"
          ? "/dashboard/user"
          : null;

  const handleLogout = () => {
    console.log("abcdedddd");
    logOut()
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  if (loading) {
    return (
      <div className="h-16 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <nav className="relative">
      <div className="mx-auto max-w-7xl pr-6 pl-2 b-2 bg-blue-100 dark:bg-blue-600 rounded-full mt-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-0">
            <button
              className="md:hidden text-2xl text-black pl-3"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
            <img src={logo} alt="ticketbari logo" className="w-15" />
            <span className="hidden sm:inline text-xl font-bold text-zinc-900 dark:text-zinc-50">
              TicketBari
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 dark:text-zinc-50 hover:text-black"
            >
              Home
            </Link>
            <Link
              to="/allTickets"
              className="text-gray-600 dark:text-zinc-50 hover:text-black"
            >
              All Tickets
            </Link>
            <Link
              to="/myTickets"
              className="text-gray-600 dark:text-zinc-50 hover:text-black"
            >
              My Tickets
            </Link>

            {user && dashboardPath && (
              <Link
                to={dashboardPath}
                className="text-gray-600 dark:text-zinc-50 hover:text-black"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              value="dark"
              className="toggle theme-controller mr-2 text-gray-600"
              checked={theme === "dark"}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-300"
                >
                  <img
                    src={
                      user?.photoURL
                        ? user.photoURL
                        : "https://i.ibb.co/ZxQJk0K/user.png"
                    }
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 hidden sm:inline">
                    {user?.displayName}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-40 bg-blue-100 dark:bg-blue-600 rounded-md shadow-md z-50">
                    <Link
                      to="/profile"
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:bg-blue-800"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        closeDropdown();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="rounded-md border px-4 py-1.5">
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute z-999 inline-block px-5 m-2 rounded-2xl bg-blue-600">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-zinc-50 hover:text-black"
            >
              Home
            </Link>
            <Link
              to="/allTickets"
              className="text-gray-700 dark:text-zinc-50 hover:text-black"
            >
              All Tickets
            </Link>
            <Link
              to="myTickets"
              className="text-gray-700 dark:text-zinc-50 hover:text-black"
            >
              My Tickets
            </Link>
            {user && dashboardPath && (
              <Link
                to={dashboardPath}
                className="text-gray-600 dark:text-zinc-50 hover:text-black"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
