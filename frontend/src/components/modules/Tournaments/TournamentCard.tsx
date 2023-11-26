import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { type Tournament } from "types/models";

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <Card>
      <CardContent>
        {/* Tournament name */}
        <Typography variant="h6" component="div">
          {tournament.tournamentName}
        </Typography>

        {/* Start date */}
        <Typography color="text.secondary">
          Start Date: {new Date(tournament.startDate).toLocaleDateString()}
        </Typography>

        {/* End date */}
        <Typography color="text.secondary">
          End Date: {new Date(tournament.startDate).toLocaleDateString()}
        </Typography>

        {/* Add more details as needed */}
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
