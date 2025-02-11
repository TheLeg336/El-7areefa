// src/App.js
import React from "react";
import OwnerDashboard from "./OwnerDashboard";
import Player from "./Player";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId");

  return (
    <div className="App">
      {teamId ? <Player /> : <OwnerDashboard />}
    </div>
  );
}

export default App;