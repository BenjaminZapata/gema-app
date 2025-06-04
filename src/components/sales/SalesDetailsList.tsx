import { SalesTypes } from "@/types/CommonTypes";
import { months, StatusTypes } from "@/utils/Commons";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface SalesDetailsListTypes {
  sales: SalesTypes[];
  statusSales: StatusTypes;
}

export const SalesDetailsList = ({
  sales,
  statusSales,
}: SalesDetailsListTypes) => {
  const [filteredSales, setFilteredSales] = useState([]);

  return (
    <>
      {statusSales == "loading" ? (
        <Box margin={"auto"} width={"fit-content"}>
          <CircularProgress disableShrink sx={{ margin: "30svh auto" }} />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 .2em" }}>
            {" "}
            <TableHead>
              <TableRow>
                <TableCell key={"date-tableHead"}>Fecha</TableCell>
                <TableCell key={"body-tableHead"}>Detalles</TableCell>
                <TableCell key={"body-tableHead"}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((s) => {
                const date = new Date(s.fecha);
                const day = date.getDate();
                const month = date.getMonth();
                const time = `${date.getHours()}:${date.getMinutes()}:${String(
                  date.getSeconds()
                ).padStart(2, "0")}`;

                return (
                  <TableRow key={s.id} sx={(theme) => ({ width: "100%" })}>
                    <TableCell
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6">
                        {day} de {months[month].slice(0, 3).toUpperCase()}
                      </Typography>
                      <Typography>{time}</Typography>
                    </TableCell>
                    <TableCell sx={{}}>dasdsad</TableCell>
                    <TableCell sx={{}}>dasdsad</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
