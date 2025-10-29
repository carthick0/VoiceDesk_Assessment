import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
import SpeechToText from "./components/SpeechToText";

function App() {
  const [userData, setUserData] = useState(null);

  const handleJoin = ({ name, token }) => {
    setUserData({ name, token });
  };

  const handleLeave = () => {
    setUserData(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom onJoin={handleJoin} />} />
        <Route
          path="/speak"
          element={
            userData ? (
              <SpeechToText
                userName={userData.name}
                token={userData.token}
                onLeave={handleLeave}
              />
            ) : (
              <JoinRoom onJoin={handleJoin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
