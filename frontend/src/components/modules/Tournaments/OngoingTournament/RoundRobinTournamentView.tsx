import React, { useState, useEffect, useRef } from "react";
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
  Button,
  type ButtonProps
} from "@mui/material";
import { type User, type Match } from "types/models";
import { useNavigate } from "react-router-dom";
import { useTournament } from "context/TournamentContext";

interface TournamentPlayer {
  id: string;
  name: string;
  wins: number;
  losses: number;
  points: number;
}

const Scoreboard: React.FC<{ players: TournamentPlayer[] }> = ({ players }) => {
  const generateTableCells = (player: TournamentPlayer): React.ReactNode[] => {
    return Object.values(player).map((value, index) => {
      if (index === 0) {
        // If we want to skip the ID property
        return null;
      }

      return (
        <TableCell key={index}>
          <Typography>{value}</Typography>
        </TableCell>
      );
    });
  };

  const generateTable = (): React.ReactNode => {
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

  return <div>{generateTable()}</div>;
};

const Matches: React.FC<{
  ongoingMatchElements: React.ReactNode[];
  upcomingMatchElements: React.ReactNode[];
  pastMatchElements: React.ReactNode[];
}> = ({ ongoingMatchElements, upcomingMatchElements, pastMatchElements }) => {
  return (
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
  );
};

const RoundRobinTournamentView: React.FC = () => {
  const tournament = useTournament();
  const navigate = useNavigate();

  const initialRender = useRef(true);
  const [selectedTab, setSelectedTab] = useState("scoreboard");
  const [players, setPlayers] = useState<TournamentPlayer[]>([]);
  const [ongoingMatches, setOngoingMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [pastMatches, setPastMatches] = useState<Match[]>([]);

  useEffect(() => {
    getPlayerNames();
    sortMatches();
  }, [tournament]);

  useEffect(() => {
    if (initialRender.current && players.length > 0) {
      initialRender.current = false;
      updatePlayerStats();
    }
  }, [players, tournament]);

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
      const sortedMatches = matches.sort((a, b) => {
        return b.elapsedTime - a.elapsedTime;
      });

      setOngoingMatches(
        sortedMatches.filter(
          (match) => match.elapsedTime > 0 && match.winner === undefined
        )
      );
      setUpcomingMatches(
        sortedMatches.filter(
          (match) => match.elapsedTime <= 0 && match.winner === undefined
        )
      );
      setPastMatches(
        sortedMatches.filter(
          (match) => match.elapsedTime > 0 && match.winner !== undefined
        )
      );
    }
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

  const createMatchButton = (
    match: Match,
    props: ButtonProps
  ): React.ReactNode => {
    const player1 = players.find((player) => player.id === match.players[0].id)
      ?.name;
    const player2 = players.find((player) => player.id === match.players[1].id)
      ?.name;

    return (
      <div style={{ marginBottom: "10px" }} key={match.id}>
        <Button
          onClick={() => {
            navigate(`match/${match.id}`);
          }}
          {...props}
        >
          {`${player1} - ${player2}`}
        </Button>
      </div>
    );
  };

  const ongoingElements = ongoingMatches.map((match) =>
    createMatchButton(match, {
      variant: "contained"
    })
  );
  const upcomingElements = upcomingMatches.map((match) =>
    createMatchButton(match, {
      variant: "contained",
      color: "info"
    })
  );
  const pastElements = pastMatches.map((match) =>
    createMatchButton(match, {
      variant: "contained",
      color: "secondary"
    })
  );

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue);
        }}
      >
        <Tab label="Scoreboard" value="scoreboard" />
        <Tab label="Matches" value="matches" />
      </Tabs>
      {selectedTab === "scoreboard" && <Scoreboard players={players} />}
      {selectedTab === "matches" && (
        <Matches
          ongoingMatchElements={ongoingElements}
          upcomingMatchElements={upcomingElements}
          pastMatchElements={pastElements}
        />
      )}
    </>
  );
};

export default RoundRobinTournamentView;
