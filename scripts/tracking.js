import { getOrders } from './orders.js';
import { getProduct } from '../data/products.js';
import { cart } from '../data/cart.js';
import { updateCartQuantity } from './utils/money.js';

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const productId = urlParams.get('productId');

const orders = getOrders();
const order = orders.find(o => o.id === orderId);
const productItem = order?.products.find(p => p.productId === productId);

if (order && productItem) {
    const product = getProduct(productItem.productId);
    const deliveryDate = new Date(productItem.estimatedDeliveryTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const trackingHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>
        <div class="delivery-date">Arriving on ${deliveryDate}</div>
        <div class="product-info">${product.name}</div>
        <div class="product-info">Quantity: ${productItem.quantity}</div>
        <img class="product-image" src="${product.image}">
        <div class="progress-labels-container">
            <div class="progress-label ${order.status === 'Processing' ? 'current-status' : ''}">Preparing</div>
            <div class="progress-label ${order.status === 'Shipped' ? 'current-status' : ''}">Shipped</div>
            <div class="progress-label ${order.status === 'Delivered' ? 'current-status' : ''}">Delivered</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${order.status === 'Processing' ? '33%' : order.status === 'Shipped' ? '66%' : '100%'}"></div>
        </div>
    `;
    document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
} else {
    document.querySelector('.js-order-tracking').innerHTML = '<p>Order or product not found.</p>';
}

updateCartQuantity(cart);