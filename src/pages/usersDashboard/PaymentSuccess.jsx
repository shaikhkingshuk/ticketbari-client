import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const bookingId = params.get("bookingId");
    const ticketId = params.get("ticketId");
    const quantity = params.get("quantity");
    const transactionId = params.get("session_id");

    if (!bookingId || !transactionId) {
      toast.error("Invalid payment session");
      navigate("/");
      return;
    }

    fetch(`https://ticketbari-server.onrender.com/bookings/pay/${bookingId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        ticketId,
        bookedQuantity: Number(quantity),
        transactionId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Payment completed successfully");
        navigate("/dashboard/user/transactions");
      })
      .catch(() => toast.error("Payment confirmation failed"));
  }, [params, navigate]);

  return <p className="text-center mt-20">Processing payment...</p>;
};

export default PaymentSuccess;
