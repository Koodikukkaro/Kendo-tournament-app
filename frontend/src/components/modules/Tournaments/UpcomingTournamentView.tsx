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
import { useTranslation } from "react-i18next";

const generateTable = (tournament: Tournament): React.ReactNode => {
  const { t } = useTranslation();

  const tableHeaders = [
    t("user_info_labels.name"),
    t("user_info_labels.dan_rank"),
    t("user_info_labels.club")
  ] as const;

  return (
    <TableContainer
      component={Paper}
      aria-label={t("signup_labels.player_table")}
    >
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const tournament = useTournament();
  const userAlreadySigned = tournament.players.some(
    (player) => player.id === userId
  );
  const maxPlayers = tournament.maxPlayers;
  const signedPlayers = tournament.players.length;
  const tournamentFull = maxPlayers <= signedPlayers;

  const getTypeTranslationKey = (type: TournamentType): string => {
    switch (type) {
      case "Round Robin":
        return "types.round_robin";
      case "Playoff":
        return "types.playoff";
      case "Preliminary Playoff":
        return "types.preliminary_playoff";
      default:
        return "";
    }
  };

  return (
    <Container
      component="main"
      sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Typography
        variant="h4"
        className="header"
        fontWeight="bold"
        marginBottom="12px"
      >
        {tournament.name}
      </Typography>

      {tournamentFull && (
        <Box>
          <Typography variant="h5" className="header" fontWeight="bold">
            {t("upcoming_tournament_view.tournament_full")}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          {t("upcoming_tournament_view.location_header")}:
        </Typography>
        <Typography variant="body1" className="subtext">
          {tournament.location}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          {t("upcoming_tournament_view.date_header")}:
        </Typography>
        <Typography variant="body1" className="dates">
          {new Date(tournament.startDate).toLocaleString("fi")} -{" "}
          {new Date(tournament.endDate).toLocaleString("fi")}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          {t("upcoming_tournament_view.type_header")}:
        </Typography>
        <Typography variant="body1" className="subtext">
          {t(getTypeTranslationKey(tournament.type))}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" className="header" fontWeight="bold">
          {t("upcoming_tournament_view.about_header")}:
        </Typography>
        <Typography variant="body1" className="subtext">
          {tournament.description}
        </Typography>
      </Box>

      <br />

      {!userAlreadySigned && !tournamentFull && (
        <Box>
          <Typography variant="body1" className="header">
            {t("upcoming_tournament_view.attend_prompt")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={userAlreadySigned || tournamentFull}
            onClick={() => {
              navigate("sign-up");
            }}
          >
            {t("buttons.sign_up_button")}
          </Button>
          <br />
        </Box>
      )}

      {tournament.players.length > 0 ? (
        <React.Fragment>
          <Typography variant="body1" className="header" fontWeight="bold">
            {t("upcoming_tournament_view.others_signed_up_header")}:
          </Typography>
          {generateTable(tournament)}
        </React.Fragment>
      ) : (
        <Typography variant="body1" className="header" fontWeight="bold">
          {t("upcoming_tournament_view.no_players_signed_up")}
        </Typography>
      )}
    </Container>
  );
};

export default UpcomingTournamentView;
