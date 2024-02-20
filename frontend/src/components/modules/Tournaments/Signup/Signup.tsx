import React, { type ReactElement, useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import useToast from "hooks/useToast";
import api from "api/axios";
import type { User } from "types/models";
import { useAuth } from "context/AuthContext";
import { useTournament } from "context/TournamentContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        `${t("messages.sign_up_success")}${tournament.name}`,
        "success"
      );
      navigate(routePaths.homeRoute, {
        replace: true,
        state: { refresh: true }
      });
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
          {t("signup_labels.sign_up_for")} {tournament.name}
        </Typography>

        <Typography variant="body1" className="dates">
          {new Date(tournament.startDate).toLocaleString("fi")} -{" "}
          {new Date(tournament.endDate).toLocaleString("fi")}
        </Typography>
      </Box>

      <Box className="sign-up-body">
        <Typography variant="body1" className="subtext">
          {t("signup_labels.want_more_info")}{" "}
          <Link
            component={RouterLink}
            to={`${routePaths.homeRoute}/${tournament.id}`}
          >
            {t("signup_labels.click_here")}
          </Link>
        </Typography>
      </Box>

      <Box className="sign-up-body-2">
        <Typography variant="body1" className="subtext">
          {t("signup_labels.user_info")}
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
          {t("buttons.sign_up_button")}
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
