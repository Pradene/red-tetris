import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { matchmakingRequest } from "../api/matchmaking";

import { GameMode } from "../types/define";

import styles from "./Matchmaking.module.css";

const Matchmaking: React.FC = () => {
  const { mode } = useParams<{ mode: "multiplayer" | "survival" }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [status, setStatus] = useState("Searching for match...");
  const navigate = useNavigate();

  useEffect(() => {
    const startMatchmaking = async () => {
      try {
        console.log("Starting matchmaking for mode:", mode);
        const [response, data] = await matchmakingRequest(mode as GameMode, user);
        
        console.log("Server response:", response, "Data:", data);
        
        if (response.ok && data.roomId) {
          console.log("Navigating to game room:", data.roomId);
          navigate(`/${data.roomId}/${user.username}`, { replace: true });
        
        } else {
          console.error("Matchmaking failed:", data.error);
          setStatus(data.error || "Failed to find match");
        }

      } catch (error) {
        console.error("Request error:", error);
        setStatus("Connection error. Try again.");
        navigate("/", { replace: true });
      }
    };

    if (mode && user?.username) {
      startMatchmaking();
    }
  }, [mode, user, navigate]);
  
  return (
    <div className={styles.matchmaking}>
      <h2>{status}</h2>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
};

export default Matchmaking