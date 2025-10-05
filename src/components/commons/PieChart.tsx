import React from "react";
import { PieChart } from "@mui/x-charts";
import { PieChartDataTypes } from "@/types/CommonTypes";

export const PieChartComponent = ({
  height = 150,
  width = 100,
  data = [],
}: {
  height?: number;
  width?: number;
  data: Array<PieChartDataTypes>;
}) => {
  if (data.length === 0) return null;

  return (
    <PieChart
      height={height}
      colors={[
        "#1768AC",
        "#43aa8b",
        "#90be6d",
        "#f9c74f",
        "#f8961e",
        "#f3722c",
        "#f94144",
      ]}
      series={[
        {
          data: data,
          type: "pie",
        },
      ]}
      sx={{ justifyContent: "flex-start" }}
      width={width}
    />
  );
};
