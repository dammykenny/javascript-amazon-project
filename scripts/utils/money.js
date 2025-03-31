export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function updateCartQuantity(cart) {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
      cartQuantityElement.textContent = totalQuantity;
  } else {
      console.warn('Cart quantity element (.js-cart-quantity) not found in the DOM');
  }
}