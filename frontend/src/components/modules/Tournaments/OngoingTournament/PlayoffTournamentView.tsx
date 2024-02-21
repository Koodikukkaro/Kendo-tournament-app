import React, { useState } from "react";
import Bracket from "./TournamentBracket";
import { type User, type Match } from "types/models";
import { useTournament } from "context/TournamentContext";
import { Typography, Box, Grid, Divider } from "@mui/material";
import ErrorModal from "components/common/ErrorModal";
import { useNavigate } from "react-router-dom";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

interface Rounds extends Record<number, Match[]> {}

const PlayoffTournamentView: React.FC = () => {
  const { matchSchedule, players } = useTournament();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  // Calculate the total number of rounds, assuming it's a single-elimination tournament
  const totalRounds = Math.ceil(Math.log2(players.length));

  if (error !== null) {
    return (
      <ErrorModal
        open={true}
        onClose={() => {
          navigate(routePaths.homeRoute);
        }}
        errorMessage={error}
      />
    );
  }

  try {
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
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {Object.entries(rounds).map(([roundNumber, matches], index) => (
            <React.Fragment key={roundNumber}>
              {index > 0 && <Divider orientation="vertical" flexItem />}
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 300
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 2,
                      textAlign: "center",
                      textDecoration: "underline"
                    }}
                  >
                    {parseInt(roundNumber) === totalRounds
                      ? t("tournament_view_labels.final")
                      : `${t("tournament_view_labels.round")} ${roundNumber}`}
                  </Typography>
                  {matches.map((match: Match) => {
                    const tempPlayers: User[] = match.players.map(
                      (matchPlayer) => {
                        const player = players.find(
                          (p) => p.id === matchPlayer.id
                        );
                        if (player === null || player === undefined) {
                          throw new Error();
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
  } catch (e) {
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError(t("messages.unexpected_error_happened"));
    }
  }
};

export default PlayoffTournamentView;
