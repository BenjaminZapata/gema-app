"use client";

import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box
      display={"flex"}
      p={3}
      flexWrap={"wrap"}
      gap={2}
      margin={"auto"}
      justifyContent={"center"}
    >
      <Box
        minWidth={"48%"}
        height={"200px"}
        sx={(theme) => ({
          background: theme.palette.background.default,
          border: `solid 1px ${theme.palette.primary.dark}`,
          borderRadius: theme.spacing(3),
        })}
      ></Box>
      <Box
        minWidth={"48%"}
        height={"200px"}
        sx={(theme) => ({
          background: theme.palette.background.default,
          border: `solid 1px ${theme.palette.primary.dark}`,
          borderRadius: theme.spacing(3),
        })}
      ></Box>
      <Box
        minWidth={"48%"}
        height={"500px"}
        sx={(theme) => ({
          background: theme.palette.background.default,
          border: `solid 1px ${theme.palette.primary.dark}`,
          borderRadius: theme.spacing(3),
        })}
      ></Box>
      <Box
        minWidth={"48%"}
        height={"500px"}
        sx={(theme) => ({
          background: theme.palette.background.default,
          border: `solid 1px ${theme.palette.primary.dark}`,
          borderRadius: theme.spacing(3),
        })}
      ></Box>
    </Box>
  );
}
