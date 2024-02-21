import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
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
  timeKeeper: string | undefined;
  pointMaker: string | undefined;
  startTimestamp: Date | undefined;
  isTimerOn: boolean;
}

const GameInterface: React.FC = () => {
  const { t } = useTranslation();

  const [matchInfo, setMatchInfo] = useState<MatchData>({
    timerTime: 300,
    players: [],
    playerNames: [],
    winner: undefined,
    timeKeeper: undefined,
    pointMaker: undefined,
    startTimestamp: undefined,
    isTimerOn: false
  });

  const [openPoints, setOpenPoints] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [timer, setTimer] = useState<number>(matchInfo.timerTime);
  const [playerColor, setPlayerColor] = useState<PlayerColor>("red");
  const [hasJoined, setHasJoined] = useState(false);

  const { matchId } = useParams();
  const { userId } = useAuth();
  const { matchInfo: matchInfoFromSocket } = useSocket();
  const showToast = useToast();
  const tournament = useTournament();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  // state handlers for whether or not checkbox is checked
  const [timeKeeper, setTimeKeeper] = useState<boolean>(false);
  const [pointMaker, setPointMaker] = useState<boolean>(false);

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
        let timerPerson: string | undefined;
        let pointPerson: string | undefined;
        let time: number = 0;
        let startTime: Date | undefined;
        let timer: boolean = false;

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
          if (matchInfoFromSocket.timeKeeper !== undefined) {
            timerPerson = matchInfoFromSocket.timeKeeper;
          }
          if (matchInfoFromSocket.pointMaker !== undefined) {
            pointPerson = matchInfoFromSocket.pointMaker;
          }
          if (matchInfoFromSocket.startTimestamp !== undefined) {
            startTime = matchInfoFromSocket.startTimestamp;
          }
          time = 300 - Math.round(matchInfoFromSocket.elapsedTime / 1000);
          timer = matchInfoFromSocket.isTimerOn;
          setTimeKeeper(matchInfoFromSocket.timeKeeper !== undefined);
          setPointMaker(matchInfoFromSocket.pointMaker !== undefined);
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
            if (matchFromApi.timeKeeper !== undefined) {
              timerPerson = matchFromApi.timeKeeper;
            }
            if (matchFromApi.pointMaker !== undefined) {
              pointPerson = matchFromApi.pointMaker;
            }
            if (matchFromApi.startTimestamp !== undefined) {
              startTime = matchFromApi.startTimestamp;
            }
            time = 300 - Math.ceil(matchFromApi.elapsedTime / 1000);
            timer = matchFromApi.isTimerOn;

            setTimeKeeper(matchInfo.timeKeeper !== undefined);
            setPointMaker(matchInfo.pointMaker !== undefined);
          }
        }
        setMatchInfo({
          timerTime: time,
          players: matchPlayers,
          playerNames: playersNames,
          winner: matchWinner,
          timeKeeper: timerPerson,
          pointMaker: pointPerson,
          startTimestamp: startTime,
          isTimerOn: timer
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

    if (matchInfo.isTimerOn) {
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
  }, [matchInfo]);

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
    // Check if both time keeper and point maker roles are checked
    setOpenPoints(false);
    if (
      matchInfo.timeKeeper === undefined &&
      matchInfo.pointMaker === undefined
    ) {
      showToast(t("messages.missing_both"), "error");
      return;
    }
    if (matchInfo.timeKeeper === undefined) {
      showToast(t("messages.missing_timekeeper"), "error");
      return;
    }

    if (matchId !== undefined) {
      if (matchInfo.isTimerOn) {
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
    setOpenPoints(true);
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
      if (!matchInfo.isTimerOn) {
        await api.match.startTimer(matchId);
      } else {
        await api.match.stopTimer(matchId);
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleTimerChange = async (): Promise<void> => {
    // Check if both time keeper and point maker roles are checked
    if (
      matchInfo.timeKeeper === undefined &&
      matchInfo.pointMaker === undefined
    ) {
      showToast(t("messages.missing_both"), "error");
      return;
    }
    if (matchInfo.pointMaker === undefined) {
      showToast(t("messages.missing_pointmaker"), "error");
      return;
    }
    if (matchId !== undefined) {
      await apiTimerRequest(matchId);
    }
  };

  const apiRoleRequest = async (
    matchId: string,
    userId: string
  ): Promise<void> => {
    try {
      if (matchId !== undefined) {
        // if checkbox is checked and no time keeper is set yet
        if (timeKeeper && matchInfo.timeKeeper === undefined) {
          await api.match.addTimekeeper(matchId, userId);
        }
        // if checkbox is not chcekd and time keeper is set
        else if (!timeKeeper && matchInfo.timeKeeper !== undefined) {
          await api.match.removeTimekeeper(matchId, userId);
        }

        // if checkbox is checked and no point maker is set yet
        if (pointMaker && matchInfo.pointMaker === undefined) {
          await api.match.addPointmaker(matchId, userId);
        }
        // if checkbox is not checked and point maker is set
        else if (!pointMaker && matchInfo.pointMaker !== undefined) {
          await api.match.removePointmaker(matchId, userId);
        }
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleRoleSave = async (): Promise<void> => {
    if (matchId !== undefined && userId !== undefined) {
      await apiRoleRequest(matchId, userId);
    }
    // close popup on save press
    setOpenRoles(false);
  };

  function handleClose(): void {
    setOpenPoints(false);
  }

  function handleCloseRoles(): void {
    setOpenRoles(false);
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
            {/* button is shown until the match is started */}
            {userId !== null &&
              userId !== undefined &&
              matchInfo.startTimestamp === undefined && (
                <>
                  {/* button is disabled if both roles are checked and user is not one of them */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenRoles(true);
                    }}
                    disabled={
                      matchInfo.timeKeeper !== undefined &&
                      matchInfo.pointMaker !== undefined &&
                      matchInfo.timeKeeper !== userId &&
                      matchInfo.pointMaker !== userId
                    }
                  >
                    {t("game_interface.select_role")}
                  </Button>
                  <br />
                  <br />
                </>
              )}
            <Dialog open={openRoles} onClose={handleCloseRoles}>
              <DialogTitle>{t("game_interface.select_role")}</DialogTitle>
              <DialogContent>
                {/* checkbox is shown if there is no time keeper yet
                  or if user is the time keeper */}
                {(matchInfo.timeKeeper === undefined ||
                  matchInfo.timeKeeper === userId) && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={timeKeeper}
                        onChange={() => {
                          setTimeKeeper(!timeKeeper);
                        }}
                      />
                    }
                    label={t("game_interface.time_keeper")}
                  />
                )}
                {/* checkbox is shown if there is no point maker yet
                  or if user is the point maker */}
                {(matchInfo.pointMaker === undefined ||
                  matchInfo.pointMaker === userId) && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={pointMaker}
                        onChange={() => {
                          setPointMaker(!pointMaker);
                        }}
                      />
                    }
                    label={t("game_interface.point_maker")}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseRoles}>
                  {t("buttons.cancel_button")}
                </Button>
                <Button onClick={handleRoleSave}>
                  {t("buttons.save_button")}
                </Button>
              </DialogActions>
            </Dialog>
            {/* elements shown only after match has started */}
            {userId !== null &&
              userId !== undefined &&
              matchInfo.startTimestamp !== undefined && (
                <>
                  {/* print time keeper and point maker names */}
                  <Typography variant="body2">
                    {t("game_interface.time_keeper")}:{" "}
                    {
                      tournament.players.find(
                        (p) => p.id === matchInfo.timeKeeper
                      )?.firstName
                    }
                    <br />
                    {t("game_interface.point_maker")}:{" "}
                    {
                      tournament.players.find(
                        (p) => p.id === matchInfo.pointMaker
                      )?.firstName
                    }
                  </Typography>
                  <br />
                  <br />
                </>
              )}
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
              {/* timer button only shown to time keeper */}
              {userId !== null &&
                userId !== undefined &&
                matchInfo.winner === undefined &&
                matchInfo.timeKeeper === userId && (
                  <TimerButton
                    isTimerRunning={matchInfo.isTimerOn}
                    handleTimerChange={handleTimerChange}
                  />
                )}
            </Box>
            <PointTable matchInfo={matchInfo} />
            <br></br>
            {/* point buttons only shown to point maker */}
            {userId !== null &&
              userId !== undefined &&
              matchInfo.winner === undefined &&
              matchInfo.pointMaker === userId && (
                <OfficialButtons
                  open={openPoints}
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
