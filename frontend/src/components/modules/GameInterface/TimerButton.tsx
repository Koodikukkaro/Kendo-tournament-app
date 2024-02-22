import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TimerButtonProps {
  isTimerRunning: boolean;
  handleTimerChange: () => void;
}

const TimerButton: React.FC<TimerButtonProps> = ({
  isTimerRunning,
  handleTimerChange
}) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={handleTimerChange}
      variant="contained"
      style={{ height: "40px", marginTop: "40px" }}
    >
      {isTimerRunning ? t("buttons.stop_timer") : t("buttons.start_timer")}
    </Button>
  );
};

export default TimerButton;
