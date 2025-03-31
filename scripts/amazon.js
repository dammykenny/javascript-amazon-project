import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { updateCartQuantity } from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
    // console.log("renderProductsGrid is running...");
    // console.log('Cart on load:', cart);

    let productsHTML = '';
    products.forEach((product) => {
        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>
                <div class="product-name limit-text-to-2-lines">${product.name}</div>
                <div class="product-rating-container">
                    <img class="product-rating-stars" src="${product.getStarsUrl()}">
                    <div class="product-rating-count link-primary">${product.rating.count}</div>
                </div>
                <div class="product-price">${product.getPrice()}</div>
                <div class="product-quantity-container">
                    <select class="js-quantity-selector-${product.id}">
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                ${product.extraInfoHTML()}
                <div class="product-spacer"></div>
                <div class="added-to-cart js-added-to-cart-${product.id}">
                    <img src="images/icons/checkmark.png"> Added
                </div>
                <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>`;
    });
    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
        const productId = button.dataset.productId;
        button.addEventListener('click', () => {
            const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
            const quantity = parseInt(quantitySelector.value);
            const existingItem = cart.find(item => item.productId === productId);
            if (existingItem) {
                // Update quantity if item already exists
                existingItem.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
            } else {
                // Add new item if it doesn’t exist
                addToCart(productId, quantity);
            }
            updateCartQuantity(cart);
            const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
            addedMessage.style.opacity = '1';
            setTimeout(() => { addedMessage.style.opacity = '0'; }, 2000);
            
            // Reset dropdown to 1
            quantitySelector.value = '1';
        });
    });

    updateCartQuantity(cart); // Initial cart quantity update

    // Add Clear Cart functionality
    document.querySelector('.js-clear-cart')?.addEventListener('click', () => {
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartQuantity(cart);
        // console.log('Cart cleared:', cart);
    });
}