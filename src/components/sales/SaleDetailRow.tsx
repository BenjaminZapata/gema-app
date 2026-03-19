import {
  PaymentMethodsTypes,
  ProductTypes,
  SaleDetailTypes,
  SalesTypes,
} from "@/types/CommonTypes";
import { months } from "@/utils/Commons";
import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonProps,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import React, { SyntheticEvent, useState } from "react";
import { DeleteSaleDialog } from "./salesDialogs/DeleteSaleDialog";
import { SaleProductsListDialog } from "./salesDialogs/SaleProductsListDialog";
import { SaleProductDetail } from "./SaleProductDetail";

const SaleDeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.common.black}`,
  borderRadius: theme.spacing(1),
  height: theme.spacing(4),
  minWidth: theme.spacing(0),
  padding: theme.spacing(0.5),
  width: theme.spacing(4),
  "& .MuiSvgIcon-root": {
    height: theme.spacing(2.5),
    width: theme.spacing(2.5),
  },
}));

interface SaleDetailRowTypes {
  detalles: SaleDetailTypes[] | undefined;
  expanded: string | false;
  handleChange: (
    panel: string
  ) => (event: SyntheticEvent<Element, Event>, expanded: boolean) => void;
  handleSaleDelete: (id: number) => void;
  index: number;
  isFirstSaleOfMonth?: boolean;
  paymentMethods: PaymentMethodsTypes[];
  products: ProductTypes[];
  sale: SalesTypes;
  sales: SalesTypes[];
}

export const SaleDetailRow = ({
  detalles,
  expanded,
  handleChange,
  handleSaleDelete,
  index,
  isFirstSaleOfMonth = false,
  paymentMethods,
  products,
  sale,
  sales,
}: SaleDetailRowTypes) => {
  const theme = useTheme();
  const [deleteSaleOpen, setDeleteSaleOpen] = useState<boolean>(false);
  const date = new Date(sale.fecha);
  const day = date.getDate();
  const month = date.getMonth();
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(
    2,
    "0"
  )}:${String(date.getSeconds()).padStart(2, "0")}`;
  const barColor = lighten(
    theme.palette.primary.main,
    Math.min(0.9, 0.12 + month * 0.06)
  );
  const paymentMethod = paymentMethods
    ? paymentMethods?.find((p) => p.id == String(sale.mediosdepago))?.nombre
    : "";

  const { id, total } = sale;
  const isExpanded = expanded === `panel${index}`;

  return (
    <>
      <TableRow hover key={id} sx={{ width: "100%" }}>
        <TableCell
          data-name="SaleDateCell"
          sx={{
            position: "relative",
            borderBottom:
              index == sales.length - 1
                ? "none"
                : "1px solid rgba(224, 224, 224, 1)",
            minWidth: "90px",
            p: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {isFirstSaleOfMonth && (
              <Box
                sx={{
                  position: "absolute",
                  left: theme.spacing(1),
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: theme.spacing(1.25),
                  height: isExpanded ? theme.spacing(6) : theme.spacing(5),
                  borderRadius: `${theme.shape.borderRadius}px 2px 2px ${theme.shape.borderRadius}px`,
                  backgroundColor: barColor,
                  flexShrink: 0,
                }}
              />
            )}
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              width={"100%"}
              sx={{
                pl: isFirstSaleOfMonth
                  ? `calc(${theme.spacing(1.25)} + ${theme.spacing(2)})`
                  : 0,
              }}
            >
              <Typography variant="h6">
                {day} de {months[month].slice(0, 3).toUpperCase()}
              </Typography>
              <Typography>{time}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          data-name="SaleDetailsCell"
          sx={{
            borderBottom:
              index == sales.length - 1
                ? "none"
                : "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          <Box
            sx={(theme) => ({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingInline: theme.spacing(),
            })}
          >
            <Box width={"75%"}>
              <Accordion
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
              >
                <AccordionSummary
                  data-name="SaleAccordion"
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={(theme) => ({
                    minHeight: theme.spacing(0),
                    "& .MuiAccordionSummary-content": {
                      marginY: theme.spacing(1),
                    },
                    "&.Mui-expanded": {
                      minHeight: theme.spacing(0),
                    },
                    "& .MuiAccordionSummary-content.Mui-expanded": {
                      marginY: theme.spacing(2),
                    },
                  })}
                >
                  <Typography component="span" fontSize={"12px"}>
                    {detalles?.length} productos
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {detalles?.slice(0, 5).map((d, index) => {
                    const productData = products.find(
                      (p) => p.id == d.productocodigo
                    );
                    if (!productData) return;
                    const { nombre } = productData;

                    if (index + 1 == 5) {
                      return (
                        <SaleProductsListDialog
                          details={detalles}
                          key={"seeAllProducts"}
                          products={products}
                          saleId={id}
                        />
                      );
                    }

                    return (
                      <Box key={`${id}-${d.id}`}>
                        <SaleProductDetail detail={d} name={nombre} />
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box width={"25%"}>
              <Typography fontSize={"15px"}>
                $
                <Typography
                  component={"span"}
                  fontWeight={600}
                  fontSize={"15px"}
                >
                  {total}
                </Typography>
              </Typography>
              <Tooltip disableInteractive title={paymentMethod}>
                <Typography
                  fontSize={"13px"}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {paymentMethod}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          sx={{
            borderBottom:
              index == sales.length - 1
                ? "none"
                : "1px solid rgba(224, 224, 224, 1)",
            width: "40px",
          }}
        >
          <Tooltip title="Eliminar venta">
            <SaleDeleteButton
              variant="contained"
              color="error"
              onClick={() => setDeleteSaleOpen(true)}
            >
              <Delete />
            </SaleDeleteButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <DeleteSaleDialog
        id={id}
        open={deleteSaleOpen}
        setOpen={setDeleteSaleOpen}
        handleDelete={handleSaleDelete}
      />
    </>
  );
};
