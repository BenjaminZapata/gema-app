import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const PageSpinner = () => {
  return (
    <Box margin={"auto"} width={"fit-content"}>
      <CircularProgress disableShrink sx={{ margin: "40vh auto" }} />
    </Box>
  );
};
