import React, { useState } from "react";
import useTheme from "../hooks/useTheme";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white">
      <div className="mx-auto max-w-7xl pr-6 pl-2 b-2 bg-blue-50 rounded-full mt-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-0">
            <img src="./logo.png" alt="ticketbari logo" className="w-15" />
            <span className="text-xl font-bold text-gray-800">TicketBari</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
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
          </div>

          <div className="hidden md:flex items-center gap-3">
            <input
              type="checkbox"
              value="dark"
              className="toggle theme-controller mr-6 text-gray-600 "
              checked={theme === "dark"}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
            <button className="rounded-md border px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Login
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
              Sign Up
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <input
              type="checkbox"
              value="dark"
              className="toggle theme-controller mr-6 text-gray-600"
              checked={theme === "dark"}
              onChange={(e) => toggleTheme(e.target.checked)}
            />
            <button
              className=" text-2xl text-black"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border border-gray-600 inline-block m-2 rounded-2xl bg-white">
          <div className="flex flex-col gap-4 px-4 py-4">
            <a href="#" className="text-gray-700">
              All Tickets
            </a>
            <a href="#" className="text-gray-700">
              My Tickets
            </a>
            <a href="#" className="text-gray-700">
              Support
            </a>

            <div className="mt-2 flex gap-3">
              <button className="rounded-md border px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Login
              </button>
              <button className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
