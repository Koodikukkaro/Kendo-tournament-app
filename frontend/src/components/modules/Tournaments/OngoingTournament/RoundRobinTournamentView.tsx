import React, { useState, useEffect, type ReactNode } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from "@mui/material";
import "react-tabs/style/react-tabs.css";
import { type User, type Match } from "types/models";
import { useNavigate } from "react-router-dom";
import { useTournament } from "context/TournamentContext";
import api from "api/axios";

interface tournamentPlayer {
  id: string;
  name: string;
  wins: number;
  losses: number;
  points: number;
}

const RoundRobinTournamentView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("scoreboard");
  const [numberOfAttendees, setNumberOfAttendees] = useState(0);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [ongoingMatchElements, setOngoingMatchElements] = useState<ReactNode[]>(
    []
  );
  const [upcomingMatchElements, setUpcomingMatchElements] = useState<
    ReactNode[]
  >([]);

  const tournament = useTournament();
  const players: tournamentPlayer[] = [];
  let ongoingMatches: Match[] = [];
  let upcomingMatches: Match[] = [];
  const navigate = useNavigate();

  useEffect(() => {
    const getPlayerNames = async (): Promise<void> => {
      const playersObjects: User[] = tournament.players;
      if (playersObjects.length > 0) {
        for (const playerObject of playersObjects) {
          const playerExists = players.some(
            (player) => player.id === playerObject.id
          );
          if (!playerExists) {
            players.push({
              id: playerObject.id,
              name: playerObject.firstName,
              wins: 0,
              losses: 0,
              points: 0
            });
          }
        }
      }
      setNumberOfAttendees(players.length);

      console.log(players);
      const playerNames = players.map((player) => player.name);
      console.log(playerNames);

      const initialTableData: string[][] = playerNames.map((name) => [
        name,
        "0",
        "0",
        "0"
      ]);
      setTableData(initialTableData);
    };

    void getPlayerNames();

    const sortMatches = (): void => {
      const matches: Match[] = tournament.matchSchedule;
      const currentDate = new Date();

      if (matches.length > 0) {
        const sortedMatches = matches
          .filter((match) => match.timerStartedTimestamp !== undefined)
          .sort((a, b) => {
            if (
              a.timerStartedTimestamp === null &&
              b.timerStartedTimestamp === null
            ) {
              return 0;
            } else if (a.timerStartedTimestamp === null) {
              return -1;
            } else if (b.timerStartedTimestamp === null) {
              return 1;
            } else {
              const timeA = a.timerStartedTimestamp;
              const timeB = b.timerStartedTimestamp;
              return timeB.getTime() - timeA.getTime();
            }
          });

        ongoingMatches = sortedMatches.filter(
          (match) =>
            match.timerStartedTimestamp !== null &&
            match.timerStartedTimestamp <= currentDate
        );
        upcomingMatches = sortedMatches.filter(
          (match) =>
            match.timerStartedTimestamp === null ||
            match.timerStartedTimestamp > currentDate
        );
      }
    };
    sortMatches();
  }, [tournament]);

  useEffect(() => {
    const createMatchButtons = async (): Promise<void> => {
      const ongoingElements = [];
      const upcomingElements = [];

      const handleButtonClick = (matchId: string) => {
        return () => {
          navigate(`/matches/${matchId}`);
        };
      };

      for (const [index, match] of ongoingMatches.entries()) {
        const player1 = (await api.user.details(match.players[0].id)).firstName;
        const player2 = (await api.user.details(match.players[1].id)).firstName;
        ongoingElements.push(
          <div style={{ marginBottom: "10px" }} key={index}>
            <Button variant="contained" onClick={handleButtonClick(match.id)}>
              {`${player1} - ${player2}`}
            </Button>
          </div>
        );
      }
      for (const [index, match] of upcomingMatches.entries()) {
        const player1 = (await api.user.details(match.players[0].id)).firstName;
        const player2 = (await api.user.details(match.players[1].id)).firstName;
        upcomingElements.push(
          <div style={{ marginBottom: "10px" }} key={index}>
            <Button variant="contained" onClick={handleButtonClick(match.id)}>
              {`${player1} - ${player2}`}
            </Button>
          </div>
        );
      }
      setOngoingMatchElements(ongoingElements);
      setUpcomingMatchElements(upcomingElements);
    };

    void createMatchButtons();
  }, []);

  const generateTableCells = (rowIndex: number): React.ReactNode[] => {
    return tableData[rowIndex]?.map((content, columnIndex) => (
      <TableCell key={columnIndex}>
        <Typography>{content}</Typography>
      </TableCell>
    ));
  };

  const generateTable = (): ReactNode => {
    const tableHeaders = ["Name", "Wins", "Losses", "Points"];
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: numberOfAttendees }, (_, index) => (
              <TableRow key={index}>{generateTableCells(index)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => {
          setSelectedTab(newValue);
        }}
      >
        <Tab label="Scoreboard" value="scoreboard" />
        <Tab label="Matches" value="matches" />
      </Tabs>
      {selectedTab === "scoreboard" && <div>{generateTable()}</div>}

      {selectedTab === "matches" && (
        <div>
          <div>
            <Typography variant="h5">Ongoing matches:</Typography>
          </div>
          <div>{ongoingMatchElements}</div>

          <div>
            <Typography variant="h5">Upcoming matches:</Typography>
          </div>
          <div>{upcomingMatchElements}</div>
        </div>
      )}
    </>
  );
};

export default RoundRobinTournamentView;
