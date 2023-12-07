import React, { useState, useEffect, type ReactNode, useRef } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from "@mui/material";
import "react-tabs/style/react-tabs.css";
import { type User, type Match } from "types/models";
import { useNavigate } from "react-router-dom";
import { useTournament } from "context/TournamentContext";

interface tournamentPlayer {
  id: string;
  name: string;
  wins: number;
  losses: number;
  points: number;
}

const RoundRobinTournamentView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("scoreboard");
  const [ongoingMatchElements, setOngoingMatchElements] = useState<ReactNode[]>(
    []
  );
  const [upcomingMatchElements, setUpcomingMatchElements] = useState<
    ReactNode[]
  >([]);
  const [pastMatchElements, setPastMatchElements] = useState<ReactNode[]>([]);

  const tournament = useTournament();
  const [players, setPlayers] = useState<tournamentPlayer[]>([]);
  let ongoingMatches: Match[] = [];
  let upcomingMatches: Match[] = [];
  let pastMatches: Match[] = [];

  const navigate = useNavigate();
  const initialRender = useRef(true);

  useEffect(() => {
    getPlayerNames();
    sortMatches();
    createMatchButtons();
  }, [tournament]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      updatePlayerStats();
    }
  }, []);

  const getPlayerNames = (): void => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      const playersObjects: User[] = tournament.players;
      if (playersObjects.length > 0) {
        for (const playerObject of playersObjects) {
          const playerExists = updatedPlayers.some(
            (player) => player.id === playerObject.id
          );
          if (!playerExists) {
            updatedPlayers.push({
              id: playerObject.id,
              name: playerObject.firstName,
              wins: 0,
              losses: 0,
              points: 0
            });
          }
        }
      }
      return updatedPlayers;
    });
  };

  const sortMatches = (): void => {
    const matches: Match[] = tournament.matchSchedule;
    if (matches.length > 0) {
      const sortedMatches = matches
        .filter((match) => match.elapsedTime !== undefined)
        .sort((a, b) => {
          return b.elapsedTime - a.elapsedTime;
        });
      ongoingMatches = sortedMatches.filter(
        (match) =>
          match.elapsedTime !== null &&
          match.elapsedTime > 0 &&
          match.winner === undefined
      );
      upcomingMatches = sortedMatches.filter(
        (match) =>
          (match.elapsedTime === null || match.elapsedTime <= 0) &&
          match.winner === undefined
      );
      pastMatches = sortedMatches.filter(
        (match) =>
          match.elapsedTime !== null &&
          match.elapsedTime > 0 &&
          match.winner !== undefined
      );
    }
  };

  const createMatchButtons = (): void => {
    const createMatchButton = (
      match: Match,
      variant: "contained" | "contained" | "contained",
      disabled?: boolean,
      color?: "secondary"
    ): JSX.Element => {
      const player1 = players.find(
        (player) => player.id === match.players[0].id
      )?.name;
      const player2 = players.find(
        (player) => player.id === match.players[1].id
      )?.name;

      return (
        <div style={{ marginBottom: "10px" }}>
          <Button
            variant={variant}
            onClick={() => {
              navigate(`/matches/${match.id}`);
            }}
            disabled={disabled}
            color={color}
          >
            {`${player1} - ${player2}`}
          </Button>
        </div>
      );
    };

    const ongoingElements = ongoingMatches.map((match, index) =>
      createMatchButton(match, "contained")
    );
    const upcomingElements = upcomingMatches.map((match, index) =>
      createMatchButton(match, "contained", true)
    );
    const pastElements = pastMatches.map((match, index) =>
      createMatchButton(match, "contained", false, "secondary")
    );

    setOngoingMatchElements(ongoingElements);
    setUpcomingMatchElements(upcomingElements);
    setPastMatchElements(pastElements);
  };

  const updatePlayerStats = (): void => {
    const processedMatches = new Set<string>();

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];

      for (const match of tournament.matchSchedule) {
        if (processedMatches.has(match.id)) {
          continue;
        }

        if (match.winner !== undefined) {
          const winner = updatedPlayers.find(
            (player) => player.id === match.winner
          );
          const loser = updatedPlayers.find(
            (player) => player.id !== match.winner
          );

          if (winner !== undefined && loser !== undefined) {
            winner.wins += 1;
            loser.losses += 1;
          }

          for (const matchPlayer of match.players) {
            const player = updatedPlayers.find(
              (player) => player.id === matchPlayer.id
            );
            if (player !== undefined) {
              player.points += matchPlayer.points.length;
            }
          }
          processedMatches.add(match.id);
        }
      }
      return updatedPlayers;
    });
  };

  const generateTableCells = (player: tournamentPlayer): ReactNode[] => {
    return [
      <TableCell key={0}>
        <Typography>{player.name}</Typography>
      </TableCell>,
      <TableCell key={1}>
        <Typography>{player.wins}</Typography>
      </TableCell>,
      <TableCell key={2}>
        <Typography>{player.losses}</Typography>
      </TableCell>,
      <TableCell key={3}>
        <Typography>{player.points}</Typography>
      </TableCell>
    ];
  };

  const generateTable = (): ReactNode => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

    const tableHeaders = ["Name", "Wins", "Losses", "Points"];
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow key={index}>{generateTableCells(player)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => {
          setSelectedTab(newValue);
        }}
      >
        <Tab label="Scoreboard" value="scoreboard" />
        <Tab label="Matches" value="matches" />
      </Tabs>
      {selectedTab === "scoreboard" && <div>{generateTable()}</div>}

      {selectedTab === "matches" && (
        <div>
          <div>
            <Typography variant="h5">Ongoing matches:</Typography>
          </div>
          <div>{ongoingMatchElements}</div>

          <div>
            <Typography variant="h5">Upcoming matches:</Typography>
          </div>
          <div>{upcomingMatchElements}</div>
          <div>
            <Typography variant="h5">Past matches:</Typography>
          </div>
          <div>{pastMatchElements}</div>
        </div>
      )}
    </>
  );
};

export default RoundRobinTournamentView;
