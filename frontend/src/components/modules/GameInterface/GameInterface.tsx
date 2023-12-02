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
import { useAuth } from "context/AuthContext";

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

  const { id: matchId } = useParams();
  const { userId } = useAuth();
  let matchInfo: Match = {
    id: "",
    timerStartedTimestamp: null,
    elapsedTime: 0,
    type: "group",
    players: [],
    admin: ""
  };
  const players: string[] = [];
  let officialId: string = "";
  let winner: string | undefined;

  const buttonToTypeMap: Record<string, PointType> = {
    M: "men",
    K: "kote",
    D: "do",
    T: "tsuki",
    "\u0394": "hansoku"
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
    if (matchId !== undefined) {
      await apiPointRequest(matchId, pointRequest);
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
    if (matchId !== undefined) {
      await apiTimerRequest(matchId);
    }
  };

  useEffect(() => {
    const getMatchData = async (): Promise<void> => {
      try {
        if (matchId !== undefined) {
          matchInfo = await api.match.info(matchId);
          players[0] = (
            await api.user.details(matchInfo.players[0].id)
          ).firstName;
          players[1] = (
            await api.user.details(matchInfo.players[1].id)
          ).firstName;
          if (matchInfo.winner !== undefined) {
            winner = (await api.user.details(matchInfo.winner)).firstName;
          }
          if (matchInfo.officials !== undefined) {
            officialId = matchInfo.officials;
          }
        }
      } catch (error) {
        console.error("Data couldn't be fetched", error);
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
  }, [isTimerRunning, matchInfo, winner]);

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
          {userId === officialId && (
            <TimerButton
              isTimerRunning={isTimerRunning}
              handleTimerChange={handleTimerChange}
            />
          )}
        </Box>
        <PointTable cells={cells.rows} />
        <br></br>
        {userId === officialId && (
          <OfficialButtons
            open={open}
            selectedButton={selectedButton}
            handleRadioButtonClick={handleRadioButtonClick}
            handlePointShowing={handlePointShowing}
            handleOpen={handleOpen}
          />
        )}
        {winner !== undefined && (
          <div>
            <Typography>{winner} wins!</Typography>
          </div>
        )}
      </main>
    </div>
  );
};

export default GameInterface;
