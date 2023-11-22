/* TODO: Get tournament's matches from API to get the players for each match.
The tournament bracket is initially created with them (row 98).
Also get the match winner from match data to use it on row 50 and add it
to the next round's players (row 53). 
Right now isRoundFinished is controlled by a button for testing reasons.
It is set to true when all the matches of the round are finished to generate the next round.
This should be changed to happen automatically.
It would be nice to have all rounds visible from the start and have placeholders 
(like Player 1/Player 2 vs Player 3/Player 4) for every round
and then add the winner's names when isRoundFinished changes. 
The buttons on row 79 should lead to the specific match's page.
 */

import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid, Button } from "@mui/material";

import "./style.css";

interface TournamentBracketProps {
  players: string[];
  initialWinners: string[];
}

interface Match {
  players: string[];
  winners: string[];
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  players,
  initialWinners
}) => {
  const [rounds, setRounds] = useState<Match[][]>([]);
  const [winners, setWinners] = useState<string[]>(initialWinners);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isRoundFinished) {
      const roundPlayers = roundNumber === 1 ? players : winners;
      const newRound: Match[] = generateMatches(roundPlayers);
      setRounds((prevRounds) => [...prevRounds, newRound]);
      setWinners(newRound.flatMap((match) => match.winners));
      setRoundNumber((prevRoundNumber) => prevRoundNumber + 1);
      setIsRoundFinished(false);
    }
  }, [isRoundFinished, winners, players, roundNumber]);

  const generateMatches = (roundPlayers: string[]): Match[] => {
    const matches: Match[] = [];

    for (let i = 0; i < roundPlayers.length; i += 2) {
      const matchWinner = roundPlayers[i]; // Winner is the left player for simplicity

      const match: Match = {
        players: [roundPlayers[i], roundPlayers[i + 1]],
        winners: [matchWinner]
      };

      matches.push(match);
    }

    return matches;
  };

  const handleNextRound = (): void => {
    setIsRoundFinished(true);
  };

  return (
    <Paper className="tournamentBracketRoot" elevation={3}>
      <Typography variant="h5" gutterBottom>
        Tournament name
      </Typography>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex}>
          <Typography variant="subtitle1">Round {roundIndex + 1}</Typography>
          <Grid container spacing={2} className="bracketContainer">
            {round.map((match, matchIndex) => (
              <Grid
                key={matchIndex}
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="matchGridItem"
              >
                <div className="matchContainer">
                  <Button>
                    {match.players[0]} vs {match.players[1]}
                    <br></br>
                    Winner: {match.winners[0]}{" "}
                    {/* We can print the winner like this or bold the name etc. */}
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNextRound}
        disabled={isRoundFinished}
      >
        Generate Next Round
      </Button>
    </Paper>
  );
};

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
