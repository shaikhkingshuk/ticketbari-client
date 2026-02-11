import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

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

    fetch(`http://localhost:3000/bookings/pay/${bookingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
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
