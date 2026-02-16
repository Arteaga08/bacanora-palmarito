import Product from "../models/Product.js";
import { notifyLowStock } from "./notificationService.js";

export const deductStock = async (items, session) => {
  console.log("📦 Iniciando resta de stock para", items.length, "items");

  for (const item of items) {
    console.log(`🧪 Procesando item: ${item.name} (ID: ${item.productId})`);

    // 1. Verificar existencia (con la sesión de la transacción)
    const productBefore = await Product.findById(item.productId).session(
      session,
    );

    if (!productBefore) {
      console.error(`❌ ERROR: El producto ${item.productId} no existe.`);
      throw new Error(`Producto ${item.productId} no encontrado`);
    }

    console.log(
      `📊 Stock actual: ${productBefore.countInStock}, Solicitado: ${item.quantity}`,
    );

    // 2. Resta Atómica
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        countInStock: { $gte: item.quantity },
      },
      {
        $inc: { countInStock: -item.quantity },
      },
      {
        session,
        new: true,
      },
    );

    if (!updatedProduct) {
      throw new Error(`Stock insuficiente para ${productBefore.name}`);
    }

    // 🔔 NUEVA LÓGICA: Alerta de stock bajo
    // Si después de la resta quedan 5 o menos, avisamos.
    if (updatedProduct.countInStock <= 5) {
      console.log(`⚠️ ALERTA: ${updatedProduct.name} tiene poco stock.`);
      // No usamos await aquí para no retrasar la transacción de la DB
      notifyLowStock(updatedProduct);
    }

    console.log(
      `📉 ÉXITO: Nuevo stock de ${updatedProduct.name}: ${updatedProduct.countInStock}`,
    );
  }
};
