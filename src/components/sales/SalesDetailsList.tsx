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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const firstSaleOfMonthIds = useMemo(() => {
    const earliestByMonth = new Map<string, { id: number; time: number }>();

    sales.forEach((sale) => {
      const date = new Date(sale.fecha);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const time = date.getTime();
      const existing = earliestByMonth.get(monthKey);
      if (!existing || time < existing.time) {
        earliestByMonth.set(monthKey, { id: sale.id, time });
      }
    });

    const firstIds = new Set<number>();
    for (const v of earliestByMonth.values()) firstIds.add(v.id);
    return firstIds;
  }, [sales]);

  const paginatedSales = useMemo(
    () =>
      sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sales, page, rowsPerPage]
  );

  const pageCount = Math.max(1, Math.ceil(sales.length / rowsPerPage));

  useEffect(() => {
    const lastPage = Math.max(0, Math.ceil(sales.length / rowsPerPage) - 1);
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [sales.length, page, rowsPerPage]);

  const handlePaginationChange = (_event: unknown, value: number) => {
    setPage(value - 1);
  };


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
                  paginatedSales.map((s, index) => {
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
                        isFirstSaleOfMonth={firstSaleOfMonthIds.has(s.id)}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, mt: 2 }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="rows-per-page-label">Ventas por página</InputLabel>
                <Select
                  labelId="rows-per-page-label"
                  id="rows-per-page-select"
                  value={String(rowsPerPage)}
                  label="Ventas por página"
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  {[10, 15, 20, 50].map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Pagination
                count={pageCount}
                page={page + 1}
                onChange={handlePaginationChange}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </TableContainer>
      )}
    </>
  );
};
