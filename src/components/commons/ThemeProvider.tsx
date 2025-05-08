"use client";

import { ThemeProvider } from "@mui/material";
import React from "react";
import theme from "@/theme/theme";

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
