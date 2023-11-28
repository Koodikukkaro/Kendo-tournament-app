import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useTournament } from "./Tournaments";
import { type Tournament } from "types/models";

export function useTournamentDetails() {
  return useOutletContext<Tournament>();
}

const TournamentDetails: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const { ongoing, upcoming } = useTournament();
  const context =
    ongoing.find((tournament) => tournament.id === id) ??
    upcoming.find((tournament) => tournament.id === id);

  return <Outlet context={context} />;
};

export default TournamentDetails;
