import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "../types/product.types";

// Tipos para o carrinho
interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  state: CartState;
  addItemToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number, action: number) => void;
  clearCart: () => void;
}

function discountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

// Ações do reducer
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; quantity: number };
    }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [], // Array vazio inicial
  total: 0,
};

// Criação do contexto
const CartContext = createContext<CartContextType>({
  state: initialState,
  addItemToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});
const CART_STORAGE_KEY = "cart";

function cartReducer(
  state: CartState = initialState,
  action: CartAction
): CartState {
  const safeState: CartState = {
    items: state?.items || [],
    total: state?.total || 0,
  };

  if (!state) {
    return safeState;
  }

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = safeState.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = safeState.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const newItems = [...safeState.items, { ...action.payload, quantity: 1 }];
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = safeState.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = safeState.items.map((item) =>
        item.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return safeState;
  }
}

// Função auxiliar para calcular o total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const itemPrice = discountedPrice(item.price, item.discountPercentage || 0);
    return total + itemPrice * item.quantity;
  }, 0);
}

// Provider do carrinho
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addItemToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number, action: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItemToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // Garanta que o estado tem a estrutura correta
  const safeState: CartState = {
    items: context.state?.items || [],
    total: context.state?.total || 0,
  };

  return {
    ...context,
    state: safeState,
  };
};
