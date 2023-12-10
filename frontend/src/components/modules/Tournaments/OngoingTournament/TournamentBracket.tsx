import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { type Match, type User } from "types/models";

interface BracketProps {
  match: Match;
  players: User[];
}

const Bracket: React.FC<BracketProps> = ({ match, players }) => {
  // Find the players in the players array using their IDs
  const player1 = players.find(
    (player) => player.id === match.players[0].id
  ) as User;
  const player2 = players.find(
    (player) => player.id === match.players[1].id
  ) as User;

  const winner = match.winner;
  const isWinnerDeclared = winner !== undefined;

  // Get the names of the players
  const player1Name = `${player1.firstName} ${player1.lastName}`;
  const player2Name = `${player2.firstName} ${player2.lastName}`;

  let player1Color = "black";
  let player2Color = "black";

  if (isWinnerDeclared) {
    player1Color = winner === player1.id ? "#f44336" : "#666666";
    player2Color = winner === player2.id ? "#f44336" : "#666666";
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 5
      }}
    >
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent>
          <Typography textAlign="center" style={{ color: player1Color }}>
            {player1Name}
          </Typography>
          <Typography textAlign="center"> vs</Typography>
          <Typography textAlign="center" style={{ color: player2Color }}>
            {player2Name}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Bracket;
