import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);
  try {
    switch (req.method) {
      case "DELETE":
        const deletedSupplier = await prisma.proveedor.delete({
          where: { id },
        });
        res.status(201).json(deletedSupplier);
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error al eliminar el proveedor",
      data: error instanceof Error ? error.message : error,
    });
  }
}
