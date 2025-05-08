"use client";

import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { LinkButton, StyledNavbar } from "./StyledComponents";
import { usePathname, useRouter } from "next/navigation";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const menuOptions = [
  {
    name: "Inicio",
    link: "/",
    icon: <HomeIcon sx={{ width: "32px" }} />,
  },
  {
    name: "Productos",
    link: "/productos",
    icon: <FormatListBulletedIcon sx={{ width: "32px" }} />,
  },
  {
    name: "Ventas",
    link: "/ventas",
    icon: <ShoppingCartIcon sx={{ width: "32px" }} />,
  },
  {
    name: "Gastos",
    link: "/gastos",
    icon: <AttachMoneyIcon sx={{ width: "32px" }} />,
  },
];

export const Navbar = () => {
  const [showText, setShowText] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowText(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowText(false);
  };

  return (
    <>
      <StyledNavbar
        datatype="Navbar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          {menuOptions.map((button) => (
            <LinkButton
              key={button.name + "-menu"}
              className="button"
              pathname={pathname}
              button={button}
              onClick={() => {
                router.push(button.link);
              }}
            >
              {button.icon}
              <Typography
                className="text"
                fontSize={"14px"}
                sx={{
                  display: "none",
                  transitionDelay: "0.3s",
                }}
              >
                {showText ? button.name : ""}
              </Typography>
            </LinkButton>
          ))}
        </Box>
      </StyledNavbar>
    </>
  );
};
