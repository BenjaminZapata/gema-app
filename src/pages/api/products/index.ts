import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { ProductTypes } from "@/types/CommonTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: ProductTypes = req.body;
  try {
    switch (req.method) {
      case "GET":
        const products = await prisma.productos.findMany();
        const productsMapped = products.map((p) => ({
          ...p,
          fechamodificacion: Number(p.fechamodificacion),
          fechavencimiento:
            p.fechavencimiento == null ? null : Number(p.fechavencimiento),
        }));
        res.status(200).json(productsMapped);
        break;
      case "POST":
        const expireTime = data.fechavencimiento
          ? new Date(data.fechavencimiento).getTime()
          : null;
        const product = await prisma.productos.create({
          data: {
            nombre: data.nombre,
            fechamodificacion: String(Date.now()),
            fechavencimiento: String(expireTime),
            preciocompra: Number(data.preciocompra),
            precioventa: Number(data.precioventa),
            stock: Number(data.stock),
            stockminimo: Number(data.stockminimo),
            tiendaonline: data.tiendaonline ? data.tiendaonline : 0,
            categoria: Number(data.categoria),
            id: Number(data.id),
            observaciones: data.observaciones ?? "",
            proveedor: Number(data.proveedor),
          },
        });
        res.status(201).json(product);
        break;
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
