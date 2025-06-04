import { SalesTypes } from "@/types/CommonTypes";
import { months, StatusTypes } from "@/utils/Commons";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  const [filteredSales, setFilteredSales] = useState(sales);

  return (
    <>
      {statusSales == "loading" ? (
        <Box margin={"auto"} width={"fit-content"}>
          <CircularProgress disableShrink sx={{ margin: "30svh auto" }} />
        </Box>
      ) : (
        <TableContainer sx={(theme) => ({ marginTop: theme.spacing(3) })}>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 .2em" }}>
            <TableHead>
              <TableRow>
                <TableCell key={"date-tableHead"}>Fecha</TableCell>
                <TableCell key={"details-tableHead"}>Detalles</TableCell>
                <TableCell key={"actions-tableHead"}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length == 0 ? (
                <TableRow sx={(theme) => ({ width: "100%" })}>
                  <TableCell colSpan={3}>
                    <Typography variant="h5" my={4}>
                      No hay ventas agregadas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((s, index) => {
                  const date = new Date(s.fecha);
                  const day = date.getDate();
                  const month = date.getMonth();
                  const time = `${date.getHours()}:${String(
                    date.getMinutes()
                  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(
                    2,
                    "0"
                  )}`;

                  return (
                    <TableRow hover key={s.id} sx={{ width: "100%" }}>
                      <TableCell
                        sx={(theme) => ({
                          alignItems: "center",
                          borderBottom:
                            index == sales.length - 1
                              ? "none"
                              : "1px solid rgba(224, 224, 224, 1)",
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "90px",
                        })}
                      >
                        <Typography variant="h6">
                          {day} de {months[month].slice(0, 3).toUpperCase()}
                        </Typography>
                        <Typography>{time}</Typography>
                      </TableCell>
                      <TableCell
                        sx={(theme) => ({
                          borderBottom:
                            index == sales.length - 1
                              ? "none"
                              : "1px solid rgba(224, 224, 224, 1)",
                        })}
                      >
                        <Box
                          sx={(theme) => ({
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingInline: theme.spacing(),
                          })}
                        >
                          <Box width={"85%"}>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <Typography component="span">
                                  Productos
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>{s.detalles.forEach()}</AccordionDetails>
                            </Accordion>
                          </Box>
                          <Typography>$ {s.total}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={(theme) => ({
                          borderBottom:
                            index == sales.length - 1
                              ? "none"
                              : "1px solid rgba(224, 224, 224, 1)",
                        })}
                      >
                        dasdsad
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
