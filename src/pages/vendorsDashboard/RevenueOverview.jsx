import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useTheme from "../../hooks/useTheme";

const COLORS = ["#4f46e5", "#22c55e"];

const RevenueOverview = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!user?.email) return;

    fetch(
      `https://ticketbari-server.onrender.com/vendor/revenue-overview?email=${user.email}`,
    )
      .then((res) => res.json())
      .then(setData);
  }, [user]);

  if (!data) {
    return <p className="text-center mt-10">Loading revenue data...</p>;
  }

  const revenueChartData = Object.entries(data.revenueChart).map(
    ([date, revenue]) => ({
      date,
      revenue,
    }),
  );

  const ticketsRemaining = Math.max(
    data.totalTicketsAdded - data.totalTicketsSold,
    0,
  );

  const pieData = [
    { name: "Tickets Sold", value: data.totalTicketsSold },
    { name: "Tickets Remaining", value: ticketsRemaining },
  ];

  return (
    <div className={`p-6 space-y-10 ${theme === "dark" ? "dark" : ""}`}>
      <h2 className="text-3xl font-bold">Revenue Overview</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-700 shadow rounded p-5">
          <h4 className="text-sm text-gray-500 dark:text-gray-300">
            Total Revenue
          </h4>
          <p className="text-2xl font-bold">৳ {data.totalRevenue}</p>
        </div>

        <div className="bg-white dark:bg-zinc-700 shadow rounded p-5">
          <h4 className="text-sm text-gray-500 dark:text-gray-300">
            Tickets Sold
          </h4>
          <p className="text-2xl font-bold">{data.totalTicketsSold}</p>
        </div>

        <div className="bg-white dark:bg-zinc-700 shadow rounded p-5">
          <h4 className="text-sm text-gray-500 dark:text-gray-300">
            Tickets Added
          </h4>
          <p className="text-2xl font-bold">{data.totalTicketsAdded}</p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white dark:bg-zinc-700 shadow rounded p-6">
        <h3 className="font-semibold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueChartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white dark:bg-zinc-700 shadow rounded p-6">
        <h3 className="font-semibold mb-4">Tickets Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
