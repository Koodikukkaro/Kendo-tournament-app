import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import PointTable from "./PointTable";
import Timer from "./Timer";
import OfficialButtons from "./OfficialButtons";
import TimerButton from "./TimerButton";
import api from "api/axios";
import { useParams } from "react-router-dom";
import { type AddPointRequest } from "types/requests";
import type { PointType, PlayerColor, Match } from "types/models";
import "./GameInterface.css";

interface Cells {
  rows: string[][];
}

const GameInterface: React.FC = () => {
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
  let matchInfo: Match;
  const players: string[] = [];
  let winner: string;

  // TODO: Delta doesn't transform to PointType
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
    setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);
    if (id !== undefined) {
      await apiTimerRequest(id);
    }
  };

  useEffect(() => {
    const getMatchData = async (): Promise<void> => {
      if (id !== undefined) {
        matchInfo = await api.match.info(id);
        players[0] = (
          await api.user.details(matchInfo.players[0].id)
        ).firstName;
        players[1] = (
          await api.user.details(matchInfo.players[1].id)
        ).firstName;
        // TODO: Add websocket listener for winner?
        if (matchInfo.winner !== undefined) {
          winner = (await api.user.details(matchInfo.winner)).firstName;
        }
      }
    };
    void getMatchData();

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
            <Typography variant="h3">Player 1 {players[0]}</Typography>
          </Box>
          <Box className="playerBox" bgcolor="#db4744">
            <Typography variant="h3">Player 2 {players[1]}</Typography>
          </Box>
        </Box>
        <Box display="flex" gap="20px" justifyContent="center">
          <Timer timer={timer} />
          {/** TODO: Only show this when user is an official */}
          <TimerButton
            isTimerRunning={isTimerRunning}
            handleTimerChange={handleTimerChange}
          />
        </Box>
        <PointTable cells={cells.rows} />
        <br></br>
        {/** TODO: Only show this when user is an official */}
        <OfficialButtons
          open={open}
          selectedButton={selectedButton}
          handleRadioButtonClick={handleRadioButtonClick}
          handlePointShowing={handlePointShowing}
          handleOpen={handleOpen}
        />
        {/** TODO: Only show this when match is finished */}
        <div>
          <Typography>{/* {winner} */} wins!</Typography>
        </div>
      </main>
    </div>
  );
};

export default GameInterface;
