import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { gastoUpdateSchema } from "../../../../src/types/gastosSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const idParam = req.query.id;
  if (Array.isArray(idParam)) {
    return res.status(400).json({ error: "Se recibió más de un ID" });
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const gasto = await prisma.gastos.findUnique({ where: { id } });
        if (!gasto) return res.status(404).json({ error: "No encontrado" });
        return res.status(200).json(gasto);
      }
      case "PUT": {
        const parsed = gastoUpdateSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          return res.status(400).json({ error: "Datos inválidos", details: parsed.error.format() });
        }

        const updateData: any = {};
        if (typeof parsed.data.nombre !== "undefined") updateData.nombre = parsed.data.nombre;
        if (typeof parsed.data.tipo !== "undefined") updateData.tipo = parsed.data.tipo as any;
        if (typeof parsed.data.fecha !== "undefined") updateData.fecha = parsed.data.fecha;
        if (typeof parsed.data.observaciones !== "undefined") updateData.observaciones = parsed.data.observaciones;
        if (typeof parsed.data.total !== "undefined") updateData.total = parsed.data.total;

        const updated = await prisma.gastos.update({ where: { id }, data: updateData });
        return res.status(200).json(updated);
      }
      case "DELETE": {
        await prisma.gastos.delete({ where: { id } });
        return res.status(200).json({ message: "Gasto eliminado" });
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Hubo un problema en la llamada", data: error instanceof Error ? error.message : error });
  }
}
