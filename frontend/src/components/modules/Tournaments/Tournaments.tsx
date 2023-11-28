import React, { useEffect, useState } from "react";
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

export const useTournament = (): TournamentContextType => {
  return useOutletContext<TournamentContextType>();
};

const Tournaments: React.FC = () => {
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ongoing, setOngoing] = useState<Tournament[]>([]);
  const [upcoming, setUpcoming] = useState<Tournament[]>([]);

  useEffect(() => {
    const getAllTournaments = async (): Promise<void> => {
      try {
        const [ongoing, upcoming] = await getTournamentsTuple();

        setOngoing(ongoing);
        setUpcoming(upcoming);
      } catch (error) {
        showToast("Could not fetch tournament data.", "error");
      }

      setIsLoading(false);
    };

    void getAllTournaments();
  }, [showToast]);

  return <Outlet context={{ isLoading, ongoing, upcoming }} />;
};

export default Tournaments;
