import { z } from "zod";

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(3, "El nombre es muy corto"),
    email: z.string().email("Email inválido").toLowerCase(),
    phone: z
      .string()
      .trim()
      .min(10, "El teléfono debe tener al menos 10 dígitos"),
  }),

  items: z
    .array(
      z.object({
        productId: z.string().length(24, "ID de producto inválido"),
        quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
        // No es estrictamente necesario que el front mande el resto,
        // pero lo dejamos opcional por si acaso
        name: z.string().trim().optional(),
        slug: z.string().trim().optional(),
      }),
    )
    .min(1, "El carrito no puede estar vacío"),

  shipping: z.object({
    address: z.string().trim().min(5, "Dirección inválida"),
    city: z.string().min(2, "Ciudad muy corta").max(50),
    state: z.string().min(2, "El estado es obligatorio"),
    zip: z.string().trim().min(4, "Código postal inválido"),
    country: z.string().default("México").optional(),
    references: z.string().optional(),
  }),

  customerNote: z.string().max(500).optional(),
  totalPrice: z.number().positive().optional(),

  legalAgeConfirmed: z.boolean({
    required_error: "Debes confirmar que eres mayor de edad.",
    invalid_type_error: "El formato de confirmación de edad es inválido.",
  }),
});
