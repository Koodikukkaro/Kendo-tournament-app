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
  const isWinnerDeclared = winner !== null && winner !== undefined;

  // Get the names of the players
  const player1Name = `${player1.firstName} ${player1.lastName}`;
  const player2Name = `${player2.firstName} ${player2.lastName}`;

  let player1BgColor = "white";
  let player2BgColor = "white";
  let fontColor = "black";

  if (isWinnerDeclared) {
    player1BgColor = winner === player1.id ? "#f44336" : "#666666";
    player2BgColor = winner === player2.id ? "#f44336" : "#666666";
    fontColor = "white";
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
      <Card
        variant="outlined"
        sx={{ mb: 1, backgroundColor: player1BgColor, color: fontColor }}
      >
        <CardContent>
          <Typography textAlign="center">{player1Name}</Typography>
        </CardContent>
      </Card>
      <Typography>VS</Typography>
      <Card
        variant="outlined"
        sx={{ mt: 1, backgroundColor: player2BgColor, color: fontColor }}
      >
        <CardContent>
          <Typography textAlign="center">{player2Name}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Bracket;
