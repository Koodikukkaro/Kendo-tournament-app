import React from "react";
import type { Tournament } from "types/models";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { useAuth } from "context/AuthContext";

interface TournamentCardProps {
  tournament: Tournament;
  type: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  type
}) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const userAlreadySigned = tournament.players.some(
    (player) => player.id === userId
  );
  const tournamentFull = tournament.maxPlayers <= tournament.players.length;

  return (
    <Card component="main" sx={{ position: "relative" }}>
      <CardActionArea
        onClick={() => {
          navigate(tournament.id);
        }}
      >
        <CardHeader
          title={tournament.name}
          titleTypographyProps={{ fontWeight: "500" }}
        />
        <CardContent sx={{ marginBottom: "32px" }}>
          <Typography color="text.secondary">
            Start Date:{" "}
            {new Date(tournament.startDate).toLocaleDateString("fi")}
          </Typography>

          <Typography color="text.secondary">
            End Date: {new Date(tournament.endDate).toLocaleDateString("fi")}
          </Typography>
        </CardContent>
      </CardActionArea>
      {type === "upcoming" && (
        <Button
          color="primary"
          variant="outlined"
          disabled={userAlreadySigned || tournamentFull}
          onClick={() => {
            navigate(`${tournament.id}/sign-up`);
          }}
          sx={{ position: "absolute", bottom: 10, right: 10 }}
        >
          Sign up
        </Button>
      )}
    </Card>
  );
};

export default TournamentCard;
