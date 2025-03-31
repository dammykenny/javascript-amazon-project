// console.log('checkout.js loaded');

import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
import { loadCart, cart } from '../data/cart.js';

// console.log('Imports completed, initial cart:', cart);

async function loadPage() {
    try {
        // console.log('Loading products...');
        await loadProductsFetch();
        // console.log('Products loaded');
        // console.log('Loading cart...');
        await new Promise((resolve) => {
            loadCart(() => {
                // console.log('Cart after loadCart:', cart);
                resolve();
            });
        });
        // console.log('Rendering order summary...');
        renderOrderSummary();
        // console.log('Order summary rendered');
        // console.log('Rendering payment summary...');
        renderPaymentSummary();
        // console.log('Payment summary rendered');
    } catch (error) {
        console.error('Error in loadPage:', error);
        document.querySelector('.js-order-summary').innerHTML = '<p>Error loading cart. Please try again.</p>';
    }
}

loadPage();