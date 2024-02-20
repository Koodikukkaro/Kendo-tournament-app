import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import PointTable from "./PointTable";
import Timer from "./Timer";
import OfficialButtons from "./OfficialButtons";
import TimerButton from "./TimerButton";
import api from "api/axios";
import { useParams } from "react-router-dom";
import { type AddPointRequest } from "types/requests";
import type { PointType, PlayerColor, Match, MatchPlayer } from "types/models";
import "./GameInterface.css";
import { useAuth } from "context/AuthContext";
import { joinMatch, leaveMatch } from "sockets/emit";
import { useSocket } from "context/SocketContext";
import useToast from "hooks/useToast";
import { useTournament } from "context/TournamentContext";
import Loader from "components/common/Loader";
import ErrorModal from "components/common/ErrorModal";
import { useTranslation } from "react-i18next";

export interface MatchData {
  timerTime: number;
  players: MatchPlayer[];
  playerNames: string[];
  winner: string | undefined;
  officials: string[];
}

const GameInterface: React.FC = () => {
  const { t } = useTranslation();

  const [matchInfo, setMatchInfo] = useState<MatchData>({
    timerTime: 300,
    players: [],
    playerNames: [],
    winner: undefined,
    officials: []
  });

  const [open, setOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [timer, setTimer] = useState<number>(matchInfo.timerTime);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<PlayerColor>("red");
  const [hasJoined, setHasJoined] = useState(false);

  const { matchId } = useParams();
  const { userId } = useAuth();
  const { matchInfo: matchInfoFromSocket } = useSocket();
  const showToast = useToast();
  const tournament = useTournament();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (matchId !== undefined && !hasJoined) {
      joinMatch(matchId);
      setHasJoined(true);

      return () => {
        leaveMatch(matchId);
        setHasJoined(false);
      };
    }
  }, [matchId]);

  useEffect(() => {
    const getMatchData = async (): Promise<void> => {
      try {
        let matchPlayers: MatchPlayer[] = [];
        const playersNames: string[] = [];
        let matchWinner: string | undefined;
        let officialId: string[] = [];
        let time: number = 0;

        const findPlayerName = (playerId: string, index: number): void => {
          const player = tournament.players.find((p) => p.id === playerId);
          if (player !== undefined) {
            playersNames[index] = player.firstName;
          }
        };

        if (matchInfoFromSocket !== undefined) {
          matchPlayers = matchInfoFromSocket.players;
          findPlayerName(matchPlayers[0].id, 0);
          findPlayerName(matchPlayers[1].id, 1);

          if (matchInfoFromSocket.winner !== undefined) {
            const winner = tournament.players.find(
              (p) => p.id === matchInfoFromSocket.winner
            );
            if (winner !== undefined) {
              matchWinner = winner.firstName;
            }
          }
          if (matchInfoFromSocket.officials !== undefined) {
            officialId = matchInfoFromSocket.officials;
          }
          time = 300 - Math.round(matchInfoFromSocket.elapsedTime / 1000);
        } else if (matchId !== undefined) {
          const matchFromApi: Match = await api.match.info(matchId);

          if (matchFromApi !== undefined) {
            matchPlayers = matchFromApi.players;
            findPlayerName(matchPlayers[0].id, 0);
            findPlayerName(matchPlayers[1].id, 1);

            if (matchFromApi.winner !== undefined) {
              const winner = tournament.players.find(
                (p) => p.id === matchFromApi.winner
              );
              if (winner !== undefined) {
                matchWinner = winner.firstName;
              }
            }
            if (matchFromApi.officials !== undefined) {
              officialId = matchFromApi.officials;
            }
            time = 300 - Math.ceil(matchFromApi.elapsedTime / 1000);
          }
        }
        setMatchInfo({
          timerTime: time,
          players: matchPlayers,
          playerNames: playersNames,
          winner: matchWinner,
          officials: officialId
        });
      } catch (error) {
        setIsError(true);
        showToast(error, "error");
      } finally {
        setIsLoading(false);
      }
    };
    void getMatchData();
  }, [isLoading, matchInfoFromSocket]);

  useEffect(() => {
    setTimer(matchInfo.timerTime);
  }, [matchInfo]);

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
  }, [isTimerRunning, matchInfo.timerTime]);

  const buttonToTypeMap: Record<string, PointType> = {
    M: "men",
    K: "kote",
    D: "do",
    T: "tsuki",
    "\u0394": "hansoku"
  };

  const selectedPointType = buttonToTypeMap[selectedButton];

  const pointRequest: AddPointRequest = {
    pointType: selectedPointType,
    pointColor: playerColor
  };

  const handlePointShowing = async (): Promise<void> => {
    setOpen(false);
    if (matchId !== undefined) {
      if (isTimerRunning) {
        setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);
        await apiTimerRequest(matchId);
      }
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
      await api.match.addPoint(matchId, body);
    } catch (error) {
      showToast(error, "error");
    }
  };

  const apiTimerRequest = async (matchId: string): Promise<void> => {
    try {
      if (!isTimerRunning) {
        await api.match.startTimer(matchId);
      } else {
        await api.match.stopTimer(matchId);
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleTimerChange = async (): Promise<void> => {
    setIsTimerRunning((prevIsTimerRunning) => !prevIsTimerRunning);
    if (matchId !== undefined) {
      await apiTimerRequest(matchId);
    }
  };

  function handleClose(): void {
    setOpen(false);
  }

  return (
    <div className="app-container">
      <main className="main-content">
        {isLoading && <Loader />}
        {isError && (
          <ErrorModal
            open={isError}
            onClose={() => {
              setIsError(false);
            }}
            errorMessage={t("messages.unexpected_error_happened")}
          />
        )}
        {!isLoading && !isError && (
          <>
            <Box display="flex" gap="20px" justifyContent="center">
              <Box className="playerBox" bgcolor="white">
                <Typography variant="h3">{matchInfo.playerNames[0]}</Typography>
              </Box>
              <Box className="playerBox" bgcolor="#db4744">
                <Typography variant="h3">{matchInfo.playerNames[1]}</Typography>
              </Box>
            </Box>
            <Box display="flex" gap="20px" justifyContent="center">
              <Timer timer={timer} />
              {userId !== null &&
                userId !== undefined &&
                matchInfo.winner === undefined && (
                  <TimerButton
                    isTimerRunning={isTimerRunning}
                    handleTimerChange={handleTimerChange}
                  />
                )}
            </Box>
            <PointTable matchInfo={matchInfo} />
            <br></br>
            {userId !== null &&
              userId !== undefined &&
              matchInfo.winner === undefined && (
                <OfficialButtons
                  open={open}
                  selectedButton={selectedButton}
                  handleRadioButtonClick={handleRadioButtonClick}
                  handlePointShowing={handlePointShowing}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                />
              )}
            {matchInfo.winner !== undefined && (
              <div>
                <Typography>
                  {t("game_interface.player")} {matchInfo.winner}{" "}
                  {t("game_interface.wins")}
                </Typography>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GameInterface;
