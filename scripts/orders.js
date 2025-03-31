import { getProduct } from '../data/products.js';
import { formatCurrency, updateCartQuantity } from './utils/money.js';
import { cart, addToCart } from '../data/cart.js';

function loadOrders() {
    const storedOrders = localStorage.getItem('orders');
    try {
        if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders);
            return Array.isArray(parsedOrders) ? parsedOrders : [];
        }
        return [];
    } catch (e) {
        console.error('Failed to parse orders from localStorage:', e);
        return [];
    }
}

export function getOrders() {
    return loadOrders();
}

export function addOrder(order) {
    const orders = loadOrders();
    order.status = 'Processing';
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function deleteOrder(orderId) {
    const orders = loadOrders();
    const updatedOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    renderOrders();
}

export function renderOrders() {
    let ordersHTML = '';
    const orders = getOrders();

    orders.forEach((order) => {
        let orderItemsHTML = '';
        if (order.products && Array.isArray(order.products)) {
            orderItemsHTML = order.products.map((item) => {
                const product = getProduct(item.productId);
                const deliveryDate = new Date(item.estimatedDeliveryTime);
                const dateString = deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                return `
                    <div class="product-image-container">
                        <img src="${product.image}">
                    </div>
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="product-delivery-date">Arriving on: ${dateString}</div>
                        <div class="product-quantity">Quantity: ${item.quantity}</div>
                        <button class="buy-again-button button-primary js-buy-again" data-product-id="${item.productId}" data-quantity="${item.quantity}">
                            <img class="buy-again-icon" src="images/icons/buy-again.png">
                            <span class="buy-again-message">Buy it again</span>
                        </button>
                    </div>
                    <div class="product-actions">
                        <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
                            <button class="track-package-button button-secondary">Track package</button>
                        </a>
                    </div>`;
            }).join('');
        } else {
            orderItemsHTML = '<p>No items in this order.</p>';
        }
        ordersHTML += `
            <div class="order-container" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${new Date(order.orderTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${formatCurrency(order.totalCostCents)}</div>
                        </div>
                        <div class="order-status">
                            <div class="order-header-label">Status:</div>
                            <div>${order.status}</div>
                        </div>
                    </div>
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                        <button class="delete-order-button button-secondary js-delete-order" data-order-id="${order.id}">Delete</button>
                        <button class="buy-all-again-button button-primary js-buy-all-again" data-order-id="${order.id}">Buy All Again</button>
                    </div>
                </div>
                <div class="order-details-grid">${orderItemsHTML}</div>
            </div>`;
    });

    const gridElement = document.querySelector('.js-orders-grid');
    if (gridElement) {
        gridElement.innerHTML = ordersHTML || '<p>No orders yet.</p>';
    } else {
        console.warn('No .js-orders-grid element found in the DOM');
    }

    document.querySelectorAll('.js-delete-order').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.dataset.orderId;
            deleteOrder(orderId);
        });
    });

    document.querySelectorAll('.js-buy-again').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const quantity = parseInt(button.dataset.quantity, 10);
            addToCart(productId, quantity);
            updateCartQuantity(cart);
        });
    });

    document.querySelectorAll('.js-buy-all-again').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.dataset.orderId;
            const order = getOrders().find(o => o.id === orderId);
            if (order && order.products) {
                order.products.forEach(item => {
                    addToCart(item.productId, item.quantity);
                });
                updateCartQuantity(cart);
            }
        });
    });

    updateCartQuantity(cart);
}