/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Room, createLocalAudioTrack } from "livekit-client";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

function SpeechToText({ userName, token }) {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState([]);
  const [resolved, setResolved] = useState([]); 
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);
  const lastTranscriptRef = useRef("");

  const user = JSON.parse(localStorage.getItem("user")); 
  useEffect(() => {
    fetchUnresolved();
    if (user?._id) fetchResolved();
  }, []);

  const fetchUnresolved = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/unresolved", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUnresolved(data || []);
    } catch (err) {
      console.error("Error fetching unresolved:", err);
    }
  };

  const fetchResolved = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/unresolved/resolved/${user?._id || userName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setResolved(data || []);
    } catch (err) {
      console.error("Error fetching resolved:", err);
    }
  };

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
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript.trim();
      console.log("User said:", text);
      if (!speakingRef.current && text !== lastTranscriptRef.current) {
        lastTranscriptRef.current = text;
        setTranscript(text);
        handleAIResponse(text);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
    };

    recognition.onend = () => {
      if (!speakingRef.current && connected) {
        recognition.start();
      }
    };

    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const handleAIResponse = async (questionText) => {
    try {
      stopSpeechRecognition();

      const res = await fetch("http://localhost:5000/api/kb/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ question: questionText }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I don’t have an answer for that.";

      setAiReply(reply);

      if (reply.includes("didn't understand")) {
        setAiReply("⏳ Waiting for Human Assistant to respond...");
        await fetchUnresolved();
      } else {
        await fetchResolved(); 
      }

      await speakAIReply(reply);
      startSpeechRecognition();
    } catch (error) {
      console.error("Error getting AI response:", error);
      startSpeechRecognition();
    }
  };

  const speakAIReply = (text) => {
    return new Promise((resolve) => {
      speakingRef.current = true;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        speakingRef.current = false;
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const disconnectRoom = async () => {
    if (room) await room.disconnect();
    stopSpeechRecognition();
    setConnected(false);
    setTranscript("");
    setAiReply("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎙️ AI Voice Receptionist</h1>

      {!connected ? (
        <button
          onClick={connectToRoom}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-lg"
        >
          🎤 Start Talking
        </button>
      ) : (
        <button
          onClick={disconnectRoom}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl shadow-md text-lg"
        >
          🛑 Stop
        </button>
      )}

      <div className="mt-6 w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl mb-3 font-semibold">You Said:</h2>
        <div className="bg-gray-900 p-4 rounded-lg h-24 overflow-y-auto text-gray-300">
          {transcript || "Say something..."}
        </div>

        <h2 className="text-xl mt-6 mb-3 font-semibold">AI Reply:</h2>
        <div className="bg-gray-900 p-4 rounded-lg h-24 overflow-y-auto text-green-300">
          {aiReply || "AI is waiting for your question..."}
        </div>
      </div>

{/* 🔄 Split Layout: Unresolved (left) | Resolved (right) */}
<div className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 🕓 Unresolved Questions */}
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">🕓 Pending Queries</h2>
    {unresolved.length > 0 ? (
      <ul className="space-y-3">
        {unresolved.map((item) => (
          <li
            key={item._id}
            className="bg-gray-900 p-4 rounded-lg text-gray-200"
          >
            Question: {item.question}
            <p className="text-sm mt-1 text-gray-400">
              Status: Waiting for Human Assistant...
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No pending questions.</p>
    )}
  </div>

  
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">✅ Resolved Answers</h2>
    {resolved.length > 0 ? (
      <ul className="space-y-3">
        {resolved.map((item) => (
          <li
            key={item._id}
            className="bg-gray-900 p-4 rounded-lg text-gray-200"
          >
            Question: {item.question}
            <p className="text-sm mt-1 text-green-400">
              Answer {item.answer}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No resolved questions yet.</p>
    )}
  </div>
</div>


      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}

export default SpeechToText;
