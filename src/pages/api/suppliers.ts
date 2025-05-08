import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { SupplierTypes } from "@/types/CommonTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: SupplierTypes = req.body;
  try {
    switch (req.method) {
      case "GET":
        const suppliers = await prisma.proveedor.findMany();
        res.status(200).json(suppliers);
        break;
      case "POST":
        const supplier = await prisma.proveedor.create({
          data: {
            direccion: data.direccion,
            nombre: data.nombre,
            pagina: data.pagina,
            telefono: data.telefono,
          },
        });
        res.status(201).json(supplier);
        break;
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
