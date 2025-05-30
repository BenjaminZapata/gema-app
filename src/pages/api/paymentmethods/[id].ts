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
        const deletedPaymentMethod = await prisma.mediosdepago.delete({
          where: { id },
        });
        res
          .status(200)
          .json({ message: "Metodo de pago eliminada con exito", deletedPaymentMethod });
        break;
    }
  } catch (error) {
    res.status(500).json({
      error: "Hubo un problema en la llamada",
      data: error instanceof Error ? error.message : error,
    });
  }
}
