import React, { useCallback } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface NameFilterProps {
  nameInput: string;
  setNameInput: (data: string) => void;
}

export const NameFilter = React.memo(
  ({ nameInput, setNameInput }: NameFilterProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value);
      },
      [setNameInput]
    );

    const handleClear = useCallback(() => setNameInput(""), [setNameInput]);

    return (
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <TextField
          size="small"
          label="Filtro por nombre/codigo"
          variant="outlined"
          type="text"
          onChange={handleChange}
          value={nameInput}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  disabled={!nameInput}
                  onClick={() => (nameInput ? handleClear() : null)}
                  edge="end"
                  sx={{
                    cursor: nameInput ? "pointer" : "default",
                    color: nameInput.length ? "black" : "grey",
                  }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              ),
            },
          }}
        />
      </Box>
    );
  }
);

NameFilter.displayName = "NameFilter";
