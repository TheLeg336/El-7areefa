// src/Player.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Player = () => {
  const [teamId, setTeamId] = useState("");
  const [task, setTask] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [compassDirection, setCompassDirection] = useState("");

  // Get team ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("teamId");
    if (id) {
      setTeamId(id);
    }
  }, []);

  // Fetch task for the team from Firestore
  useEffect(() => {
    if (teamId) {
      const fetchTask = async () => {
        const q = query(
          collection(db, "tasks"),
          where("teamId", "==", teamId),
          where("completed", "==", false)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const taskData = querySnapshot.docs[0].data();
          setTask(taskData);
        }
      };
      fetchTask();
    }
  }, [teamId]);

  // Get player's current position
  useEffect(() => {
    const watchPosition = () => {
      navigator.geolocation.watchPosition(
        (position) => {
          setPlayerPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };
    watchPosition();
  }, []);

  // Calculate compass direction
  useEffect(() => {
    if (playerPosition && task?.coordinates) {
      const bearing = calculateBearing(
        playerPosition.lat,
        playerPosition.lng,
        task.coordinates.lat,
        task.coordinates.lng
      );
      setCompassDirection(getDirection(bearing));
    }
  }, [playerPosition, task]);

  // Helper function to calculate bearing
  const calculateBearing = (lat1, lng1, lat2, lng2) => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360
    return bearing;
  };

  // Helper function to convert bearing to compass direction
  const getDirection = (bearing) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((bearing / 45) % 8);
    return directions[index];
  };

  // Check if player is near the target
  const isNearTarget = () => {
    if (!playerPosition || !task?.coordinates) return false;
    const distance = calculateDistance(
      playerPosition.lat,
      playerPosition.lng,
      task.coordinates.lat,
      task.coordinates.lng
    );
    return distance < 10; // 10 meters
  };

  // Helper function to calculate distance
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div>
      <h2>Player Interface</h2>
      {task ? (
        <>
          <p>Compass Direction: {compassDirection}</p>
          {isNearTarget() && (
            <>
              <p>Task Description: {task.taskDescription}</p>
              <input type="file" accept="image/*" capture="camera" />
              <button>Submit Picture</button>
            </>
          )}
        </>
      ) : (
        <p>No task available for your team.</p>
      )}
    </div>
  );
};

export default Player;