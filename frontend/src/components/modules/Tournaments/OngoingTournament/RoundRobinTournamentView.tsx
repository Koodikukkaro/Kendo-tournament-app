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
import { useTranslation } from "react-i18next";

interface TournamentPlayer {
  id: string;
  name: string;
  points: number;
  ippons: number;
  wins: number;
  losses: number;
  ties: number;
}

// const to be changed when match time is got from api
const MATCH_TIME = 300000;

const Scoreboard: React.FC<{ players: TournamentPlayer[] }> = ({ players }) => {
  const { t } = useTranslation();

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

    const tableHeaders = [
      t("tournament_view_labels.name"),
      t("tournament_view_labels.points"),
      t("tournament_view_labels.ippons"),
      t("tournament_view_labels.wins"),
      t("tournament_view_labels.losses"),
      t("tournament_view_labels.ties")
    ];

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
  const { t } = useTranslation();

  return (
    <div>
      <div>
        <Typography variant="h5">
          {t("tournament_view_labels.ongoing_matches")}
        </Typography>
      </div>
      <div>{ongoingMatchElements}</div>

      <div>
        <Typography variant="h5">
          {t("tournament_view_labels.upcoming_matches")}
        </Typography>
      </div>
      <div>{upcomingMatchElements}</div>
      <div>
        <Typography variant="h5">
          {t("tournament_view_labels.past_matches")}
        </Typography>
      </div>
      <div>{pastMatchElements}</div>
    </div>
  );
};

const RoundRobinTournamentView: React.FC = () => {
  const tournament = useTournament();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
              points: 0,
              ippons: 0,
              wins: 0,
              losses: 0,
              ties: 0
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
          (match) => match.elapsedTime > 0 && match.endTimestamp === undefined
        )
      );
      setUpcomingMatches(
        sortedMatches.filter(
          (match) => match.elapsedTime <= 0 && match.endTimestamp === undefined
        )
      );
      setPastMatches(
        sortedMatches.filter(
          (match) => match.elapsedTime > 0 && match.endTimestamp !== undefined
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
        const [player1Id, player2Id] = match.players.map((player) => player.id);

        // Find the TournamentPlayer objects corresponding to the player IDs
        const player1 = updatedPlayers.find(
          (player) => player.id === player1Id
        );
        const player2 = updatedPlayers.find(
          (player) => player.id === player2Id
        );

        // Add wins and losses
        if (match.winner !== undefined) {
          const winner = updatedPlayers.find(
            (player) => player.id === match.winner
          );
          const loser = updatedPlayers.find(
            (player) => player.id !== match.winner
          );

          // Update stats, win equals 3 points
          if (winner !== undefined && loser !== undefined) {
            winner.wins += 1;
            winner.points += 3;
            loser.losses += 1;
          }
        }

        // Add ties
        if (
          match.winner === undefined &&
          (match.endTimestamp !== undefined || match.elapsedTime >= MATCH_TIME)
        ) {
          // Update their stats, tie equals 1 point
          if (player1 !== undefined && player2 !== undefined) {
            player1.ties += 1;
            player1.points += 1;
            player2.ties += 1;
            player2.points += 1;
          }
        }

        // Add ippons
        const matchPlayer1 = match.players[0];
        const matchPlayer2 = match.players[1];
        let temporaryPoints1 = 0;
        let temporaryPoints2 = 0;

        if (
          matchPlayer1 !== undefined &&
          matchPlayer2 !== undefined &&
          player1 !== undefined &&
          player2 !== undefined
        ) {
          for (const point of matchPlayer1.points) {
            if (point.type === "hansoku") {
              // In case of hansoku, the opponent receives half a point.
              temporaryPoints2 += 0.5;
            } else {
              // Otherwise, give one point to the player.
              temporaryPoints1 += 1;
            }
          }
          for (const point of matchPlayer2.points) {
            if (point.type === "hansoku") {
              // In case of hansoku, the opponent receives half a point.
              temporaryPoints1 += 0.5;
            } else {
              // Otherwise, give one point to the player.
              temporaryPoints2 += 1;
            }
          }
          // set the rounded points
          player1.ippons += Math.floor(temporaryPoints1);
          player2.ippons += Math.floor(temporaryPoints2);
        }
        processedMatches.add(match.id);
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

    let officialsInfo = "";

    if (match.elapsedTime <= 0) {
      // Match is upcoming
      const timerPerson = match.timeKeeper ?? undefined;
      const pointMaker = match.pointMaker ?? undefined;

      // depending on which roles are missing for the match, print them under button
      if (timerPerson === undefined && pointMaker === undefined) {
        officialsInfo = t("tournament_view_labels.missing_both");
      } else {
        if (timerPerson === undefined) {
          officialsInfo += t("tournament_view_labels.missing_timer");
        }
        if (pointMaker === undefined) {
          officialsInfo += t("tournament_view_labels.missing_point_maker");
        }
      }
    }

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
        {officialsInfo !== undefined && (
          <Typography variant="body2">{officialsInfo}</Typography>
        )}
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
        <Tab
          label={t("tournament_view_labels.scoreboard")}
          value="scoreboard"
        />
        <Tab label={t("tournament_view_labels.matches")} value="matches" />
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
