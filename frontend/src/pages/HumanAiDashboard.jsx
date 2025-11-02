import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HumanAIDashboard = () => {
  const [unresolved, setUnresolved] = useState([]);
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/humanai-login");
      return;
    }

    const fetchUnresolved = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/unresolved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnresolved(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnresolved();
  }, [token, navigate]);

  const handleSubmit = async (id) => {
    const answer = responses[id];
    if (!answer) return alert("Please enter an answer first.");

    try {
      await axios.post(
        `http://localhost:5000/api/unresolved/resolve/${id}`,
        { answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Answer submitted successfully!");
      setUnresolved((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Failed to submit answer.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">HumanAI Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {unresolved.length === 0 ? (
        <p className="text-gray-600">No unresolved questions 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unresolved.map((q) => (
            <div key={q._id} className="bg-white p-5 rounded-2xl shadow-md">
              <p className="font-semibold text-gray-800 mb-2">
                Q: {q.question}
              </p>
              <textarea
                className="w-full border p-2 rounded-md mb-2 focus:ring focus:ring-blue-200"
                placeholder="Type your answer here..."
                value={responses[q._id] || ""}
                onChange={(e) =>
                  setResponses({ ...responses, [q._id]: e.target.value })
                }
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleSubmit(q._id)}
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HumanAIDashboard;
