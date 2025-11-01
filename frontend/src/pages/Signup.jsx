import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">📝 Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-80">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-lg font-semibold"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-400 mt-3">{error}</p>}
      <p className="mt-4 text-gray-400">
        Already have an account?{" "}
        <span
          className="text-blue-400 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;
