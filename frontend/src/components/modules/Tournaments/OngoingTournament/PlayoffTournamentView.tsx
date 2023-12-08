import React from "react";
import Bracket from "./TournamentBracket";
import { type User, type Match } from "types/models";
import { useTournament } from "context/TournamentContext";
import { Typography, Box, Grid, Divider } from "@mui/material";

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

  const sortedRoundNumbers = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Box
      sx={{
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" }
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {sortedRoundNumbers.map((roundNumber, index) => (
          <React.Fragment key={roundNumber}>
            {index > 0 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "black" }}
              />
            )}
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 300 // Ensures the box has a minimum width
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ marginBottom: 2, textAlign: "center" }}
                >{`Round ${roundNumber}`}</Typography>
                {rounds[roundNumber].map((match: Match) => {
                  const tempPlayers: User[] = match.players.map(
                    (matchPlayer) => {
                      const player = players.find(
                        (p) => p.id === matchPlayer.id
                      );
                      if (player === null || player === undefined) {
                        throw new Error(
                          `Player with ID ${matchPlayer.id} not found`
                        );
                      }
                      return player;
                    }
                  );
                  return (
                    <Bracket
                      key={match.id}
                      players={tempPlayers}
                      match={match}
                    />
                  );
                })}
              </Box>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default PlayoffTournamentView;
