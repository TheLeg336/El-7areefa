// src/OwnerDashboard.js
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const OwnerDashboard = () => {
  const [teamId, setTeamId] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [taskDescription, setTaskDescription] = useState("");
  const [reward, setReward] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), {
        teamId,
        coordinates,
        taskDescription,
        reward,
        completed: false,
      });
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Team ID:
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Latitude:
          <input
            type="number"
            step="any"
            value={coordinates.lat}
            onChange={(e) =>
              setCoordinates({ ...coordinates, lat: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          Longitude:
          <input
            type="number"
            step="any"
            value={coordinates.lng}
            onChange={(e) =>
              setCoordinates({ ...coordinates, lng: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          Task Description:
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Reward:
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default OwnerDashboard;