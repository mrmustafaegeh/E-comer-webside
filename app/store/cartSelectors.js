export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
};

export const selectCartItemsCount = (state) => {
  return state.cart.items.reduce((total, item) => total + item.qty, 0);
};

export const selectCartItemById = (id) => (state) => {
  return state.cart.items.find((item) => item.id === id);
};
