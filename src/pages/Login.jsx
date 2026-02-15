import React, { useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth"; // ✅ import
import { auth } from "../firebase/firebase.config"; // ✅ import Firebase auth

export const Login = () => {
  const images = [
    "https://images.unsplash.com/photo-1583429891508-015ef9cd958e?w=600",
    "https://images.unsplash.com/photo-1700555994714-66545f37071f?w=600",
    "https://images.unsplash.com/photo-1714421512666-63f91bc949c4?w=600",
  ];

  const { signIn, googleSignIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  // Email Login
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password)
      .then(() => {
        toast.success("Logged in successfully");
        navigate("/"); // 🔑 role-based redirect happens there
      })
      .catch((error) => toast.error(error.message));
  };

  // Google Login
  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      const user = res.user;

      // ✅ get token (if your route is protected)
      const token = await user.getIdToken();

      // ✅ create user in DB
      await fetch("https://ticketbari-server.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      toast.success("Logged in with Google");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ Forgot Password
  const handleForgotPassword = async () => {
    const email = emailRef.current?.value;
    if (!email) {
      return toast.error("Please enter your email first");
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-10 flex flex-row justify-between mx-auto max-w-7xl h-180">
      <div className="hidden md:block md:w-1/2 h-full">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full rounded-r-3xl"
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <img
                src={url}
                alt={`slide-${index}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 shadow-xl rounded-xl">
          <h2 className="text-4xl font-bold mb-2">Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Email"
              className="input input-bordered w-full my-2"
              required
            />

            <div className="relative my-2">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input input-bordered w-full pr-12"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 cursor-pointer"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot Password */}
            <p
              className="text-right text-sm text-blue-500 cursor-pointer mb-2"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </p>

            <button className="btn btn-neutral w-full mt-4">Login</button>
          </form>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full mt-4"
          >
            <FcGoogle /> Continue with Google
          </button>

          <p className="text-center mt-4">
            New here? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
