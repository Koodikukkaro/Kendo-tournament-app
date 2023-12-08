import React from "react";
import Bracket from "./TournamentBracketNew";
import { type User, type Match } from "types/models";
import { useTournament } from "context/TournamentContext";
import { Typography, Box, Grid } from "@mui/material";

interface Rounds extends Record<number, Match[]> {}

const PlayoffTournamentView: React.FC = () => {
  const tournament = useTournament();
  const matchSchedule: Match[] = tournament.matchSchedule;
  const players: User[] = tournament.players;

  // Group matches by tournamentRound
  const rounds: Rounds = matchSchedule.reduce<Rounds>((acc, match) => {
    const round = match.tournamentRound;
    if (acc[round] === undefined) {
      acc[round] = [];
    }

    acc[round].push(match);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        "&::-webkit-scrollbar": { display: "none" }
      }}
    >
      <Grid container spacing={2}>
        {Object.entries(rounds).map(([roundNumber, matches]) => (
          <Grid item key={roundNumber} xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderBottom: "1px solid black"
              }}
            >
              <Typography
                variant="h5"
                style={{ marginBottom: 5, textAlign: "center" }}
              >{`Round ${roundNumber}`}</Typography>
              {matches.map((match: Match) => {
                const tempPlayers: User[] = match.players.map((matchPlayer) => {
                  const player = players.find((p) => p.id === matchPlayer.id);
                  if (player === null || player === undefined) {
                    throw new Error(
                      `Player with ID ${matchPlayer.id} not found`
                    );
                  }
                  return player;
                });
                return (
                  <Bracket key={match.id} players={tempPlayers} match={match} />
                );
              })}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlayoffTournamentView;
