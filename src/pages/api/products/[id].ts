import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { ProductTypes } from "@/types/CommonTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: ProductTypes = req.body;
  const id = req.query.id;
  if (!id) res.status(401).json("No se envio un id");
  try {
    switch (req.method) {
      case "DELETE":
        const deletedProduct = await prisma.productos.delete({ where: { id } });
        res
          .status(200)
          .json({ message: "Producto eliminado con exito", deletedProduct });
        break;
      case "PUT":
        const expireTime = data.fechavencimiento
          ? new Date(data.fechavencimiento).getTime()
          : null;
        const updatedData = {
          nombre: data.nombre,
          fechamodificacion: String(Date.now()),
          fechavencimiento: String(expireTime),
          preciocompra: Number(data.preciocompra),
          precioventa: Number(data.precioventa),
          stock: Number(data.stock),
          stockminimo: Number(data.stockminimo),
          tiendaonline: String(data.tiendaonline) == "true",
          categoria: Number(data.categoria),
          observaciones: data.observaciones ?? "",
          proveedor: Number(data.proveedor),
        };
        const updatedProduct = await prisma.productos.update({
          where: { id: data.id },
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
