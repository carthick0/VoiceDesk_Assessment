import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const testCreds = {
    email: "testuser@example.com",
    password: "Test@1234",
  };

  const handleLogin = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login Success:", user);

      // Redirect based on role
      if (user.role === "humanai") {
        navigate("/humanai-dashboard");
      } else {
        navigate("/room");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(form);
  };

  const handleTestLogin = () => {
    handleLogin(testCreds);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-64">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-3 mb-3 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="p-3 mb-4 rounded text-black"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl mb-3"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleTestLogin}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
        >
          Use Test Credentials
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}
    </div>
  );
}

export default Login;
