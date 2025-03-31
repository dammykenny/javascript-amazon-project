import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOption.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../orders.js';

// Use your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R8f3rPd48Oa0vggiTjqlom0w6k1BmCO9vUg85OCCZjFLMq0hdZjQ0CReHaZmSbhwbmipamoeN0GLGocRZPwsAog00GGgGHlhs';
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
        totalQuantity += cartItem.quantity;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">Order Simulation</div>
        <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>
        <div class="payment-summary-row">
            <div>Shipping & handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>
        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>
        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>
        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <!-- Stripe Credit Card Option -->
        <form id="payment-form">
            <div id="card-element" class="stripe-element"></div>
            <div id="card-errors" role="alert"></div>
            <button type="submit" class="place-order-button button-primary">Pay with Credit/Debit Card</button>
        </form>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    // Stripe Elements
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    const cardErrors = document.getElementById('card-errors');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            cardErrors.textContent = error.message;
        } else {
            // Simulate payment success for testing (no backend)
            // console.log('Payment Method Created:', paymentMethod);
            alert('Payment successful in test mode! No real transaction occurred.');
            placeOrder(totalCents);
        }
    });
}

function placeOrder(totalCents) {
    const order = {
        id: 'order-' + Math.random().toString(36).substr(2, 9),
        orderTime: new Date().toISOString(),
        totalCostCents: totalCents,
        products: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            estimatedDeliveryTime: calculateDeliveryDate(item.deliveryOptionId),
            deliveryOptionId: item.deliveryOptionId
        })),
        status: 'Processing'
    };
    addOrder(order);
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'orders.html';
}

function calculateDeliveryDate(deliveryOptionId) {
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    return deliveryDate.toISOString();
}