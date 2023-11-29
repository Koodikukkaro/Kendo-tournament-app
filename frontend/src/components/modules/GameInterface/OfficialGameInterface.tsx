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
import { toggleTimer } from "../../../sockets/emit";

interface Cells {
  rows: string[][];
}

const OfficialGameInterface: React.FC = () => {
  const initialCells: Cells = {
    rows: [
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""]
    ]
  };

  const [cells, setCells] = useState<Cells>(initialCells);
  const [open, setOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [timer, setTimer] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const [pointCounter, setPointCounter] = useState<number>(0);

  const updateCell = (row: number, column: number, value: string): void => {
    setCells((prevCells) => {
      const newRows = [...prevCells.rows];
      newRows[row][column] = value;
      return { rows: newRows };
    });
  };

  const handlePointShowing = (): void => {
    if (currentPlayer !== null) {
      const row = pointCounter;
      const column = currentPlayer - 1;
      updateCell(row, column, selectedButton);
      setOpen(false);
      setCurrentPlayer(null);
      setPointCounter((prevCounter) => prevCounter + 1);
    }
  };

  const handleRadioButtonClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedButton(event.target.value);
  };

  const handleOpen = (player: number): void => {
    setSelectedButton("");
    setCurrentPlayer(player);
    setOpen(true);
  };

  const handleTimerChange = (): void => {
    /* TODO: Somehow manage the match API's elapsedTime when timer stops */
    setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);

    toggleTimer();
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
          <Box className="playerBox" bgcolor="white">
            <Typography variant="h1">Player 1</Typography>
          </Box>
          <Box className="playerBox" bgcolor="red">
            <Typography variant="h1">Player 2</Typography>
          </Box>
        </div>
        <div className="timerContainer">
          <Typography className="timer" variant="h1">
            {formatTime(timer)}
          </Typography>
          <Button onClick={handleTimerChange}>
            {isTimerRunning ? "Stop" : "Start"}
          </Button>
        </div>
        <div className="tableContainer">
          <Table>
            <TableBody>
              {cells.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <TableCell key={columnIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="addButtonContainer">
          <Button
            className="button1"
            onClick={() => {
              handleOpen(1);
            }}
          >
            Add point for player 1
          </Button>
          <Button
            className="button2"
            onClick={() => {
              handleOpen(2);
            }}
          >
            Add point for player 2
          </Button>
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
