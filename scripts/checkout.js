import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { updateCartQuantity } from './utils/money.js'; 
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions } from '../data/deliveryOption.js';

hello();

const today = dayjs(); 
const deliveryDate = today.add(7, 'days'); 
console.log(deliveryDate.format('dddd, MMMM D'))


function renderCartSummary() {
let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId
  
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.
  deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  
  const today =dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );
 
 

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-  grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
         ${matchingProduct.name}
        </div> 
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}" disabled>
            Update
          </span>
          <!-- New input for entering a new quantity -->
          <input class="quantity-input js-quantity-input" type="number" placeholder="New Quantity">

          <!-- New span for saving the quantity -->
          <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
            Save
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
  `;
});


function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';


  deliveryOptions.forEach((deliveryOption) => {
    const today =dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    const priceString = deliveryOption.priceCents 
    === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.
         priceCents)}`; 

    const isChecked = deliveryOption.id ===
    cartItem.deliveryOptionId;

          
    html +=
      `<div class="delivery-option ">
      <input type="radio"
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} shipping 
        </div>
      </div>
    </div>`
  });

  return html;
};

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// Call the function to update the cart quantity when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity(cart);




});
}


renderCartSummary();

document.querySelectorAll('.js-delete-link')
 .forEach((link) => {
   link.addEventListener('click', () => {
     const productId = link.dataset.productId
     removeFromCart(productId);
     
     const container = document.querySelector(
      `.js-cart-item-container-${productId}`
     );
     container.remove();

     updateCartQuantity(cart);
   });
 }); 

// ...

document.querySelectorAll('.update-quantity-link').forEach((updateLink) => {
  updateLink.addEventListener('click', (event) => {
    const productId = event.target.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    if (container) {
      // Toggle "is-editing" class on the container
      container.classList.toggle('is-editing');

      // Toggle the visibility of elements
      const quantityInput = container.querySelector('.quantity-input');
      quantityInput.style.display = 'initial';
      updateLink.style.display = 'none';
      const saveLink = container.querySelector('.save-quantity-link');
      saveLink.style.display = 'initial';

      // Focus the quantity input for better user experience
      quantityInput.focus();

      // Add validation for the quantity input
      quantityInput.addEventListener('input', () => {
        const newQuantity = parseInt(quantityInput.value, 10);

        // Validate the new quantity
        if (newQuantity >= 0 && newQuantity < 1000) {
          // Enable the save link when the input is valid
          saveLink.disabled = false;
        } else {
          // Disable the save link when the input is invalid
          saveLink.disabled = true;
        }
      });

      // Add keyboard support (press 'Enter' to save)
      quantityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          saveLink.click(); // Trigger the click event on the save link
        }
      });
    }
  });
});

// ...


 document.querySelectorAll('.save-quantity-link')
  .forEach((saveLink) => {
    saveLink.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      // Check if the container exists before manipulating it
      if (container) {
        // Toggle "is-editing" class on the container
        container.classList.remove('is-editing');

        // Toggle the visibility of elements
        const quantityInput = container.querySelector('.js-quantity-input');
        const updateLink = container.querySelector('.update-quantity-link');

        if (quantityInput && updateLink) {
          quantityInput.style.display = 'none';
          saveLink.style.display = 'none';
          updateLink.style.display = 'initial';

          // Get the updated quantity from the input
          const newQuantity = parseInt(quantityInput.value, 10);

          // Update the cart with the new quantity
          updateCartQuantity(productId, newQuantity);
        } else {
          console.error('Quantity input or update link not found.');
        }
      } else {
        console.error(`Container not found for productId: ${productId}`);
      }
    });
  });



