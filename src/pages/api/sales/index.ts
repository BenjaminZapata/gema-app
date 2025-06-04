import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { SaleProductDetailsTypes } from "@/utils/Commons";

interface SaleRequestBody {
  detalles: SaleProductDetailsTypes[];
  fecha: Date;
  mediosdepago: number;
  total: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: SaleRequestBody = req.body;
  try {
    switch (req.method) {
      case "GET":
        const sales = await prisma.ventas.findMany({
          include: {
            mediodepago: true,
          },
          orderBy: {
            fecha: "desc",
          },
        });
        res.status(200).json(sales);
        break;
      case "POST":
        const { detalles, fecha, mediosdepago, total } = data;
        console.log(data);
        //^ Verificamos que la informacion haya sido enviada
        if (
          !mediosdepago ||
          !fecha ||
          !total ||
          !detalles ||
          !Array.isArray(detalles) ||
          detalles.length == 0
        ) {
          res.status(400).json({
            error:
              "Faltan campos requeridos o los detalles de la venta están vacíos.",
          });
        }

        //^ Verificamos que todos los productos recibidos
        for (const detalle of detalles) {
          if (
            !detalle.productocodigo ||
            !detalle.cantidad ||
            !detalle.preciounitario
          ) {
            return res.status(400).json({
              error:
                "Cada detalle de venta debe tener productocodigo, cantidad y preciounitario.",
            });
          }
          if (typeof detalle.cantidad !== "number" || detalle.cantidad <= 0) {
            return res.status(400).json({
              error: `Cantidad inválida para el producto ${detalle.productocodigo}.`,
            });
          }
          if (
            typeof detalle.preciounitario !== "number" ||
            detalle.preciounitario < 0
          ) {
            return res.status(400).json({
              error: `Precio unitario inválido para el producto ${detalle.productocodigo}.`,
            });
          }
        }

        //^ Verificamos que el total sea el correcto
        const calculatedTotal = detalles.reduce(
          (sum, item) => sum + item.preciounitario * item.cantidad,
          0
        );
        if (total !== calculatedTotal) {
          return res.status(400).json({
            error: `El total calculado ${calculatedTotal} no es igual al total enviado ${total}`,
          });
        }

        //^ Manejamos el guardado de la venta en las diferentes tablas de la DB
        //^ prisma.$transaction funciona como un Promise.all
        const createdSale = await prisma.$transaction(async (tx) => {
          //* Creamos la venta
          const sale = await tx.ventas.create({
            data: {
              fecha: fecha,
              total: total,
              mediosdepago: Number(mediosdepago),
            },
          });
          //^ Por cada producto dentro de la venta
          const saleDetailsPromises = detalles.map(async (detail) => {
            //* 1. Creamos los detalles de la venta
            await tx.detalledeventas.create({
              data: {
                cantidad: detail.cantidad,
                preciounitario: detail.preciounitario,
                productocodigo: detail.productocodigo,
                ventacodigo: sale.id,
              },
            });
            //* 2. Actualizamos el stock del producto
            const currentProduct = await tx.productos.findUnique({
              where: { id: detail.productocodigo },
              select: { stock: true },
            });
            if (!currentProduct)
              throw new Error(
                `Producto con código ${detail.productocodigo} no encontrado`
              );

            const newStock = currentProduct.stock - detail.cantidad;
            if (newStock < 0)
              throw new Error(
                `Stock insuficiente para el producto ${detail.productocodigo}`
              );

            await tx.productos.update({
              where: { id: detail.productocodigo },
              data: {
                stock: newStock,
                fechamodificacion: new Date(),
              },
            });
          });
          await Promise.all(saleDetailsPromises);

          return tx.ventas.findUnique({
            where: { id: sale.id },
            include: {
              detalles: {
                include: {
                  producto: true,
                },
              },
              mediodepago: true,
            },
          });
        });

        res.status(201).json(createdSale);
        break;
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Hubo un problema en la llamada", data: error });
  }
}
