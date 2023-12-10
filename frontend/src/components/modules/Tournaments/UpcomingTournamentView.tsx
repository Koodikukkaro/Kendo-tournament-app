import React from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "context/TournamentContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "context/AuthContext";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import type { Tournament } from "types/models";

const generateTable = (tournament: Tournament): React.ReactNode => {
  const tableHeaders = ["Name", "Rank", "Club"] as const;
  return (
    <TableContainer component={Paper} aria-label="Player Table">
      <Table size="small">
        <TableHead>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell key={header} aria-label={`header-${header}`}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tournament.players.map((player, index) => (
            <TableRow key={player.id} aria-label={`player-${index}`}>
              <TableCell aria-label={`cell-name-${index}`}>
                <Typography>
                  {`${player.firstName} - ${player.lastName}`}
                </Typography>
              </TableCell>
              <TableCell aria-label={`cell-rank-${index}`}>
                <Typography>{player.danRank ?? "-"}</Typography>
              </TableCell>
              <TableCell aria-label={`cell-club-${index}`}>
                <Typography>{player.clubName ?? "-"}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const UpcomingTournamentView: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const tournament = useTournament();
  const userAlreadySigned = tournament.players.some(
    (player) => player.id === userId
  );

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

      {!userAlreadySigned && (
        <Box>
          <Typography variant="body1" className="header">
            Want to attend?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={userAlreadySigned}
            onClick={() => {
              navigate("sign-up");
            }}
          >
            Sign up
          </Button>
          <br />
        </Box>
      )}

      {tournament.players.length > 0 ? (
        <React.Fragment>
          <Typography variant="body1" className="header" fontWeight="bold">
            Others who have signed up:
          </Typography>
          {generateTable(tournament)}
        </React.Fragment>
      ) : (
        <Typography variant="body1" className="header" fontWeight="bold">
          No players have signed up yet.
        </Typography>
      )}
    </Container>
  );
};

export default UpcomingTournamentView;
