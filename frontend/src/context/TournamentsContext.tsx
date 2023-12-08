import React, { useEffect, useState, type ReactElement } from "react";
import { type Tournament } from "types/models";
import useToast from "hooks/useToast";
import api from "api/axios";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext
} from "react-router-dom";
import Loader from "components/common/Loader";
import { type LocationState } from "types/global";

interface ITournamentsContext {
  isLoading: boolean;
  isError: boolean;
  ongoing: Tournament[];
  upcoming: Tournament[];
}

const initialContextValue: ITournamentsContext = {
  isLoading: true,
  isError: false,
  ongoing: [],
  upcoming: []
};

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

export const TournamentsProvider = (): ReactElement => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [value, setValue] = useState<ITournamentsContext>(initialContextValue);
  const location = useLocation() as LocationState;
  const shouldRefresh: boolean = location.state?.refresh ?? false;

  /* Refresh the page.
   * Needed to retrigger any queries to the server.
   * */
  useEffect(() => {
    if (shouldRefresh) {
      navigate(".", { replace: true });
    }
  }, [shouldRefresh]);

  useEffect(() => {
    const getAllTournaments = async (): Promise<void> => {
      try {
        const tournaments = await getTournamentsTuple();
        setValue((prevValue) => ({
          ...prevValue,
          isLoading: false,
          ongoing: tournaments[0],
          upcoming: tournaments[1]
        }));
      } catch (error) {
        showToast("Could not fetch any tournaments", "error");
        setValue((prevValue) => ({
          ...prevValue,
          isLoading: false,
          isError: true
        }));
      }
    };

    void getAllTournaments();
  }, []);

  if (value.isLoading) {
    return <Loader />;
  }

  return <Outlet context={value} />;
};

export const useTournaments = (): ITournamentsContext =>
  useOutletContext<ITournamentsContext>();
