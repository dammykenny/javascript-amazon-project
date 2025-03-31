export let cart = loadCart();

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    try {
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
        return [];
    }
}

export function addToCart(productId, quantity) {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity, deliveryOptionId: '1' }); // Default delivery option
    }
    saveCart();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}