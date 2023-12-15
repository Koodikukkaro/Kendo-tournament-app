import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { type User } from "types/models";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

interface Props {
  user?: User;
}

const UserInfoTable = ({ user }: Props): React.ReactElement => {
  const rows = {
    name: {
      label: "Name:",
      value: `${user?.firstName} ${user?.lastName}` ?? "-"
    },
    email: {
      label: "Email:",
      value: user?.email ?? "-"
    },
    club: {
      label: "Club:",
      value: user?.clubName ?? "-"
    },
    rank: {
      label: "Dan-rank:",
      value: user?.danRank ?? "-"
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        className="user-info-table"
        aria-label="User Information"
      >
        <TableBody>
          {Object.values(rows).map((row, index) => (
            <TableRow key={index} className={`${row.label.toLowerCase()}-row`}>
              <TableCell variant="head" component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default UserInfoTable;
