import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // fetch Cart 
  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get('/cart/');
      const data = res.data;
      const formattedCart = data.map(item => ({
          ...item.product,
          cartItemId: item.id,
          quantity: item.quantity
      }));
      setCart(formattedCart);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // add product
  const addProduct = async (product) => {
    try {
      await axiosInstance.post(`/cart/add/${product.id}/`, product);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // remove product
  const removeProduct = async (product) => {
    try {
      await axiosInstance.post(`/cart/remove/${product.id}/`);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // clear cart
  const clearCart = () => {
    setCart([]);
  };

  // update quantity
  const updateQuantity = async (product, quantity) => {
    try {
      await axiosInstance.post(`/cart/update/${product.id}/`, { quantity });
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
