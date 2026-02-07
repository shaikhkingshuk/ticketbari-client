import React, { useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const images = [
    "https://images.unsplash.com/photo-1583429891508-015ef9cd958e?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1700555994714-66545f37071f?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1714421512666-63f91bc949c4?w=600&auto=format&fit=crop&q=60",
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
        fetch(`http://localhost:3000/users/${email}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.role === "admin") {
              navigate("/dashboard/admin");
            } else if (data.role === "vendor") {
              navigate("/dashboard/vendor");
            } else {
              navigate("/dashboard/user");
            }

            toast.success("Logged in successfully");
          });
      })
      .catch((error) => toast.error(error.code));
  };

  // Google Login
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;

        fetch(`http://localhost:3000/users/${user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data === null) {
              const userInfo = {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
              };

              fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userInfo),
              }).then(() => {
                navigate("/dashboard/user");
                toast.success("Account created with Google");
              });
            } else {
              if (data.role === "admin") navigate("/dashboard/admin");
              else if (data.role === "vendor") navigate("/dashboard/vendor");
              else navigate("/dashboard/user");

              toast.success("Logged in with Google");
            }
          });
      })
      .catch((error) => toast.error(error.message));
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

      <div className="w-full md:w-1/2 h-full flex items-center justify-center">
        <div className="w-full max-w-md p-10 rounded-xl shadow-xl">
          <h2 className="text-4xl font-bold mb-2">Login</h2>
          <p className="text-gray-500 mb-6">
            Welcome back! Please enter your credentials.
          </p>

          <form onSubmit={handleLogin}>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Enter your email"
              className="input input-bordered w-full my-2"
              required
            />

            <label className="font-semibold">Password</label>
            <div className="relative my-2">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full pr-12"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-neutral w-full mt-4">
              Login
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="grow border-t"></div>
            <span className="mx-3 text-sm">OR</span>
            <div className="grow border-t"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
