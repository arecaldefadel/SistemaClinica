import { useState } from "react";

function useCart() {
  const [cartState, setCartState] = useState([]);

  const setCartValue = (value) => {
    if (!cartState.includes(value)) {
      setCartState([...cartState, value]);
    } else {
      setCartState(cartState.filter((a) => a !== value));
    }
  };

  return { cartState, setCartValue };
}

export default useCart;
