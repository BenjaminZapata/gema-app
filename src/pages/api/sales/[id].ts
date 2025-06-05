import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID de la venta no es valido" });
  }

  try {
    switch (req.method) {
      case "DELETE":
        const deletedSaleData = await prisma.$transaction(async (tx) => {
          //* 1. Obtenemos la data para restaurar el stock mas tarde
          const saleDetails = await tx.detalledeventas.findMany({
            where: { ventacodigo: id },
            select: {
              productocodigo: true,
              cantidad: true,
            },
          });

          if (!saleDetails || saleDetails.length == 0) {
            const saleExists = await tx.ventas.findUnique({
              where: { id: id },
              select: { id: true },
            });
            if (!saleExists) {
              throw new Error(
                `Venta con ID ${id} no encontrada para eliminar.`
              );
            }
          }

          for (const detail of saleDetails) {
            await tx.productos.update({
              where: {
                id: detail.productocodigo,
              },
              data: {
                stock: {
                  increment: Number(detail.cantidad),
                },
                fechamodificacion: new Date(),
              },
            });
          }

          await tx.detalledeventas.deleteMany({
            where: {
              ventacodigo: id,
            },
          });

          const deletedSale = await tx.ventas.delete({
            where: { id: id },
          });
          return deletedSale;
        });

        res.status(200).json(deletedSaleData);
        break;

      default:
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
