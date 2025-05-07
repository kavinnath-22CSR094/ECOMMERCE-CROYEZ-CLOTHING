import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./auth";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth] = useAuth();

  useEffect(() => {
    if (auth?.user) {
      getCart();
    }
  }, [auth?.user]);

  const getCart = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/cart", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      setCart(data?.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  return (
    <CartContext.Provider value={[cart, setCart, getCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };