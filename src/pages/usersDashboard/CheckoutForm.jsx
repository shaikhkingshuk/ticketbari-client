import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({ booking, close }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    const res = await fetch("http://localhost:3000/create-payment-intent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        price: booking.price,
        quantity: booking.bookedQuantity,
      }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.paymentIntent.status === "succeeded") {
      await fetch(`http://localhost:3000/bookings/pay/${booking._id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ticketId: booking.ticketId,
          bookedQuantity: booking.bookedQuantity,
        }),
      });

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
