// src/components/pages/Login.jsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await userCredential.user.reload(); // Ensure fresh data

      if (!userCredential.user.emailVerified) {
        await auth.signOut();
        setError("Please verify your email before logging in.");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.emailVerified) {
        await auth.signOut();
        setError("Please verify your email before logging in.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
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
          <h2 className="text-2xl font-semibold text-center">Login</h2>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
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
            <div className="text-right text-sm text-blue-600 hover:underline">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="focus:outline-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#382715] text-white py-2 rounded hover:bg-[#2e1f10] transition cursor-pointer"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium cursor-pointer"
            >
              Signup Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
