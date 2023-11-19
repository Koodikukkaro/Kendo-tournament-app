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
import "../../common/Style/common.css";

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

  useEffect(() => {
    const fetchMatchData = async (): Promise<void> => {
      /* TODO: Actual API call to get the names, wins, losses
        and points for every attending player.
        Check which matches are upcoming and which ongoing. */
      try {
        const mappedMatchPlayers: NamesState[] = [
          { player1: "Jukka", player2: "Matti" },
          { player1: "Pekka", player2: "Katti" }
        ];
        setNamePairs(mappedMatchPlayers);
        /* TODO: This needs a counter to actually count the number of attendees */
        setNumberOfAttendees(4);
      } catch (error) {
        console.error("Error fetching match data", error);
      }
    };

    void fetchMatchData();
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

  return (
    <div className="app-container">
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
          <div>
            {namePairs.map((match, index) => (
              <div style={{ marginBottom: "10px" }} key={index}>
                <Button variant="contained">
                  {`${match.player1} - ${match.player2}`}
                </Button>
              </div>
            ))}
          </div>
          <div>
            <Typography variant="h5">Upcoming matches:</Typography>
          </div>
          <div>{/* Add matches here */}</div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default RoundRobinTournamentView;
