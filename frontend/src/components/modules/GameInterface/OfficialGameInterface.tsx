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
  FormControlLabel
} from "@mui/material";
import "../../common/Style/common.css";

interface Cells {
  R1C1: string;
  R1C2: string;
  R2C1: string;
  R2C2: string;
  R3C1: string;
  R3C2: string;
  R4C1: string;
  R4C2: string;
  R5C1: string;
  R5C2: string;
}

const OfficialGameInterface: React.FC = () => {
  const [cells, setCell] = useState<Cells>({
    R1C1: "",
    R1C2: "",
    R2C1: "K",
    R2C2: "",
    R3C1: "",
    R3C2: "",
    R4C1: "",
    R4C2: "",
    R5C1: "",
    R5C2: ""
  });

  const [open, setOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [timer, setTimer] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const updateCell = (cellKey: string, value: string): void => {
    setCell((prevCells) => ({
      ...prevCells,
      [cellKey]: value
    }));
  };

  const handlePointShowing = (): void => {
    /* TODO: Check player's color and set column based on that.
        Check match point count to determine the row the point is marked to.
        The row is match point count + 1.
        Add a check for 2 hansokus to add the other player a point.
        Add a check for player's point count and end game if 2 points.
        */
    const row = "3";
    const column = "1";
    const cell = "R" + row + "C" + column;
    updateCell(cell, selectedButton);

    setOpen(false);
  };

  const handleRadioButtonClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedButton(event.target.value);
  };

  const handleOpen = (): void => {
    setSelectedButton("");
    setOpen(true);
  };

  const handleTimerChange = (): void => {
    /* TODO: Somehow manage the match API's elapsedTime when timer stops */
    setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerRunning]);

  return (
    <div className="app-container">
      <main className="main-content">
        <div>
          <Typography variant="h1">
            {/* get real names */}
            Player 1 Player 2
          </Typography>
        </div>
        <div>
          <Typography variant="h1">{formatTime(timer)}</Typography>
          <Button onClick={handleTimerChange}>
            {isTimerRunning ? "Stop" : "Start"}
          </Button>
        </div>
        <div>
          <Table>
            <TableBody>
              {/* Get points here */}
              <TableRow>
                <TableCell>{cells.R1C1}</TableCell>
                <TableCell>{cells.R1C2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{cells.R2C1}</TableCell>
                <TableCell>{cells.R2C2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{cells.R3C1}</TableCell>
                <TableCell>{cells.R3C2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{cells.R4C1}</TableCell>
                <TableCell>{cells.R4C2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{cells.R5C1}</TableCell>
                <TableCell>{cells.R5C2}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <Button onClick={handleOpen}>Add point for player 1</Button>
          <Button onClick={handleOpen}>Add point for player 2</Button>
          <Dialog open={open}>
            <DialogTitle>Select a Point</DialogTitle>
            <DialogContent>
              <RadioGroup
                aria-label="point"
                name="point"
                value={selectedButton}
                onChange={handleRadioButtonClick}
              >
                <FormControlLabel value="M" control={<Radio />} label="M" />
                <FormControlLabel value="K" control={<Radio />} label="K" />
                <FormControlLabel value="D" control={<Radio />} label="D" />
                <FormControlLabel value="T" control={<Radio />} label="T" />
                <FormControlLabel
                  value="&Delta;"
                  control={<Radio />}
                  label="&Delta;"
                />
              </RadioGroup>
              <Button
                onClick={() => {
                  handlePointShowing();
                }}
              >
                OK
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <Typography>{/* text when match ends */}</Typography>
        </div>
      </main>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default OfficialGameInterface;
