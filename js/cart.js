// DOM Elements
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCartMessage = document.querySelector('.empty-cart-message');
const subtotalElement = document.querySelector('.subtotal');
const savingsElement = document.querySelector('.savings');
const totalElement = document.querySelector('.total-amount');
const checkoutButton = document.querySelector('.checkout-btn');
const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
const checkoutForm = document.getElementById('checkoutForm');

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
});

// Load cart items from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }

    displayCartItems(cart);
    updateCartSummary(cart);
}

// Show empty cart message
function showEmptyCart() {
    emptyCartMessage.classList.remove('d-none');
    document.querySelector('.cart-summary').classList.add('d-none');
}

// Display cart items
function displayCartItems(cart) {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });
}

// Create cart item element
function createCartItem(item) {
    const template = document.getElementById('cart-item-template');
    const cartItem = template.content.cloneNode(true);

    // Set item details
    cartItem.querySelector('.cart-item-image img').src = item.image;
    cartItem.querySelector('.cart-item-image img').alt = item.name;
    cartItem.querySelector('.item-name').textContent = item.name;
    cartItem.querySelector('.item-brand').textContent = `${item.brand} | Dupe for ${item.dupeFor}`;
    cartItem.querySelector('.current-price').textContent = `$${item.price.toFixed(2)}`;
    cartItem.querySelector('.original-price').textContent = `$${item.originalPrice.toFixed(2)}`;
    cartItem.querySelector('.quantity-input').value = item.quantity || 1;

    // Add event listeners
    const quantityInput = cartItem.querySelector('.quantity-input');
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    const removeBtn = cartItem.querySelector('.remove-item-btn');

    quantityInput.addEventListener('change', () => updateItemQuantity(item.id, parseInt(quantityInput.value)));
    minusBtn.addEventListener('click', () => decrementQuantity(item.id));
    plusBtn.addEventListener('click', () => incrementQuantity(item.id));
    removeBtn.addEventListener('click', () => removeItem(item.id));

    return cartItem;
}

// Update cart summary
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const originalTotal = cart.reduce((sum, item) => sum + (item.originalPrice * (item.quantity || 1)), 0);
    const savings = originalTotal - subtotal;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    savingsElement.textContent = `$${savings.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Update checkout button state
    checkoutButton.disabled = subtotal === 0;
}

// Setup event listeners
function setupEventListeners() {
    checkoutButton.addEventListener('click', () => {
        checkoutModal.show();
    });

    checkoutForm.addEventListener('submit', handleCheckout);
}

// Cart Item Quantity Management
function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function incrementQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        updateItemQuantity(itemId, (item.quantity || 1) + 1);
    }
}

function decrementQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === itemId);
    
    if (item && (item.quantity || 1) > 1) {
        updateItemQuantity(itemId, (item.quantity || 1) - 1);
    }
}

function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (cart.length === 0) {
        showEmptyCart();
    } else {
        loadCart();
    }
}

// Form Validation
function validateForm(formData) {
    const emailInput = document.querySelector('input[type="email"]');
    const cardNumberInput = document.querySelector('input[placeholder="Card Number"]');
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    const cvvInput = document.querySelector('input[placeholder="CVV"]');

    // Clear any existing error messages
    clearErrors();

    let isValid = true;

    // Email validation
    if (!emailInput.value.trim()) {
        showError('Email is required', emailInput);
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError('Please enter a valid email address', emailInput);
        isValid = false;
    }

    // Card validation
    if (!cardNumberInput.value.trim()) {
        showError('Card number is required', cardNumberInput);
        isValid = false;
    } else if (!cardNumberInput.value.replace(/\s/g, '').match(/^\d{16}$/)) {
        showError('Please enter a valid 16-digit card number', cardNumberInput);
        isValid = false;
    }

    // Expiry validation
    if (!expiryInput.value.trim()) {
        showError('Expiry date is required', expiryInput);
        isValid = false;
    } else if (!isValidExpiry(expiryInput.value)) {
        showError('Please enter a valid expiry date (MM/YY)', expiryInput);
        isValid = false;
    }

    // CVV validation
    if (!cvvInput.value.trim()) {
        showError('CVV is required', cvvInput);
        isValid = false;
    } else if (!cvvInput.value.match(/^\d{3,4}$/)) {
        showError('Please enter a valid CVV (3-4 digits)', cvvInput);
        isValid = false;
    }

    return isValid;
}

// Enhanced email validation
function isValidEmail(email) {
    // More comprehensive email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.toLowerCase());
}

// Expiry date validation
function isValidExpiry(expiry) {
    // Check format
    if (!expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        return false;
    }

    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Convert to numbers
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    // Check if date is in the past
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return false;
    }

    return true;
}

// Error handling
function showError(message, inputElement) {
    // Remove any existing error for this input
    clearError(inputElement);

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;

    // Add error styling
    inputElement.classList.add('is-invalid');

    // Insert error message after input
    inputElement.parentNode.appendChild(errorDiv);
}

function clearError(inputElement) {
    // Remove error styling
    inputElement.classList.remove('is-invalid');

    // Remove error message if exists
    const existingError = inputElement.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function clearErrors() {
    // Remove all error messages and styling
    document.querySelectorAll('.is-invalid').forEach(element => {
        element.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(element => {
        element.remove();
    });
}

// Handle Checkout
function handleCheckout(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Simulate order processing
    checkoutButton.disabled = true;
    checkoutButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';

    setTimeout(() => {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message and redirect
        checkoutModal.hide();
        showOrderConfirmation();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
}


// Order Confirmation
function showOrderConfirmation() {
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'order-confirmation';
    confirmationDiv.innerHTML = `
        <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
        <h3>Order Confirmed!</h3>
        <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
    `;

    document.body.appendChild(confirmationDiv);

    // Add success animation styles
    const style = document.createElement('style');
    style.textContent = `
        .order-confirmation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            text-align: center;
            z-index: 1000;
        }

        .success-animation {
            margin-bottom: 1rem;
        }

        .checkmark {
            width: 52px;
            height: 52px;
            margin: 0 auto;
        }

        .checkmark__circle {
            stroke: var(--primary-color);
            stroke-width: 2;
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark__check {
            stroke: var(--primary-color);
            stroke-width: 2;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
            100% { stroke-dashoffset: 0; }
        }
    `;
    document.head.appendChild(style);
}