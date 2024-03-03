import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea
} from "@mui/material";
import { type Match, type User } from "types/models";
import { useNavigate } from "react-router-dom";

interface BracketProps {
  match: Match;
  players: User[];
}

const Bracket: React.FC<BracketProps> = ({ match, players }) => {
  const navigate = useNavigate();
  //  Find the players in the players array using their IDs
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

  // Initialize variables for player points
  let player1Points = 0;
  let player2Points = 0;

  // Increments the total points of the player by 1 for each scored point
  // If the point type is "hansoku", the opponent receives 0.5 points
  for (const point of match.players[0].points) {
    if (point.type === "hansoku") {
      player2Points += 0.5;
    }
    else {
      player1Points++;
    }
  }
  for (const point of match.players[1].points) {
    if (point.type === "hansoku") {
      player1Points += 0.5;
    }
    else {
      player2Points ++;
    }
  }
  // Round down each player's total points to the nearest integer
  player1Points = Math.floor(player1Points);
  player2Points = Math.floor(player2Points);

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
        <CardActionArea
          onClick={() => {
            navigate(`match/${match.id}`);
          }}
        >
          <CardContent>
            <Typography textAlign="center" style={{ color: player1Color }}>
              {player1Name}
            </Typography>
            <Typography textAlign="center"> vs</Typography>
            <Typography textAlign="center" style={{ color: player2Color }}>
              {player2Name}
            </Typography>
            {isWinnerDeclared && (
              <Typography textAlign="center" variant="h6">
                <span style={{ color: player1Color }}>{player1Points}</span>
                  - 
                <span style={{ color: player2Color }}>{player2Points}</span>
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Bracket;
