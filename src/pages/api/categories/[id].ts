import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  try {
    switch (req.method) {
      case "DELETE":
        const deletedProduct = await prisma.categorias.delete({
          where: { id },
        });
        res
          .status(200)
          .json({ message: "Categoría eliminada con exito", deletedProduct });
        break;
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
