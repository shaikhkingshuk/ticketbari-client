import React, { useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";

export const Register = () => {
  const images = [
    "https://images.unsplash.com/photo-1583429891508-015ef9cd958e?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1700555994714-66545f37071f?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1714421512666-63f91bc949c4?w=600&auto=format&fit=crop&q=60",
  ];

  const { createUser, googleSignIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Register
  const handleRegister = (e) => {
    e.preventDefault();

    const form = e.target;
    const displayName = form.name.value;
    const email = form.email.value;
    const photoURL = form.photo.value;
    const password = form.password.value;

    // Email Validation
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    // Password Validation
    const passRegEx = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passRegEx.test(password)) {
      return toast.error(
        "Password must be at least 6 characters and include uppercase & lowercase letters",
      );
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;

        return updateProfile(user, {
          displayName,
          photoURL,
        }).then(() => user);
      })
      .then((user) => {
        const userInfo = {
          uid: user.uid,
          email,
          name: displayName,
          photoURL,
        };

        return fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });
      })
      .then((res) => {
        if (res.status === 409) {
          throw new Error("Email already exists");
        }
        return res.json();
      })
      .then(() => {
        toast.success("Account created successfully");
        navigate("/dashboard/user");
      })
      .catch((error) => toast.error(error.message));
  };

  // Google Register
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
    <div className="mt-10 md:gap-3 flex flex-row justify-between items-center mx-auto max-w-7xl h-180">
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
          <h2 className="text-4xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">
            Join us and start your journey today.
          </p>

          <form onSubmit={handleRegister}>
            <label className="font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="input input-bordered w-full my-2"
              required
            />

            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              className="input input-bordered w-full my-2"
              required
            />

            <label className="font-semibold">Photo URL</label>
            <input
              type="text"
              name="photo"
              placeholder="Photo link (optional)"
              className="input input-bordered w-full my-2"
            />

            <label className="font-semibold">Password</label>
            <div className="relative my-2">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Create password"
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
              Sign Up
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
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
