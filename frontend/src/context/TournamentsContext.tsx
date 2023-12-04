import React, { useEffect, useState, type ReactElement } from "react";
import { type Tournament } from "types/models";
import useToast from "hooks/useToast";
import api from "api/axios";
import { Outlet, useOutletContext } from "react-router-dom";
import Loader from "components/common/Loader";

export type TabType = "ongoing" | "upcoming";

interface ITournamentsContext {
  isLoading: boolean;
  isError: boolean;
  ongoing: Tournament[];
  upcoming: Tournament[];
  // For perserving the state of the selected tab in the tournamentsList component
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

const initialContextValue: ITournamentsContext = {
  isLoading: true,
  isError: false,
  ongoing: [],
  upcoming: [],
  currentTab: "ongoing",
  setCurrentTab: (_tab: TabType) => {}
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
  const showToast = useToast();
  const [value, setValue] = useState<ITournamentsContext>(initialContextValue);

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

  const setCurrentTab = (tab: TabType): void => {
    setValue((prevValue) => ({
      ...prevValue,
      currentTab: tab
    }));
  };

  if (value.isLoading) {
    return <Loader />;
  }

  return <Outlet context={{ ...value, setCurrentTab }} />;
};

export const useTournaments = (): ITournamentsContext =>
  useOutletContext<ITournamentsContext>();
