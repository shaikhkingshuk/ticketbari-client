import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const TransactionHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user?.email) return; // ✅ wait until user exists

    fetch(
      `https://ticketbari-server.onrender.com/transactions/user/${user.email}`,
      {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, [user?.email]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-20">Please login first</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Ticket Title</th>
              <th>Amount</th>
              <th>Payment Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, index) => (
              <tr key={t._id}>
                <td>{index + 1}</td>
                <td className="text-xs">{t.transactionId || "N/A"}</td>
                <td>{t.title}</td>
                <td>৳ {t.price * t.bookedQuantity}</td>
                <td>
                  {new Date(t.paidAt).toLocaleDateString()}{" "}
                  {new Date(t.paidAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No transactions found
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
