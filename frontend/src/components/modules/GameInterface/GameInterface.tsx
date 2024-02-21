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
  endTimeStamp: Date | undefined;
}

const GameInterface: React.FC = () => {
  const { t } = useTranslation();

  const [matchInfo, setMatchInfo] = useState<MatchData>({
    timerTime: 300,
    players: [],
    playerNames: [],
    winner: undefined,
    officials: [],
    endTimeStamp: undefined
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

  // Listening to matches websocket
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

  // Fetching match data
  useEffect(() => {
    const getMatchData = async (): Promise<void> => {
      try {
        let matchPlayers: MatchPlayer[] = [];
        const playersNames: string[] = [];
        let matchWinner: string | undefined;
        let officialId: string[] = [];
        let time: number = 0;
        let matchEndTimeStamp: Date | undefined;

        // Get players' names
        const findPlayerName = (playerId: string, index: number): void => {
          const player = tournament.players.find((p) => p.id === playerId);
          if (player !== undefined) {
            playersNames[index] = player.firstName;
          }
        };

        // Try to get match info from the websocket
        if (matchInfoFromSocket !== undefined) {
          console.log(matchInfoFromSocket)
          // Get players' names in this match
          matchPlayers = matchInfoFromSocket.players;
          findPlayerName(matchPlayers[0].id, 0);
          findPlayerName(matchPlayers[1].id, 1);
          console.log(matchInfoFromSocket.endTimestamp);
          // If there is a winner, save them
          if (matchInfoFromSocket.winner !== undefined) {
            const winner = tournament.players.find(
              (p) => p.id === matchInfoFromSocket.winner
            );
            if (winner !== undefined) {
              matchWinner = winner.firstName;
            }
          }
          
          // If there isn't a winner, check if there is an end timestamp (it's a tie)
          else if (matchInfoFromSocket.endTimestamp !== undefined) {
            matchEndTimeStamp = matchInfoFromSocket.endTimestamp;
          }
          // Get officials
          if (matchInfoFromSocket.officials !== undefined) {
            officialId = matchInfoFromSocket.officials;
          }
          // Get time
          time = 300 - Math.round(matchInfoFromSocket.elapsedTime / 1000);
        } // If websocket doesn't have match info, use api
        // Usually this is the first time the match view is loaded
        else if (matchId !== undefined) {
          const matchFromApi: Match = await api.match.info(matchId);

          if (matchFromApi !== undefined) {
            matchPlayers = matchFromApi.players;
            findPlayerName(matchPlayers[0].id, 0);
            findPlayerName(matchPlayers[1].id, 1);

            // If there is a winner, save them
            if (matchFromApi.winner !== undefined) {
              const winner = tournament.players.find(
                (p) => p.id === matchFromApi.winner
              );
              if (winner !== undefined) {
                matchWinner = winner.firstName;
              }
            }
            // If there isn't a winner, check if there is an end timestamp (it's a tie)
            else if (matchFromApi.endTimestamp !== undefined) {
              matchEndTimeStamp = matchFromApi.endTimestamp;
              console.log("We have a enTimeStamp");
            }
            if(matchFromApi.endTimestamp === undefined) {
              console.log("no endtimestamp");
            }
            // Get officials
            if (matchFromApi.officials !== undefined) {
              officialId = matchFromApi.officials;
            }
            // Get time
            time = 300 - Math.ceil(matchFromApi.elapsedTime / 1000);
          }
        }
        setMatchInfo({
          timerTime: time,
          players: matchPlayers,
          playerNames: playersNames,
          winner: matchWinner,
          officials: officialId,
          endTimeStamp: matchEndTimeStamp
        });
        {console.log(matchInfo.endTimeStamp)}
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

  // Handle timer, make it run and stop
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

  // If timer is ended, check for ties
  useEffect(() => {
    const checkForTieAndStopTimer = async () => {
      if (timer === 0 && matchId !== undefined) {
        try {
          await api.match.checkForTie(matchId);
        } catch (error) {
          showToast(error, "error");
        }
        setIsTimerRunning(false);
      }
    };
  
    checkForTieAndStopTimer();
  }, [timer]);

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

  // When point is selected, close the selection and send it to API
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

  // Get the selected radio button value
  const handleRadioButtonClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedButton(event.target.value);
  };

  // Open the radio button selection for points
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

  // Send the point to the API (add it to the match)
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

  // Send timer starts and stops to API
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

  // When timer button is clicked, set its status
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
                matchInfo.endTimeStamp === undefined && (
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
              matchInfo.endTimeStamp === undefined && (
                <OfficialButtons
                  open={open}
                  selectedButton={selectedButton}
                  handleRadioButtonClick={handleRadioButtonClick}
                  handlePointShowing={handlePointShowing}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                />
              )}
            
              {/*test*/}
              <Typography>Timer variable: {timer}</Typography>
            { /* Print the winner*/}
            {matchInfo.winner !== undefined && (
              <div>
                <Typography>
                  {t("game_interface.player")} {matchInfo.winner}{" "}
                  {t("game_interface.wins")}
                </Typography>
              </div>
            )}
            { /* If there isn't a winner, check if there is an end timestamp (it's a tie)*/}
            {matchInfo.winner === undefined && matchInfo.endTimeStamp !== undefined && (
              <div>
                <Typography>It&apos;s a tie!</Typography>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GameInterface;
