"use client";

import React from "react";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChipSalesList } from "@/components/sales/ChipSalesList";
import { PageSpinner } from "@/components/commons/PageSpinner";
import { BarChartComponent } from "@/components/commons/BarChartComponent";
import { SalesDetailsList } from "@/components/sales/SalesDetailsList";
import { useSalesPage } from "@/hooks/pages/useSalesPage";

export default function SalesPage() {
  const {
    getDayTotal,
    getDayTotalByPaymentMethod,
    barChartData,
    barChartSeries,
    barChartMonthTotals,
    monthsToShow,
    setMonthsToShow,
    handleAddProduct,
    handlePaymentChange,
    handleProductQuantityChange,
    handleSaleDelete,
    handleSaleSubmit,
    isClient,
    loading,
    open,
    paymentMethods,
    paymentMethodSelected,
    products,
    productsChartData,
    productsList,
    resetSale,
    sales,
    setOpen,
    statusSales,
    total,
  } = useSalesPage();

  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <Box display={"flex"} justifyContent={"space-between"} mt={2}>
          <Box width={{ sm: "55%", lg: "60%" }}>
            <ChipSalesList
              handleAddProduct={handleAddProduct}
              handleProductQuantityChange={handleProductQuantityChange}
              handleSaleSubmit={handleSaleSubmit}
              open={open}
              paymentMethods={paymentMethods}
              productsList={productsList}
              setOpen={setOpen}
              total={total}
              resetSale={resetSale}
              paymentMethodSelected={paymentMethodSelected}
              handlePaymentChange={handlePaymentChange}
            />
            <SalesDetailsList
              paymentMethods={paymentMethods}
              products={products}
              sales={sales}
              statusSales={statusSales}
              handleSaleDelete={handleSaleDelete}
            />
          </Box>
          <Box width={{ sm: "40%", lg: "37.5%" }}>
            {isClient && productsChartData.length !== 0 ? (
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                flexDirection={"column"}
                gap={2}
              >
                <Typography variant="h4">Resumen</Typography>
                <Divider sx={{ width: "90%" }} />
                <Typography
                  variant="h6"
                  sx={(theme) => ({ marginLeft: theme.spacing(2) })}
                >
                  Total del dia: ${getDayTotal().toFixed(2)}
                </Typography>
                <Box sx={{ marginLeft: 2 }}>
                  {getDayTotalByPaymentMethod().map((payment) => (
                    <Typography
                      key={payment.id}
                      variant="body1"
                      sx={{
                        color: "gray",
                        cursor: "pointer",
                        fontWeight: "500",
                        width: "fit-content",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {payment.nombre}: ${payment.total.toFixed(2)}
                    </Typography>
                  ))}
                </Box>
                {barChartData.length > 0 && barChartSeries.length > 0 ? (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, marginLeft: 2, flexWrap: "wrap", mb: 2 }}>
                    <Typography variant="h6">
                      Ingresos por método de pago (últimos {monthsToShow} meses)
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel id="sales-months-select-label">Meses</InputLabel>
                      <Select
                        labelId="sales-months-select-label"
                        id="sales-months-select"
                        value={String(monthsToShow)}
                        label="Meses"
                        onChange={(event: SelectChangeEvent) =>
                          setMonthsToShow(Number(event.target.value))
                        }
                      >
                        {[1, 3, 6, 9, 12].map((months) => (
                          <MenuItem key={months} value={months}>
                            {months === 1
                              ? "Último mes"
                              : `Últimos ${months} meses`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                    <BarChartComponent
                      width={upLg ? 500 : 360}
                      height={340}
                      data={barChartData}
                      xAxis={[
                        {
                          dataKey: "month",
                          valueFormatter: (value: string, context: any) => {
                            if (context.location === "tooltip") {
                              const total = barChartMonthTotals[String(value)] ?? 0;
                              const monthLabel = String(value).split(" ")[0];
                              return `Total ${monthLabel}: $${total.toFixed(2)}`;
                            }
                            return String(value);
                          },
                        },
                      ]}
                      yAxis={[{ min: 0, width: 40 }]}
                      series={barChartSeries}
                      slotProps={{
                        tooltip: {
                          trigger: "axis",
                          sort: "desc",
                        },
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
    </>
  );
}
