import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  try {
    switch (req.method) {
      case "GET":
        const categories = await prisma.categorias.findMany();
        res.status(200).json(categories);
        break;
      case "POST":
        const category = await prisma.categorias.create({
          data: {
            nombre: data.nombre,
          },
        });
        res.status(201).json(category);
        break;
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Hubo un problema en la llamada", data: error });
  }
}
