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
import "./OfficialGameInterface.css";
import api from "api/axios";
import { useParams } from "react-router-dom";
import { type AddPointRequest } from "types/requests";
import type { PointType, PlayerColor } from "types/models";

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
  const [playerColor, setPlayerColor] = useState<PlayerColor>("red");

  const { id } = useParams();

  const buttonToTypeMap: Record<string, PointType> = {
    M: "men",
    K: "kote",
    D: "do",
    T: "tsuki",
    "&Delta;": "hansoku"
  };

  const selectedPointType = buttonToTypeMap[selectedButton];

  const updateCell = (row: number, column: number, value: string): void => {
    setCells((prevCells) => {
      const newRows = [...prevCells.rows];
      newRows[row][column] = value;
      return { rows: newRows };
    });
  };

  const pointRequest: AddPointRequest = {
    pointType: selectedPointType,
    pointColor: playerColor
  };

  const handlePointShowing = async (): Promise<void> => {
    if (currentPlayer !== null) {
      const row = pointCounter;
      const column = currentPlayer - 1;
      updateCell(row, column, selectedButton);
      setOpen(false);
      setCurrentPlayer(null);
      setPointCounter((prevCounter) => prevCounter + 1);
    }
    if (id !== undefined) {
      await apiPointRequest(id, pointRequest);
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
    if (player === 1) {
      setPlayerColor("white");
    }
    if (player === 2) {
      setPlayerColor("red");
    }
  };

  const apiPointRequest = async (
    matchId: string,
    body: AddPointRequest
  ): Promise<void> => {
    try {
      console.log("Point sent", pointRequest);
      await api.match.addPoint(matchId, body);
    } catch (error) {
      console.error("Data couldn't be sent", error);
    }
  };

  const apiTimerRequest = async (matchId: string): Promise<void> => {
    try {
      if (!isTimerRunning) {
        console.log("Start sent", pointRequest);
        await api.match.startTimer(matchId);
      } else {
        console.log("Stop sent", pointRequest);
        await api.match.stopTimer(matchId);
      }
    } catch (error) {
      console.error("Data couldn't be sent", error);
    }
  };

  const handleTimerChange = async (): Promise<void> => {
    /* TODO: Somehow manage the match API's elapsedTime when timer stops */
    setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);
    if (id !== undefined) {
      await apiTimerRequest(id);
    }
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
        <Box display="flex" gap="20px" justifyContent="center">
          <Box className="playerBox" bgcolor="white">
            <Typography variant="h3">Player 1</Typography>
          </Box>
          <Box className="playerBox" bgcolor="#db4744">
            <Typography variant="h3">Player 2</Typography>
          </Box>
        </Box>
        <Box display="flex" gap="20px" justifyContent="center">
          <Typography className="timer" variant="h1">
            {formatTime(timer)}
          </Typography>
          <Button onClick={handleTimerChange}>
            {isTimerRunning ? "Stop" : "Start"}
          </Button>
        </Box>
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
        <br></br>
        <div className="addButtonContainer">
          <Box display="flex" gap="20px" justifyContent="center">
            <Button
              className="button1"
              onClick={() => {
                handleOpen(1);
              }}
              variant="contained"
            >
              Add point for player 1
            </Button>
            <Button
              className="button2"
              onClick={() => {
                handleOpen(2);
              }}
              variant="contained"
            >
              Add point for player 2
            </Button>
          </Box>
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
                onClick={async () => {
                  await handlePointShowing();
                }}
                disabled={!selectedButton}
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
