import React from "react";
import { Link } from "react-router";
import { FaTimesCircle } from "react-icons/fa";

export const CanclePayment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4 mt-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaTimesCircle className="text-red-500 text-6xl" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Cancelled
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment process was cancelled. No money has been deducted from
          your account.
        </p>
      </div>
    </div>
  );
};
