// cart.js
export let cart = JSON.parse(localStorage.getItem('cart')) || [
  { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryOptionId: '1' },
  { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryOptionId: '2' }
];

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
      existingItem.quantity += quantity;
  } else {
      cart.push({ productId, quantity, deliveryOptionId: '1' }); // Default delivery option
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(item => item.productId === productId);
  if (item) item.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

// New loadCart function
export function loadCart(callback) {
  // Since the cart is already loaded from localStorage when the module is imported,
  // we can just call the callback immediately.
  if (callback) callback();
}