import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "./OfficialGameInterface.css";
import { joinMatch, leaveMatch } from "sockets/emit";
// import { useSocket } from "context/SocketContext";
import { useParams } from "react-router-dom";

const GameInterface: React.FC = () => {
  const [timer, setTimer] = useState<number | undefined>();

  const { matchId } = useParams();

  //  const { matchInfo } = useSocket();

  useEffect(() => {
    if (matchId !== undefined) {
      joinMatch(matchId);
    }

    return () => {
      if (matchId !== undefined) {
        leaveMatch(matchId);
      }
    };
  }, []);

  return (
    <main className="main-content">
      <Box display="flex" gap="20px" justifyContent="center">
        <Box className="playerBox" bgcolor="white">
          <Typography variant="h3">Player 1</Typography>
        </Box>
        <Box className="playerBox" bgcolor="#db4744">
          <Typography variant="h3">Player 2</Typography>
        </Box>
      </Box>
      <div className="timerContainer">
        <Typography className="timer" variant="h1">
          timer: {timer}
          {formatTime(timer)}
        </Typography>
      </div>
      <div>
        <Typography>{/* text when match ends */}</Typography>
      </div>
    </main>
  );
};

const formatTime = (seconds: number | undefined): string => {
  if (typeof seconds === "undefined") {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default GameInterface;
