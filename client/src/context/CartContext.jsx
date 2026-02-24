import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito fácilmente en cualquier componente
export const useCart = () => {
  return useContext(CartContext);
};

// 3. El Proveedor del Contexto
export const CartProvider = ({ children }) => {
  // Inicializamos el estado leyendo el localStorage (por si el usuario regresa después)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("palmarito_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error leyendo el carrito:", error);
      return [];
    }
  });

  // Cada vez que cartItems cambia, actualizamos el localStorage automáticamente
  useEffect(() => {
    localStorage.setItem("palmarito_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =========================================
  // 🛒 ACCIONES DEL CARRITO
  // =========================================

  // AGREGAR AL CARRITO
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Verificamos si el producto ya está en el carrito
      const itemExists = prevItems.find((item) => item.productId === product._id);

      if (itemExists) {
        // Si existe, solo sumamos la cantidad
        return prevItems.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Si no existe, lo agregamos como un objeto nuevo, mapeando exactamente
      // los campos que tu backend (OrderSchema) exige recibir.
      return [
        ...prevItems,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.cardPrimary || product.image || "", // Para mostrar en el UI
          countInStock: product.countInStock // Para validar en el UI que no pida de más
        },
      ];
    });
  };

  // REMOVER DEL CARRITO
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  // ACTUALIZAR CANTIDAD (Botones + / -)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Evitamos cantidades negativas o cero

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          // Validamos contra el stock disponible
          const safeQuantity = newQuantity > item.countInStock ? item.countInStock : newQuantity;
          return { ...item, quantity: safeQuantity };
        }
        return item;
      })
    );
  };

  // VACIAR CARRITO (Para después de pagar exitosamente)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("palmarito_cart");
  };

  // =========================================
  // 📊 CÁLCULOS DERIVADOS (Para mostrar en UI)
  // =========================================
  
  // Total de artículos (ej. para la burbuja roja en el ícono del carrito)
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal en dinero
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};