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
import { auth } from "../firebase/firebase.config";

export const Register = () => {
  const { createUser, googleSignIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photo.value;
    const password = form.password.value;

    createUser(email, password)
      .then((res) => updateProfile(res.user, { displayName: name, photoURL }))
      .then(() =>
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            uid: auth.currentUser.uid,
            email,
            name,
            photoURL,
            role: "user",
          }),
        }),
      )
      .then(() => {
        toast.success("Account created");
        navigate("/");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(() => {
        toast.success("Logged in with Google");
        navigate("/");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="mt-10 max-w-7xl mx-auto flex">
      <div className="w-full md:w-1/2 p-10 shadow-xl rounded-xl">
        <h2 className="text-4xl font-bold mb-2">Register</h2>

        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Name" className="input w-full my-2" />
          <input
            name="email"
            placeholder="Email"
            className="input w-full my-2"
          />
          <input
            name="photo"
            placeholder="Photo URL"
            className="input w-full my-2"
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input w-full pr-12"
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn btn-neutral w-full mt-4">Register</button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full mt-4"
        >
          <FcGoogle /> Continue with Google
        </button>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
