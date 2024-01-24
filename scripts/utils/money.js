export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}


// Initialize cart as an array, using the stored data or an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart quantity
function updateCartQuantity(cart) {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Update the cart quantity in the header
  const cartQuantityElement = document.querySelector('.js-cart-quantity');

  if (cartQuantityElement) {
    if (cartQuantity === 0) {
      cartQuantityElement.style.display = 'none';
    } else {
      cartQuantityElement.style.display = 'block';
      cartQuantityElement.innerHTML = `${cartQuantity} items`;
    }
  }
}

// Export necessary functions or variables
export { cart, updateCartQuantity };
