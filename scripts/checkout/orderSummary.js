import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { updateCartQuantity } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';

function renderCheckoutHeader() {
    let checkoutHeaderHTML = `
        <div class="checkout-header">
            <div class="header-content">
                <div class="checkout-header-left-section">
                    <a href="amazon.html">
                        <img class="amazon-logo" src="images/amazon-logo.png">
                        <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
                    </a>
                </div>
                <div class="checkout-header-middle-section">
                    Checkout (<a class="return-to-home-link" href="amazon.html"><span class="js-cart-quantity">${cart.length} Products</span></a>)
                </div>
                <div class="checkout-header-right-section">
                    <img src="images/icons/checkout-lock-icon.png">
                </div>
            </div>
        </div>`;
    const headerElement = document.querySelector('.checkout-header');
    if (headerElement) {
        headerElement.innerHTML = checkoutHeaderHTML;
    } else {
        console.error('Checkout header element not found in DOM');
    }
}

export function renderOrderSummary() {
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const today = dayjs(); // Now this should work with CDN
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">Delivery date: ${dateString}</div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">
                    <div class="cart-item-details">
                        <div class="product-name">${matchingProduct.name}</div>
                        <div class="product-price">${matchingProduct.getPrice()}</div>
                        <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                            <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
                            <input class="quantity-input js-quantity-input" type="number" placeholder="New Quantity">
                            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
                            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Delete</span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>`;
    });

    const orderSummaryElement = document.querySelector('.js-order-summary');
    if (orderSummaryElement) {
        orderSummaryElement.innerHTML = cartSummaryHTML;
    } else {
        console.error('Order summary element not found in DOM');
    }

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            document.querySelector(`.js-cart-item-container-${productId}`).remove();
            renderPaymentSummary();
            updateCartQuantity(cart);
            renderCheckoutHeader();
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.update-quantity-link').forEach((updateLink) => {
        updateLink.addEventListener('click', () => {
            const productId = updateLink.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing');
            const quantityInput = container.querySelector('.js-quantity-input');
            quantityInput.style.display = 'inline';
            updateLink.style.display = 'none';
            container.querySelector('.save-quantity-link').style.display = 'inline';
        });
    });

    document.querySelectorAll('.save-quantity-link').forEach((saveLink) => {
        saveLink.addEventListener('click', () => {
            const productId = saveLink.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            const quantityInput = container.querySelector('.js-quantity-input');
            const newQuantity = parseInt(quantityInput.value, 10);
            if (newQuantity >= 0 && newQuantity < 1000) {
                cart.find(item => item.productId === productId).quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                container.classList.remove('is-editing');
                quantityInput.style.display = 'none';
                saveLink.style.display = 'none';
                container.querySelector('.update-quantity-link').style.display = 'inline';
                renderOrderSummary();
                renderPaymentSummary();
                updateCartQuantity(cart);
                renderCheckoutHeader();
            }
        });
    });
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} shipping</div>
                </div>
            </div>`;
    });
    return html;
}

renderCheckoutHeader();