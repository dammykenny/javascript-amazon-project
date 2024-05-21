// Import statements
import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { updateCartQuantity } from '../utils/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';

// Function definition for rendering checkout header
function renderCheckoutHeader() {
  let checkoutHeaderHTML = ``
   checkoutHeaderHTML += `
    <div class="checkout-header">
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>
        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link" href="amazon.html"><span class="js-cart-quantity">${cart.length} items</span></a>)
        </div>
        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
    </div>
  `;
  document.querySelector('.checkout-header').innerHTML = checkoutHeaderHTML;
}

// Function definition for rendering order summary
export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container
       js-cart-item-container 
       js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">${matchingProduct.getPrice()}</div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}" disabled>Update</span>
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
      </div>
    `;
  });

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
        </div>
      `;
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Call the function to update the cart quantity when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    updateCartQuantity(cart);
  });

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
      updateCartQuantity(cart);
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
    updateLink.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      if (container) {
        container.classList.toggle('is-editing');
        const quantityInput = container.querySelector('.quantity-input');
        quantityInput.style.display = 'initial';
        updateLink.style.display = 'none';
        const saveLink = container.querySelector('.save-quantity-link');
        saveLink.style.display = 'initial';
        quantityInput.focus();

        quantityInput.addEventListener('input', () => {
          const newQuantity = parseInt(quantityInput.value, 10);
          if (newQuantity >= 0 && newQuantity < 1000) {
            saveLink.disabled = false;
          } else {
            saveLink.disabled = true;
          }
        });

        quantityInput.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            saveLink.click();
          }
        });
      }
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach((saveLink) => {
    saveLink.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) {
        container.classList.remove('is-editing');
        const quantityInput = container.querySelector('.js-quantity-input');
        const updateLink = container.querySelector('.update-quantity-link');
        if (quantityInput && updateLink) {
          quantityInput.style.display = 'none';
          saveLink.style.display = 'none';
          updateLink.style.display = 'initial';
          const newQuantity = parseInt(quantityInput.value, 10);
          updateCartQuantity(productId, newQuantity);
        } else {
          console.error('Quantity input or update link not found.');
        }
      } else {
        console.error(`Container not found for productId: ${productId}`);
      }
    });
  });
}
try{
  renderCheckoutHeader();
} catch{
  console.log('there is error somewhere in your code')
}

// Call to render the checkout header

