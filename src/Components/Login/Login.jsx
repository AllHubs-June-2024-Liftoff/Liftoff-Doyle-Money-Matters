import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const {authService} = api;

  const handleLogin = async (e) => {
    e.preventDefault(); 

    setErrors({
      email: "",
      password: "",
      general: "",
    });

    let isValid = true;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      isValid = false;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await authService.login({ email, password });
      login(response);
      console.log("Login successful: ", response);

      navigate("/profile");
    } catch (error) {
      console.log("Login error:", error);

      if (error.error === "invalid_credentials") {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid email or password combination",
        }));
      } else if (error.error === "validation_error") {
        const errorMessages = Array.isArray(error.message)
          ? error.message
          : [error.message];
        errorMessages.forEach((msg) => {
          if (msg.toLowerCase().includes("email")) {
            setErrors((prev) => ({ ...prev, email: msg }));
          } else if (msg.toLowerCase().includes("password")) {
            setErrors((prev) => ({ ...prev, password: msg }));
          } else {
            setErrors((prev) => ({ ...prev, general: msg }));
          }
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            error.message || "An unexpected error occurred. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-450">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleLogin}>
          <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
          <p className="text-l font-semibold text-center mb-4">
            Welcome back to Money Matters
          </p>
          <br />

          {/* Added general error message display at the top of the form */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <div className="block text-gray-700">
            <label>
              Email:
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 p-2 w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </label>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="block text-gray-700">
            <label>
              Password:
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-2 p-2 w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </label>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Rest of your form remains the same */}
          <div className="mt-4 text-center">
            <label htmlFor="">
              <input type="checkbox" className="text-align: left" />
              Remember me
            </label>
            <p>
              <Link
                to="/forgotpassword"
                className="text-blue-600 hover:text-blue-700 text-align:right"
              >
                Forgot Password?
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <p>
              Don't have an account?
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 text-align:right"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;