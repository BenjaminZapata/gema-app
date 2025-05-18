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
        res.status(200).json(products);
        break;
      case "POST":
        let fechaVencimientoParaPrisma: Date | null = null;
        if (data.fechavencimiento) {
          // requestBody.fechavencimiento puede ser un string ISO, epoch ms, o un string de fecha
          const parsedDate = new Date(data.fechavencimiento);
          if (!isNaN(parsedDate.getTime())) {
            fechaVencimientoParaPrisma = parsedDate;
          }
        }
        console.log(data);

        const product = await prisma.productos.create({
          data: {
            nombre: data.nombre,
            fechamodificacion: new Date(),
            fechavencimiento: fechaVencimientoParaPrisma,
            preciocompra: Number(data.preciocompra),
            precioventa: Number(data.precioventa),
            stock: Number(data.stock),
            stockminimo: Number(data.stockminimo),
            tiendaonline: data.tiendaonline ? 1 : 0,
            categoria: Number(data.categoria),
            id: String(data.id),
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
