import {
  Box,
  CircularProgress,
  Grid,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import Container from "@mui/material/Container";
import api from "api/axios";
import React, { useEffect, useState } from "react";
import { type Tournament } from "types/models";
import TournamentCard from "./TournamentCard";
import { useNavigate } from "react-router-dom";
import useToast from "hooks/useToast";

// SpeedDial actions
const actions = [{ icon: <EventIcon />, name: "Create Tournament" }];

const getTournamentsTuple = async (): Promise<Tournament[][]> => {
  const tournaments = await api.tournaments.getAll();

  const currentDate = new Date();

  // Sort tournaments by start date in descending order
  const sortedTournaments = tournaments.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    return dateB.getTime() - dateA.getTime();
  });

  // Sort tournaments into ongoing and upcoming
  const ongoing = sortedTournaments.filter(
    (tournament) => new Date(tournament.startDate) <= currentDate
  );

  const upcoming = sortedTournaments.filter(
    (tournament) => new Date(tournament.startDate) > currentDate
  );

  return [ongoing, upcoming];
};

const TournamentList: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [currentTabIndex, setCurrentTabIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [ongoingTournaments, setOngoingTournaments] = useState<Tournament[]>(
    []
  );
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>(
    []
  );

  const tournamentsToRender =
    currentTabIndex === 1 ? ongoingTournaments : upcomingTournaments;

  useEffect(() => {
    const getAllTournaments = async (): Promise<void> => {
      try {
        const [ongoing, upcoming] = await getTournamentsTuple();

        // Update state with sorted tournaments
        setOngoingTournaments(ongoing);
        setUpcomingTournaments(upcoming);
      } catch (error) {
        showToast("Could not fetch tournament data.", "error");
      }

      setIsLoading(false);
    };

    void getAllTournaments();
  }, []);

  const handleTabChange = (
    _event: React.SyntheticEvent<Element, Event>,
    tabIndex: number
  ): void => {
    setCurrentTabIndex(tabIndex);
    // Check the current scroll position
    const scrollPosition = window.scrollY;
    const scrollTreshold = 300;

    // Scroll to the top only if the scroll position is below a certain threshold
    if (scrollPosition > scrollTreshold) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return isLoading ? (
    <Box textAlign="center" marginTop="64px">
      <CircularProgress />
    </Box>
  ) : (
    <Container
      sx={{ position: "relative", paddingBottom: "30px", marginTop: "64px" }}
    >
      {/* Floating Create Tournament Button */}
      <SpeedDial
        ariaLabel="Create Tournament"
        icon={<SpeedDialIcon />}
        direction="up"
        sx={{ position: "fixed", bottom: "100px", right: "20px" }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              navigate("/new-tournament");
            }}
          />
        ))}
      </SpeedDial>

      {/* Tournament Listings */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "10px" }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            position: "sticky",
            top: 0,
            bottom: 0,
            backgroundColor: "white"
          }}
        >
          <Tab label="Ongoing Tournaments" value={1}></Tab>
          <Tab label="Upcoming Tournaments" value={2}></Tab>
        </Tabs>
      </Box>
      <Grid container spacing={2} direction="row" alignItems="stretch">
        {tournamentsToRender.length > 0 ? (
          tournamentsToRender.map((tournament, key) => (
            <Grid item xs={12} md={6} key={tournament._id + key}>
              <TournamentCard tournament={tournament} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" marginTop="10px">
            No tournaments found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default TournamentList;
