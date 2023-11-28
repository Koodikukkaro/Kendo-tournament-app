import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography
} from "@mui/material";
import { type Tournament } from "types/models";
import { useLocation, useNavigate } from "react-router-dom";

interface TournamentCardProps {
  tournament: Tournament;
  type: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  type
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    navigate(`/${location.pathname}/${tournament.id}/sign-up`);
  };

  return (
    <Card component="main">
      <CardActionArea
        onClick={() => {
          navigate(tournament.id);
        }}
      >
        <CardHeader title={tournament.name} />
        <CardContent>
          <Typography color="text.secondary">
            Start Date:{" "}
            {new Date(tournament.startDate).toLocaleDateString("en")}
          </Typography>

          <Typography color="text.secondary">
            End Date: {new Date(tournament.endDate).toLocaleDateString("en")}
          </Typography>
        </CardContent>
        {type === "upcoming" && (
          <CardContent>
            <Button color="primary" variant="outlined" onClick={handleClick}>
              Sign up
            </Button>
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
};

export default TournamentCard;
