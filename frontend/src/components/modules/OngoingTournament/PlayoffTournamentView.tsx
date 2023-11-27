/* TODO: Get tournament's matches from API to get the players for each match.
The tournament bracket is initially created with them.
 */

import React from "react";
import TournamentBracket from "./TournamentBracket";
import "./PlayoffTournamentView.css";

const PlayoffTournamentView: React.FC = () => {
  const initialPlayers = [
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4"
  ];
  const initialWinners: string[] = [];

  return (
    <div>
      <TournamentBracket
        players={initialPlayers}
        initialWinners={initialWinners}
      />
    </div>
  );
};

export default PlayoffTournamentView;
