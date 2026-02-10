import React, { useContext, useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

export const Header = () => {
  const { user, loading, logOut } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardPath, setDashboardPath] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.role === "admin") {
            setDashboardPath("/dashboard/admin");
          } else if (data?.role === "vendor") {
            setDashboardPath("/dashboard/vendor");
          } else {
            setDashboardPath("/dashboard/user");
          }
        });
    }
  }, [user]);

  // console.log(user);
  const handleLogout = () => {
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
    <nav className="bg-white relative">
      <div className="mx-auto max-w-7xl pr-6 pl-2 b-2 bg-blue-50 rounded-full mt-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-0">
            <button
              className="md:hidden text-2xl text-black pl-3"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
            <img src={logo} alt="ticketbari logo" className="w-15" />
            <span className="hidden sm:inline text-xl font-bold text-gray-800">
              TicketBari
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="/allTickets" className="text-gray-600 hover:text-blue-600">
              All Tickets
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-white hover:text-blue-600"
            >
              My Tickets
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Support
            </a>
            {user && dashboardPath && (
              <Link
                to={dashboardPath}
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 ">
            <input
              type="checkbox"
              value="dark"
              className="toggle theme-controller mr-2 text-gray-600 "
              checked={theme === "dark"}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2  px-3 py-1.5 rounded-md hover:bg-gray-100"
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
                  {/* {console.log(user?.photoURL)} */}
                  <span className="text-gray-700 hidden sm:inline">
                    {user?.displayName}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-40 bg-blue-100 rounded-md shadow-md">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <Link
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
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
        <div className="md:hidden absolute z-999 inline-block px-5 m-2 rounded-2xl bg-blue-100">
          <div className="flex flex-col gap-4 px-4 py-4">
            <a href="/allTickets" className="text-gray-700">
              All Tickets
            </a>
            <a href="#" className="text-gray-700">
              My Tickets
            </a>
            <a href="#" className="text-gray-700">
              Support
            </a>
            {user && dashboardPath && (
              <Link
                to={dashboardPath}
                className="text-gray-600 hover:text-blue-600"
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
