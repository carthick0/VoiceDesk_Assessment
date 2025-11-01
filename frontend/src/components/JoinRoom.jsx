/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function JoinRoom({ onJoin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  const handleJoin = async () => {
    try {
      const res = await api.post("/token", { name });
      onJoin({ name, token: res.data.token });
      navigate("/speak");
    } catch (err) {
      setError("Failed to join room");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">🎧 Join AI Salon Room</h1>

      <input
        className="p-3 w-64 text-black rounded mb-3"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleJoin}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-lg"
      >
        Join Room
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}

export default JoinRoom;
