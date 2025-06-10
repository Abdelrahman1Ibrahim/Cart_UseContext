import { createContext } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";
import { useState } from "react";
import { useReducer } from "react";

const CartContext = createContext({
  items: [],
  onUpdateCartItemQuantity: () => {},
  onAddItemToCart: () => {},
});

function reducerFunction(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.id
        );
        updatedItems.push({
          id: action.id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    }
    case "UPDATE_ITEM": {
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    }
  }
}

function CartContextProvider({ children }) {
  const [ShoppingCartReducer, ShoppingCartDispatch] = useReducer(
    reducerFunction,
    {
      items: [],
    }
  );

  function handleAddItemToCart(id) {
    ShoppingCartDispatch({
      type: "ADD_ITEM",
      id: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    ShoppingCartDispatch({
      type: "UPDATE_ITEM",
      productId: productId,
      amount: amount,
    });
  }

  const ctxValue = {
    items: ShoppingCartReducer.items,
    onUpdateCartItemQuantity: handleUpdateCartItemQuantity,
    onAddItemToCart: handleAddItemToCart,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}

export { CartContextProvider, CartContext };
