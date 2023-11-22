import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";

interface TournamentData {
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  description: string;
  otherPlayers: string[];
}

const UpcomingTournamentView: React.FC = () => {
  const [tournamentData, setTournamentData] = useState<TournamentData>({
    name: "",
    startDate: "",
    endDate: "",
    type: "",
    description: "",
    otherPlayers: []
  });

  const handleClick = (): void => {
    console.log("Button clicked");
  };

  useEffect(() => {
    const fetchTournamentData = async (): Promise<void> => {
      try {
        // Mock data
        const mockData = {
          name: "Tournament Name",
          startDate: "01/01/2024 14:00",
          endDate: "02/01/2024 18:00",
          type: "Round robin",
          description: "This is a description of the tournament",
          otherPlayers: ["Player 1", "Player 2", "Player 3"]
        };

        setTournamentData(mockData);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };
    void fetchTournamentData();
  }, []);

  return (
    <div>
      <Typography variant="h4" className="header">
        Upcoming {tournamentData.name}
      </Typography>
      <Typography variant="body1" className="subtext">
        {tournamentData.name}
      </Typography>
      <Typography variant="body1" className="dates">
        {tournamentData.startDate} - {tournamentData.endDate}
      </Typography>
      <Typography variant="body1" className="subtext">
        Tournament type: {tournamentData.type}
      </Typography>
      <Typography variant="body1" className="subtext">
        {tournamentData.description}
      </Typography>
      <br />
      <Typography variant="body1" className="subtext">
        Want to attend?
      </Typography>
      <div className="field">
        <Button variant="contained" color="primary" onClick={handleClick}>
          Sign up
        </Button>
      </div>
      <br />
      <Typography variant="body1" className="subtext">
        Others who have signed up:
      </Typography>
      {tournamentData.otherPlayers.map((player, index) => (
        <Typography key={index} variant="body1" className="subtext">
          {player}
        </Typography>
      ))}
    </div>
  );
};

export default UpcomingTournamentView;
