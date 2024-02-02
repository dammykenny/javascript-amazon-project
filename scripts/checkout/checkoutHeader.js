// checkout/checkoutHeader.js

// Import the necessary functions and variables from other files if needed

export function renderCheckoutHeader(cartQuantity) {
  const checkoutHeaderHTML = `
    <div class="checkout-header">
      <div class="header-content">
        <div class="checkout-header-left-section">
          <a href="amazon.html">
            <img class="amazon-logo" src="images/amazon-logo.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
          </a>
        </div>

        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link" href="amazon.html"><span class="js-cart-quantity">${cartQuantity} items</span></a>)
        </div>

        <div class="checkout-header-right-section">
          <img src="images/icons/checkout-lock-icon.png">
        </div>
      </div>
    </div>
  `;

  // Display the generated HTML on the page
  const checkoutHeaderContainer = document.querySelector('.checkout-header');
  checkoutHeaderContainer.innerHTML = checkoutHeaderHTML;
}
