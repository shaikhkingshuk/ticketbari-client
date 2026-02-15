import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const CheckoutForm = ({ booking, close }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);

  const handlePay = async () => {
    const res = await fetch(
      "https://ticketbari-server.onrender.com/create-payment-intent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          price: booking.price,
          quantity: booking.bookedQuantity,
        }),
      },
    );

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.paymentIntent.status === "succeeded") {
      await fetch(
        `https://ticketbari-server.onrender.com/bookings/pay/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            ticketId: booking.ticketId,
            bookedQuantity: booking.bookedQuantity,
          }),
        },
      );

      toast.success("Payment successful");
      close();
    }
  };

  return (
    <>
      <CardElement />
      <button onClick={handlePay} className="btn btn-success w-full mt-4">
        Pay ৳ {booking.price * booking.bookedQuantity}
      </button>
    </>
  );
};

export default CheckoutForm;
