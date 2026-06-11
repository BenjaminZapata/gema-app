import React from "react";
import { BarChart } from "@mui/x-charts";

export type BarChartSeriesType = {
  dataKey: string;
  label: string;
  stack?: string;
  color?: string;
  valueFormatter?: (value: number | string | null) => string;
};

export const BarChartComponent = ({
  height = 320,
  width,
  data = [],
  xAxis,
  yAxis,
  series = [],
  slotProps,
}: {
  height?: number;
  width?: number;
  data: Array<Record<string, unknown>>;
  xAxis: Array<any>;
  yAxis?: Array<any>;
  series: Array<BarChartSeriesType>;
  slotProps?: any;
}) => {
  if (data.length === 0 || series.length === 0) return null;

  return (
    <BarChart
      dataset={data}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={height}
      width={width}
      slotProps={slotProps}
    />
  );
};
