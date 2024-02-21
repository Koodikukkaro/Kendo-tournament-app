import React, { type ReactElement, useEffect, useState } from "react";
import { type Tournament } from "types/models";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams
} from "react-router-dom";
import { useTournaments } from "./TournamentsContext";
import Loader from "components/common/Loader";
import ErrorModal from "components/common/ErrorModal";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

/*
 * Child provider for singular tournament components.
 * Acts as a provider for searching the tournament from the parent 'TournamentsProvider',
 * and passing it to the child component(s).
 * */
export const TournamentProvider = (): ReactElement => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { upcoming, ongoing, past, isLoading, isError } = useTournaments();
  const [value, setValue] = useState<Tournament | undefined>();
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setValue(
      upcoming.find((x) => x.id === id) ??
        ongoing.find((x) => x.id === id) ??
        past.find((x) => x.id === id)
    );
    setIsInitialRender(false);
  }, [isLoading, upcoming, ongoing, past, id]);

  if (isLoading || isInitialRender) {
    return <Loader />;
  }

  /* If there is no error and no tournament found for the id in the route,
   * render an error modal and navigate back to the tournaments page.
   * We only render child components if there is valid data to display.
   */
  if (!isError && value === undefined) {
    return (
      <ErrorModal
        open={true}
        onClose={() => {
          navigate(routePaths.homeRoute);
        }}
        errorMessage={t("messages.tournament_info_not_found")}
      />
    );
  }

  return <Outlet context={value} />;
};

export const useTournament = (): Tournament => useOutletContext<Tournament>();
