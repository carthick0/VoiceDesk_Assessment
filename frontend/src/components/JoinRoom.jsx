import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LIVEKIT_TOKEN_URL = "http://localhost:5000/api/token"; // backend endpoint

function JoinRoom({ onJoin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleJoin = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      const res = await fetch(LIVEKIT_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // ✅ match backend field
      });

      const data = await res.json();
      if (!data.token) throw new Error("Token not received");

      onJoin({ name, token: data.token });
      navigate("/speak");
    } catch (err) {
      console.error(err);
      setError("Failed to join: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">🎧 Join LiveKit Room</h1>

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
