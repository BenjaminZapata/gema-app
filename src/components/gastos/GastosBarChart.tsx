"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BarChartComponent } from "@/components/commons/BarChartComponent";
import { type Gasto } from "@/components/gastos/AddGastoDialog";

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const getMonthLabels = (count: number) => {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const offset = count - 1 - index;
    const monthDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    return {
      key: getMonthKey(monthDate),
      label: monthDate.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      }),
    };
  });
};

const normalizePaymentKey = (value: string) =>
  `pm_${value.replace(/\s+/g, "_").replace(/[^\w]/g, "")}`;

export const GastosBarChart = ({ gastos }: { gastos: Array<Gasto & { metodoPago?: string }> }) => {
  const [monthsToShow, setMonthsToShow] = useState<number>(3);
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  const { chartData, chartSeries, monthTotals } = useMemo(() => {
    const months = getMonthLabels(monthsToShow);
    const validKeys = new Set(months.map((month) => month.key));
    const paymentMethods = Array.from(
      new Set(gastos.map((g) => g.metodoPago).filter(Boolean) as string[])
    );

    const monthPaymentTotals: Record<string, Record<string, number>> = {};
    const totalsByMonth: Record<string, number> = {};

    gastos.forEach((gasto) => {
      if (!gasto.metodoPago) return;
      const gastoDate = new Date(gasto.fecha);
      const gastoKey = getMonthKey(gastoDate);
      if (!validKeys.has(gastoKey)) return;

      const methodKey = normalizePaymentKey(gasto.metodoPago);
      monthPaymentTotals[gastoKey] = monthPaymentTotals[gastoKey] ?? {};
      monthPaymentTotals[gastoKey][methodKey] =
        (monthPaymentTotals[gastoKey][methodKey] ?? 0) + gasto.total;
      totalsByMonth[gastoKey] = (totalsByMonth[gastoKey] ?? 0) + gasto.total;
    });

    const data = months.map(({ key, label }) => {
      const row: Record<string, unknown> = { month: label };
      paymentMethods.forEach((method) => {
        const methodKey = normalizePaymentKey(method);
        row[methodKey] = monthPaymentTotals[key]?.[methodKey] ?? 0;
      });
      return row;
    });

    const series = paymentMethods.map((method) => ({
      dataKey: normalizePaymentKey(method),
      label: method,
      stack: "payments",
      valueFormatter: (value: number | string | null) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : "",
    }));

    const monthTotalsLabel = months.reduce<Record<string, number>>((acc, month) => {
      acc[month.label] = totalsByMonth[month.key] ?? 0;
      return acc;
    }, {});

    return {
      chartData: data,
      chartSeries: series,
      monthTotals: monthTotalsLabel,
    };
  }, [gastos, monthsToShow]);

  if (chartData.length === 0 || chartSeries.length === 0) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4">Resumen</Typography>
        <Typography>No hay datos de gastos para mostrar en el gráfico.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Resumen</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">
          Gastos por método (últimos {monthsToShow} meses)
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="gastos-months-select-label">Meses</InputLabel>
          <Select
            labelId="gastos-months-select-label"
            id="gastos-months-select"
            value={String(monthsToShow)}
            label="Meses"
            onChange={(event: SelectChangeEvent) => setMonthsToShow(Number(event.target.value))}
          >
            {[1, 3, 6, 9, 12].map((months) => (
              <MenuItem key={months} value={months}>
                {months === 1 ? "Último mes" : `Últimos ${months} meses`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <BarChartComponent
        width={upLg ? 500 : 360}
        height={340}
        data={chartData}
        xAxis={[
          {
            dataKey: "month",
            valueFormatter: (value: string, context: any) => {
              if (context.location === "tooltip") {
                const total = monthTotals[String(value)] ?? 0;
                return `Total ${String(value)}: $${total.toFixed(2)}`;
              }
              return String(value);
            },
          },
        ]}
        yAxis={[{ min: 0, width: 40 }]}
        series={chartSeries}
        slotProps={{
          tooltip: {
            trigger: "axis",
            sort: "desc",
          },
        }}
      />
    </Box>
  );
};
