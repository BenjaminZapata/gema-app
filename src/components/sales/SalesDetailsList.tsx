import {
  PaymentMethodsTypes,
  ProductTypes,
  SalesTypes,
} from "@/types/CommonTypes";
import { StatusTypes } from "@/utils/Commons";
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
import React, { useEffect, useState } from "react";
import { SaleDetailRow } from "./SaleDetailRow";

interface SalesDetailsListTypes {
  paymentMethods: PaymentMethodsTypes[];
  products: ProductTypes[];
  handleSaleDelete: (id: number) => void;
  sales: SalesTypes[];
  statusSales: StatusTypes;
}

export const SalesDetailsList = ({
  paymentMethods,
  products,
  handleSaleDelete,
  sales,
  statusSales,
}: SalesDetailsListTypes) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [filteredSales, setFilteredSales] = useState<SalesTypes[]>(sales);

  useEffect(() => {
    setFilteredSales(sales);
  }, [sales]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

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
                <TableCell
                  key={"actions-tableHead"}
                  sx={{
                    width: "40px",
                  }}
                >
                  X
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length == 0 ? (
                <TableRow sx={{ width: "100%" }}>
                  <TableCell colSpan={3}>
                    <Typography variant="h5" my={4}>
                      No hay ventas agregadas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((s, index) => {
                  return (
                    <SaleDetailRow
                      detalles={s.detalles}
                      expanded={expanded}
                      handleChange={handleChange}
                      index={index}
                      key={s.id}
                      paymentMethods={paymentMethods}
                      products={products}
                      handleSaleDelete={handleSaleDelete}
                      sale={s}
                      sales={sales}
                    />
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
