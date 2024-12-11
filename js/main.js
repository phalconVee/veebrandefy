// DOM Elements
const startQuizBtn = document.getElementById('startQuizBtn');
const findMatchBtns = document.querySelectorAll('.find-match-btn');
const quizModal = new bootstrap.Modal(document.getElementById('quizModal'));

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
startQuizBtn.addEventListener('click', handleQuizStart);
findMatchBtns.forEach(btn => btn.addEventListener('click', handleFindMatch));

// Initialize Application
function initializeApp() {
    loadProductComparisons();
}

// Load Product Comparisons
function loadProductComparisons() {
    // This function would typically fetch product comparison data from an API
    // For now, we're using static content in the HTML
    console.log('Product comparisons loaded');
}

// Handle Quiz Start
function handleQuizStart(e) {
    e.preventDefault();
    quizModal.show();
}

// Handle Find Match Button Click
function handleFindMatch(e) {
    const productId = e.target.dataset.productId;
    // Store the product ID in sessionStorage for use after the quiz
    sessionStorage.setItem('selectedProduct', productId);
    quizModal.show();
}

// Product Comparison Navigation
function navigateToProductComparison(categoryId) {
    // This function would handle navigation to specific product categories
    console.log(`Navigating to category: ${categoryId}`);
}

// Add to Cart Functionality
function addToCart(productId) {
    // This function would handle adding products to the cart
    console.log(`Adding product ${productId} to cart`);
    // Here you would typically:
    // 1. Store cart data in localStorage
    // 2. Update cart UI
    // 3. Show confirmation message
}

// Cart Management
const cart = {
    items: [],
    
    addItem(product) {
        this.items.push(product);
        this.saveCart();
        this.updateCartUI();
    },
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    },
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    },
    
    updateCartUI() {
        // This function would update the cart icon/counter in the navbar
        console.log('Cart updated', this.items.length);
    }
};

// Initialize cart on page load
cart.loadCart();