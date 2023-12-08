import React, { type ReactElement, useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import useToast from "hooks/useToast";
import api from "api/axios";
import type { User } from "types/models";
import { useAuth } from "context/AuthContext";
import { useTournament } from "context/TournamentContext";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import routePaths from "routes/route-paths";
import Link from "@mui/material/Link";
import Loader from "components/common/Loader";
import UserInfoTable from "./UserInfoTable";

const Signup: React.FC = (): ReactElement => {
  const { userId } = useAuth();
  const showToast = useToast();
  const tournament = useTournament();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        if (userId !== undefined) {
          const user = await api.user.details(userId);
          setUser(user);
        }
      } catch (error) {
        showToast(error, "error");
      } finally {
        setLoading(false);
      }
    };

    void fetchUserData();
  }, [userId]);

  const handleSubmit = async (): Promise<void> => {
    try {
      // Submit is disabled if the userId is null.
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      await api.tournaments.signup(tournament.id, { playerId: userId! });
      showToast(
        `Successfully signed up for tournament: ${tournament.name}`,
        "success"
      );
      navigate(routePaths.homeRoute, { replace: true });
    } catch (error) {
      showToast(error, "error");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Container
      component="main"
      sx={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      <Box className="sign-up-header">
        <Typography
          variant="h5"
          className="header"
          fontWeight="bold"
          marginBottom="12px"
        >
          Sign Up for {tournament.name}
        </Typography>

        <Typography variant="body1" className="dates">
          {new Date(tournament.startDate).toLocaleString("fi")} -{" "}
          {new Date(tournament.endDate).toLocaleString("fi")}
        </Typography>
      </Box>

      <Box className="sign-up-body">
        <Typography variant="body1" className="subtext">
          Want more information on this tournament?{" "}
          <Link
            component={RouterLink}
            to={`${routePaths.homeRoute}/${tournament.id}`}
          >
            Click here
          </Link>
        </Typography>
      </Box>

      <Box className="sign-up-body-2">
        <Typography variant="body1" className="subtext">
          The information you are signing up with:
        </Typography>

        {/* User info */}
        <Box sx={{ width: "50%", paddingY: "8px" }}>
          {<UserInfoTable user={user} />}
        </Box>
      </Box>

      <Box display="flex">
        <Button
          variant="contained"
          color="primary"
          id="btnSignup"
          onClick={async () => {
            await handleSubmit();
          }}
          disabled={userId === undefined}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
