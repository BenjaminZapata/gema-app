import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { gastoSchema } from "../../../../src/types/gastosSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const gastos = await prisma.gastos.findMany({ orderBy: { fecha: "desc" } });
        return res.status(200).json(gastos);
      }
      case "POST": {
        const parsed = gastoSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: "Datos inválidos", details: parsed.error.format() });
        }

        const created = await prisma.gastos.create({
          data: {
            nombre: parsed.data.nombre,
            tipo: parsed.data.tipo as any,
            fecha: parsed.data.fecha,
            observaciones: parsed.data.observaciones ?? "",
            total: parsed.data.total,
          },
        });

        return res.status(201).json(created);
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Hubo un problema en la llamada", data: error instanceof Error ? error.message : error });
  }
}
