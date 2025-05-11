import React from "react";
import { Box } from "@mui/material";
import { Navbar } from "../navbar/Navbar";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display={"flex"}>
      <Navbar />
      <Box
        ml={9}
        padding={2}
        height={"100vh"}
        width={"calc(100vw - 72px)"}
        sx={{ background: "whitesmoke" }}
      >
        {children}
      </Box>
    </Box>
  );
};
