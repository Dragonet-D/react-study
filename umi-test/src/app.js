export const dva = {
  config: {
    onStateChange(state) {
      if (localStorage) {
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    }
  }
};
