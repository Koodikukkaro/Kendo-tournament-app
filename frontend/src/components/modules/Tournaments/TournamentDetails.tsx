import React from "react";
import PlayoffTournamentView from "./OngoingTournament/PlayoffTournamentView";
import RoundRobinTournamentView from "./OngoingTournament/RoundRobinTournamentView";
import UpcomingTournamentView from "./UpcomingTournamentView";
import ErrorModal from "components/common/ErrorModal";
import { type Tournament } from "types/models";
import { useTournament } from "context/TournamentContext";
import { useNavigate } from "react-router-dom";
import { homeRoute } from "routes/Router";

const getTournamentComponent = (
  tournament: Tournament
): React.ReactElement | undefined => {
  switch (tournament.type) {
    case "Round Robin":
      return <RoundRobinTournamentView />;
    case "Playoff":
      return <PlayoffTournamentView />;
    case "Preliminary Playoff":
      return <React.Fragment>Nothing here yet?</React.Fragment>; // TODO: Replace with actual component
    default:
      return undefined;
  }
};

const TournamentDetails: React.FC = (): React.ReactElement => {
  const tournament = useTournament();
  const navigate = useNavigate();
  const tournamentComponent = getTournamentComponent(tournament);

  if (tournamentComponent === undefined) {
    return (
      <ErrorModal
        open={true}
        onClose={() => {
          navigate(homeRoute);
        }}
        errorMessage={`This tournament seems to be invalid. Contact ${tournament.organizerEmail} for more information about this tournament.`}
      />
    );
  }

  /* If the tournament has not yet begun, then it is an upcoming tournament */
  return new Date(tournament.startDate).getTime() > Date.now() ? (
    <UpcomingTournamentView />
  ) : (
    tournamentComponent
  );
};

export default TournamentDetails;
