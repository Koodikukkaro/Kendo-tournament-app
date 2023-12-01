import React from "react";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";

interface TableComponentProps {
  cells: string[][];
}

const PointTable: React.FC<TableComponentProps> = ({ cells }) => {
  return (
    <div className="tableContainer">
      <Table>
        <TableBody>
          {cells.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <TableCell key={columnIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PointTable;
