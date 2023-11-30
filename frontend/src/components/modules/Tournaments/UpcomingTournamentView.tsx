import React from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "context/TournamentContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const UpcomingTournamentView: React.FC = () => {
  const navigate = useNavigate();
  const tournament = useTournament();

  return (
    <Container
      component="main"
      sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Typography
        variant="h5"
        className="header"
        fontWeight="bold"
        marginBottom="12px"
      >
        {tournament.name}
      </Typography>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          When:
        </Typography>
        <Typography variant="body1" className="dates">
          {new Date(tournament.startDate).toLocaleString("fi")} -{" "}
          {new Date(tournament.endDate).toLocaleString("fi")}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          Type of Tournament:
        </Typography>
        <Typography variant="body1" className="subtext">
          {tournament.type}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          About the Tournament:
        </Typography>
        <Typography variant="body1" className="subtext">
          {tournament.description}
        </Typography>
      </Box>

      <br />

      <Box>
        <Typography variant="body1" className="header">
          Want to attend?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("sign-up");
          }}
        >
          Sign up
        </Button>
      </Box>
      <br />

      {tournament.players.length > 0 ? (
        <>
          <Typography variant="body1" className="header" fontWeight="bold">
            Others who have signed up:
          </Typography>

          {tournament.players.map((player, index) => (
            <Typography key={index} variant="body1" className="subtext">
              {/* TODO: Show relevant info here instead of ID. */}
              {player}
            </Typography>
          ))}
        </>
      ) : (
        <Typography variant="body1" className="header" fontWeight="bold">
          No players have signed up yet.
        </Typography>
      )}
    </Container>
  );
};

export default UpcomingTournamentView;
