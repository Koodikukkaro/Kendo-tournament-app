import React, { useState, useEffect, type ReactNode } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
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
import { Match, MatchPlayer, User } from "types/models";
import { useParams } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { useTournament } from "context/TournamentContext";
import api from "api/axios";


interface tournamentPlayer {
  name: string;
  wins: number;
  losses: number;
  points: number;
}

interface NamesState {
  player1: string;
  player2: string;
}

const RoundRobinTournamentView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [numberOfAttendees, setNumberOfAttendees] = useState(0);
  const [namePairs, setNamePairs] = useState<NamesState[]>([
    { player1: "", player2: "" }
  ]);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [ongoingMatchElements, setOngoingMatchElements] = useState<ReactNode[]>([]);
  const [upcomingMatchElements, setUpcomingMatchElements] = useState<ReactNode[]>([]);
  
  const { matchId } = useParams();
  const { userId } = useAuth();
  let officialId: string = "";
  let winner: string | undefined;
  const tournament = useTournament();
  let players: tournamentPlayer[] = [];
  let ongoingMatches: Match[] = [];
  let upcomingMatches: Match[] = [];

  useEffect(() => {
    const getPlayerNames = async (): Promise<void> => {
      const playersIds: string[] = tournament.players;
      if (playersIds.length > 0) {
        for (let i = 0; i < playersIds.length; i++) {
          players[i].name = (await api.user.details(playersIds[i])).firstName;
        }
      }
      const mappedMatchPlayers: NamesState[] = [];
      if (players.length > 0) {
        for (let i = 0; i < players.length; i += 2) {
          const nameState: NamesState = {
            player1: players[i].name || "",
            player2: players[i + 1].name || "",
          };
          mappedMatchPlayers.push(nameState);
        }
        setNamePairs(mappedMatchPlayers);
        setNumberOfAttendees(players.length);
        /* TODO: Get the wins, losses
          and points for every attending player. */
        
      }
    };

    void getPlayerNames();

    const sortMatches = (): void => {
      const matches: Match[] = tournament.matchSchedule;
      const currentDate = new Date();
    
      if (matches.length > 0) {
        const sortedMatches = matches
          .filter((match) => match.startTimestamp !== undefined)
          .sort((a, b) => {
            const dateA = a.startTimestamp as Date;
            const dateB = b.startTimestamp as Date;
            return dateB.getTime() - dateA.getTime();
          });
    
        // Sort matches into ongoing and upcoming
        ongoingMatches = sortedMatches.filter(
          (match) => match.startTimestamp && match.startTimestamp <= currentDate
        );
    
        upcomingMatches = sortedMatches.filter(
          (match) => match.startTimestamp && match.startTimestamp > currentDate
        );
      }
    };
    
  void sortMatches();

}, []);

  useEffect(() => {
    const flattenedNames: string[] = namePairs.flatMap((pair) => [
      pair.player1,
      pair.player2
    ]);
    const initialTableData: string[][] = flattenedNames.map((name) => [
      name,
      "0",
      "0",
      "0"
    ]);
    setTableData(initialTableData);
  }, [namePairs]);

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

  useEffect(() => {
    const fetchAndRenderMatches = async () => {
      const ongoingElements = [];
      const upcomingElements = [];

      for (const [index, match] of ongoingMatches.entries()) {
        const player1Details = await api.user.details(match.players[0].id);
        const player2Details = await api.user.details(match.players[1].id);
        ongoingElements.push(
          <div style={{ marginBottom: "10px" }} key={index}>
            <Button variant="contained">
              {`${player1Details.firstName} - ${player2Details.firstName}`}
            </Button>
          </div>
        );
      }

      for (const [index, match] of upcomingMatches.entries()) {
        const player1Details = await api.user.details(match.players[0].id);
        const player2Details = await api.user.details(match.players[1].id);
        upcomingElements.push(
          <div style={{ marginBottom: "10px" }} key={index}>
            <Button variant="contained">
              {`${player1Details.firstName} - ${player2Details.firstName}`}
            </Button>
          </div>
        );
      }

      setOngoingMatchElements(ongoingElements);
      setUpcomingMatchElements(upcomingElements);
    };

    void fetchAndRenderMatches();
  }, [ongoingMatches, upcomingMatches]);
  

  return (
    <>
      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => {
          setSelectedTab(index);
        }}
      >
        <TabList>
          <Tab>Scoreboard</Tab>
          <Tab>Matches</Tab>
        </TabList>

        <TabPanel>
          <div>{generateTable()}</div>
        </TabPanel>

        <TabPanel>
          <div>
            <Typography variant="h5">Ongoing matches:</Typography>
          </div>
          <div>{ongoingMatchElements}</div>

          <div>
            <Typography variant="h5">Upcoming matches:</Typography>
          </div>
          <div>{upcomingMatchElements}</div>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default RoundRobinTournamentView;
