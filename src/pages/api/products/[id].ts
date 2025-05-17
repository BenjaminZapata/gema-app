import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { ProductTypes } from "@/types/CommonTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: ProductTypes = req.body;
  const id = req.query.id;
  if (typeof id === "undefined") {
    return res.status(400).json({ error: "No se envió un ID de producto" });
  }
  if (Array.isArray(id)) {
    return res
      .status(400)
      .json({ error: "Se recibió más de un ID de producto" });
  }
  try {
    switch (req.method) {
      case "DELETE":
        const deletedProduct = await prisma.productos.delete({ where: { id } });
        res
          .status(200)
          .json({ message: "Producto eliminado con exito", deletedProduct });
        break;
      case "PUT":
        let fechaVencimientoParaPrisma: Date | null = null;
        if (data.fechavencimiento) {
          const parsedDate = new Date(data.fechavencimiento);
          if (!isNaN(parsedDate.getTime())) {
            fechaVencimientoParaPrisma = parsedDate;
          }
        }

        const updatedData = {
          nombre: data.nombre,
          fechamodificacion: new Date(),
          fechavencimiento: fechaVencimientoParaPrisma,
          preciocompra: Number(data.preciocompra),
          precioventa: Number(data.precioventa),
          stock: Number(data.stock),
          stockminimo: Number(data.stockminimo),
          tiendaonline: String(data.tiendaonline) == "true" ? 1 : 0,
          categoria: Number(data.categoria),
          observaciones: data.observaciones ?? "",
          proveedor: Number(data.proveedor),
        };

        const updatedProduct = await prisma.productos.update({
          where: { id: id },
          data: updatedData,
        });
        res.status(201).json(updatedProduct);
        break;
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
