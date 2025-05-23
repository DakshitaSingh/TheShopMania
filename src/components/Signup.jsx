// src/components/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);

      setMessage(
        "A verification email has been sent. Please check your inbox."
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="bg-[#e6dbc8] md:w-1/2 w-full flex justify-center items-center p-8">
        <h1 className="text-[60px] md:text-[120px] font-bold text-[#1c1c29]">
          ShopMania
        </h1>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex justify-center items-center bg-white p-8">
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-2xl font-semibold text-center">Signup</h2>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 focus:outline-none py-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 focus:outline-none py-2"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#382715] text-white py-2 rounded hover:bg-[#2e1f10] transition cursor-pointer"
            >
              Signup
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
