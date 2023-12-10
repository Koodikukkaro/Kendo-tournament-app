import React from "react";
import { Button } from "@mui/material";

interface TimerButtonProps {
  isTimerRunning: boolean;
  handleTimerChange: () => void;
}

const TimerButton: React.FC<TimerButtonProps> = ({
  isTimerRunning,
  handleTimerChange
}) => {
  return (
    <Button
      onClick={handleTimerChange}
      variant="contained"
      style={{ height: "40px", marginTop: "40px" }}
    >
      {isTimerRunning ? "Stop" : "Start"}
    </Button>
  );
};

export default TimerButton;
