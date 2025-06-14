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
  paymentMethods,
  products,
  sale,
  sales,
}: SaleDetailRowTypes) => {
  const [deleteSaleOpen, setDeleteSaleOpen] = useState<boolean>(false);
  const date = new Date(sale.fecha);
  const day = date.getDate();
  const month = date.getMonth();
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(
    2,
    "0"
  )}:${String(date.getSeconds()).padStart(2, "0")}`;
  const paymentMethod = paymentMethods
    ? paymentMethods?.find((p) => p.id == String(sale.mediosdepago))?.nombre
    : "";

  const { id, total } = sale;

  return (
    <>
      <TableRow hover key={id} sx={{ width: "100%" }}>
        <TableCell
          sx={{
            alignItems: "center",
            borderBottom:
              index == sales.length - 1
                ? "none"
                : "1px solid rgba(224, 224, 224, 1)",
            display: "flex",
            flexDirection: "column",
            minWidth: "90px",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={expanded === `panel${index}` ? "200px" : ""}
          >
            <Typography variant="h6">
              {day} de {months[month].slice(0, 3).toUpperCase()}
            </Typography>
            <Typography>{time}</Typography>
          </Box>
        </TableCell>
        <TableCell
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
