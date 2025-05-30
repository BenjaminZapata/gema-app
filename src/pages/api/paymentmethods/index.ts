import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface PaymentMethodRequestBody {
  nombre: string;
  observaciones?: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: PaymentMethodRequestBody = req.body;

  try {
    switch (req.method) {
      case "GET":
        const paymentMethods = await prisma.mediosdepago.findMany();
        res.status(200).json(paymentMethods);
        break;
      case "POST":
        if (
          !data.nombre ||
          typeof data.nombre !== "string" ||
          data.nombre.trim() === ""
        ) {
          return res.status(400).json({
            error:
              "El campo 'nombre' es requerido y debe ser un string no vacío.",
          });
        }
        if (data.observaciones && typeof data.observaciones !== "string") {
          return res
            .status(400)
            .json({ error: "El campo 'observaciones' debe ser un string." });
        }

        const newPaymentMethod = await prisma.mediosdepago.create({
          data: {
            nombre: data.nombre,
            observaciones: data.observaciones ?? null,
          },
        });
        res.status(201).json(newPaymentMethod);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error en /api/paymentmethods:", error);
    res.status(500).json({
      error:
        "Hubo un problema en el servidor al procesar la solicitud de métodos de pago.",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
