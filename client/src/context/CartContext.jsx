import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Estado de los productos y visibilidad del modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("palmarito_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Persistencia en LocalStorage
  useEffect(() => {
    localStorage.setItem("palmarito_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(
        (item) => item.productId === product._id,
      );

      if (itemExists) {
        return prevItems.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.cardPrimary || product.image || "",
          countInStock: product.countInStock,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId),
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          const safeQuantity =
            newQuantity > item.countInStock ? item.countInStock : newQuantity;
          return { ...item, quantity: safeQuantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("palmarito_cart");
  };

  // Cálculos para la interfaz
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

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
        isCartOpen, 
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
