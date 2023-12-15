import React, { useEffect } from "react";
import TournamentCard from "./TournamentCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTournaments } from "context/TournamentsContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import EventIcon from "@mui/icons-material/Event";
import Container from "@mui/material/Container";
import type { Tournament } from "types/models";

const tabTypes = ["past", "ongoing", "upcoming"] as const;
const defaultTab = "ongoing";

// SpeedDial actions
const actions = [{ icon: <EventIcon />, name: "Create Tournament" }];

const TournamentList: React.FC = () => {
  const navigate = useNavigate();
  const { past, upcoming, ongoing } = useTournaments();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") ?? defaultTab;

  useEffect(() => {
    if (currentTab === null || !tabTypes.some((tab) => tab === currentTab)) {
      setSearchParams((params) => {
        params.set("tab", defaultTab);
        return params;
      });
    }
  }, [currentTab]);

  const tournamentsToRender = (): Tournament[] => {
    switch (currentTab) {
      case "past":
        return past;
      case "ongoing":
        return ongoing;
      case "upcoming":
        return upcoming;
      default:
        return ongoing;
    }
  };

  const handleTabChange = (tab: string): void => {
    setSearchParams((params) => {
      params.set("tab", tab);
      return params;
    });
  };

  return (
    <Container sx={{ position: "relative", paddingBottom: "30px" }}>
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
              navigate("new-tournament");
            }}
          />
        ))}
      </SpeedDial>

      {/* Tournament Listings */}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "10px" }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, value) => {
            handleTabChange(value);
          }}
          variant="scrollable"
          sx={{
            position: "sticky",
            top: 0,
            bottom: 0,
            backgroundColor: "white"
          }}
        >
          <Tab label="Ongoing Tournaments" value={"ongoing"}></Tab>
          <Tab label="Upcoming Tournaments" value={"upcoming"}></Tab>
          <Tab label="Past Tournaments" value={"past"}></Tab>
        </Tabs>
      </Box>
      <Grid container spacing={2} direction="row" alignItems="stretch">
        {tournamentsToRender().length > 0 ? (
          tournamentsToRender().map((tournament, key) => (
            <Grid item xs={12} md={6} key={tournament.id + key}>
              <TournamentCard tournament={tournament} type={currentTab} />
            </Grid>
          ))
        ) : (
          <Container>
            <Typography variant="h6" marginTop="32px" textAlign="center">
              No tournaments found.
            </Typography>
          </Container>
        )}
      </Grid>
    </Container>
  );
};

export default TournamentList;
