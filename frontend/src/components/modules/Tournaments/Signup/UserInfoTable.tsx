import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { type User } from "types/models";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

interface Props {
  user?: User;
}

const UserInfoTable = ({ user }: Props): React.ReactElement => {
  const { t } = useTranslation();

  const rows = {
    name: {
      label: `${t("user_info_labels.name")}:`,
      value: `${user?.firstName} ${user?.lastName}` ?? "-"
    },
    email: {
      label: `${t("user_info_labels.email_address")}:`,
      value: user?.email ?? "-"
    },
    club: {
      label: `${t("user_info_labels.club")}:`,
      value: user?.clubName ?? "-"
    },
    rank: {
      label: `${t("user_info_labels.dan_rank")}:`,
      value: user?.danRank ?? "-"
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        className="user-info-table"
        aria-label={t("signup_labels.useer_info_table")}
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
