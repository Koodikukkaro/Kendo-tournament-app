import React, { type ReactElement, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useToast from "hooks/useToast";
import api from "api/axios";
import { type User } from "types/models";
import { useAuth } from "context/AuthContext";
import { useTournamentDetails } from "./TournamentDetails";

const fetchUserInfo = async (id?: string): Promise<User | null> => {
  if (id === undefined) return null;

  return await api.user.details(id);
};

const Signup: React.FC = (): ReactElement => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const showToast = useToast();
  const tournament = useTournamentDetails();
  console.log(tournament);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (): void => {
    try {
      if (userId !== undefined && tournament !== null) {
        api.tournaments.signup(userId);
        showToast(
          `Successfully signed up for tournament: ${tournament.name}`,
          "success"
        );
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  if (userInfo === null || tournament === null) {
    return <div>Error</div>;
  }

  return (
    <Container>
      <Typography variant="h4" className="header">
        Sign up for Tournament
      </Typography>
      <br />
      <Typography variant="body1" className="subtext">
        You are signing up for {tournament.name}:
      </Typography>
      <Typography variant="body1" className="dates">
        {new Date(tournament.startDate).toLocaleDateString("en")} -{" "}
        {new Date(tournament.endDate).toLocaleDateString("en")}
      </Typography>
      <Typography variant="body1" className="moreinfo">
        Want more information on this tournament?{" "}
        <Link to={`/${tournament.id}`}>Click here</Link>
      </Typography>
      <br />
      <Typography variant="body1" className="subtext">
        The information you are signing up with:
      </Typography>
      <Typography variant="body1" className="playerinfo">
        Name: {userInfo.firstName} {userInfo.lastName} <br />
        Email: {userInfo.email} <br />
        <br />
        Club: {userInfo.clubName}
        <br />
        Dan-rank: {userInfo.danRank}
        <br />
      </Typography>
      <br />
      <Box display="flex" gap="20px">
        <Button
          variant="contained"
          color="secondary"
          id="btnBack"
          onClick={() => {
            navigate("../");
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          id="btnSignup"
          onClick={handleSubmit}
        >
          Sign up
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
