import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box
} from "@mui/material";
import "../../common/Style/common.css";
import "./OfficialGameInterface.css";
import { socket } from "../../../sockets/index";



  interface TimerStateEvent {
    isTimerRunning: boolean;
    currentTime: string;
  };

  const TimerDisplay: React.FC = () => {
    const [timerState, setTimerState] = useState<TimerStateEvent>({
      isTimerRunning: false,
      currentTime: '',
    });
    const [timer, setTimer] = useState<number | undefined>();

    useEffect(() => {
        const handleTimerState = ({ isTimerRunning, currentTime }: TimerStateEvent) => {
            console.log(isTimerRunning, currentTime);
          setTimerState({ isTimerRunning, currentTime });
          setTimer(Number(currentTime));
        };
    
        socket.on('timer-state', (isTimerRunning, currentTime) => {
            console.log("Listening");
            console.log(isTimerRunning, currentTime);
            handleTimerState;
        });

        return () => {
          socket.off('timer-state', handleTimerState);
        };
      }, []);

  return (
    <main className="main-content">
      <div>
        <Box className="playerBox" bgcolor="white">
          <Typography variant="h1">Player 1</Typography>
        </Box>
        <Box className="playerBox" bgcolor="red">
          <Typography variant="h1">Player 2</Typography>
        </Box>
      </div>
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
    if (typeof seconds === 'undefined') {
      return '';
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  export default TimerDisplay;