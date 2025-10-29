/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Room, createLocalAudioTrack } from "livekit-client";

const LIVEKIT_URL = "wss://ai-kqzq9tkp.livekit.cloud";

function SpeechToText({ userName, token, onLeave }) {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const connectToRoom = async () => {
    try {
      if (!token) {
        setError("Missing token");
        return;
      }

      const room = new Room();
      await room.connect(LIVEKIT_URL, token);
      setRoom(room);
      setConnected(true);
      console.log(`✅ ${userName} connected to LiveKit`);

      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);

      startSpeechRecognition();
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect: " + err.message);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
    };

    recognition.start();
  };

  const disconnectRoom = async () => {
    if (room) await room.disconnect();
    setConnected(false);
    setTranscript("");
    // onLeave();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎙️ AI Voice Receptionist</h1>

      {!connected ? (
        <button
          onClick={connectToRoom}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-lg"
        >
          🎙️
        </button>
      ) : (
        <button
          onClick={disconnectRoom}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl shadow-md text-lg"
        >
          Stop Recording
        </button>
      )}

      {/* {error && <p className="text-red-400 mt-4">{error}</p>} */}

      <div className="mt-6 w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-3 font-semibold">Live Transcript:</h2>
        <div className="bg-gray-900 p-4 rounded-lg h-48 overflow-y-auto text-gray-300">
          {transcript || "Speak something..."}
        </div>
      </div>
    </div>
  );
}

export default SpeechToText;
