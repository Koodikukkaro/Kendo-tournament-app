import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { type User } from "types/models";

interface Props {
  user?: User;
}

const cellPadding = {
  paddingLeft: 0
};

const UserInfoTable = ({ user }: Props): React.ReactElement => {
  return (
    <Table
      size="small"
      className="user-info-table"
      aria-label="User Information"
    >
      <TableBody>
        <TableRow className="name-row">
          <TableCell
            variant="head"
            component="th"
            scope="row"
            style={cellPadding}
          >
            Name:
          </TableCell>
          <TableCell>{`${user?.firstName} ${user?.lastName}`}</TableCell>
        </TableRow>

        <TableRow className="email-row">
          <TableCell
            variant="head"
            component="th"
            scope="row"
            style={cellPadding}
          >
            Email:
          </TableCell>
          <TableCell>{user?.email}</TableCell>
        </TableRow>

        <TableRow className="club-row">
          <TableCell
            variant="head"
            component="th"
            scope="row"
            style={cellPadding}
          >
            Club:
          </TableCell>
          <TableCell>
            {user?.clubName !== undefined && user?.clubName !== ""
              ? user.clubName
              : "-"}
          </TableCell>
        </TableRow>

        <TableRow className="rank-row">
          <TableCell
            variant="head"
            component="th"
            scope="row"
            style={cellPadding}
          >
            Dan-rank:
          </TableCell>
          <TableCell>
            {user?.danRank !== undefined && user?.danRank !== ""
              ? user.danRank
              : "-"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default UserInfoTable;
