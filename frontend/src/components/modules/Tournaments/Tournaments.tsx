import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { type Tournament } from "types/models";
import useToast from "hooks/useToast";
import api from "api/axios";

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

interface TournamentContextType {
  isLoading: boolean;
  ongoing: Tournament[];
  upcoming: Tournament[];
}

export const useTournaments = (): TournamentContextType => {
  return useOutletContext<TournamentContextType>();
};

const Tournaments: React.FC = () => {
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tournamentsTuple, setTournamentsTuple] = useState<Tournament[][]>([
    [],
    []
  ]);

  const memoizedTournaments = useMemo(() => {
    return {
      ongoing: tournamentsTuple[0],
      upcoming: tournamentsTuple[1]
    };
  }, [tournamentsTuple]);

  useEffect(() => {
    const getAllTournaments = async (): Promise<void> => {
      try {
        const tournaments = await getTournamentsTuple();
        setTournamentsTuple(tournaments);
      } catch (error) {
        showToast("Could not fetch tournament data.", "error");
      }

      setIsLoading(false);
    };

    void getAllTournaments();
  }, []);

  return <Outlet context={{ isLoading, ...memoizedTournaments }} />;
};

export default Tournaments;
