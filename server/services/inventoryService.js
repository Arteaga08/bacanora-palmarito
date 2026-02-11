import Product from "../models/Product.js"; // 👈 ESTO ES LO QUE TE FALTABA

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
        countInStock: { $gte: item.quantity }, // Seguridad: no restar si no hay suficiente
      },
      {
        $inc: { countInStock: -item.quantity },
      },
      {
        session, // 👈 Muy importante para que el pago y el stock se guarden juntos
        new: true,
      },
    );

    if (!updatedProduct) {
      console.error(`❌ ERROR: Stock insuficiente para ${productBefore.name}`);
      throw new Error(`Stock insuficiente para ${productBefore.name}`);
    }

    console.log(
      `📉 ÉXITO: Nuevo stock de ${updatedProduct.name}: ${updatedProduct.countInStock}`,
    );
  }
};
