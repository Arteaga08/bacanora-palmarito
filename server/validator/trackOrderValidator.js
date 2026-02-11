import { z } from "zod";

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^PAL-\d{6}-[A-Z0-9]{4}$/,
      "El formato del número de orden es PAL-AÑO-MES-DIA-XXXX",
    ),

  email: z.string().trim().email("Email inválido").toLowerCase(),
});
