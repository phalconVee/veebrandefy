// Product database - simulating a backend database
const PRODUCT_DATABASE = [
    {
        id: 1,
        name: "Serum",
        brand: "STURM",
        price: 325,
        image: "https://i.imgur.com/0OeYB0i.jpg",
        category: "skincare"
    },
    {
        id: 2,
        name: "Facial Cleanser",
        brand: "Bio Effect",
        price: 59.99,
        image: "https://i.imgur.com/ytg8AfY.jpg",
        category: "skincare"
    },
    {
        id: 3,
        name: "CeraVe",
        brand: "brandefy",
        price: 19,
        image: "https://i.imgur.com/OzTkRuK.jpg",
        category: "skincare"
    }
];

// Constants for DOM elements and configuration
const CONSTANTS = {
    SELECTORS: {
        mainProductCard: '.main-product-card',
        searchInput: '#searchInput',
        searchResults: '#searchResults',
        modal: '#product-modal',
        modalTitle: '#modal-title',
        modalText: '#modal-text'
    },
    PRODUCT_CARDS: ['product-card-1', 'product-card-2', 'product-card-3'],
    BUTTONS: ['formulaMatch', 'lowestPrice', 'highestRated'],
    DISPLAY: {
        block: 'block',
        none: 'none'
    }
};

// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced search functionality
function searchProduct() {
    const searchInput = document.querySelector(CONSTANTS.SELECTORS.searchInput);
    const mainProductCard = document.querySelector(CONSTANTS.SELECTORS.mainProductCard);
    const searchTerm = searchInput.value.trim().toLowerCase();

    // If search is cleared, hide the results
    if (!searchTerm) {
        mainProductCard.style.display = CONSTANTS.DISPLAY.none;
        // Hide all comparison cards
        CONSTANTS.PRODUCT_CARDS.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                card.style.display = CONSTANTS.DISPLAY.none;
            }
        });
        return;
    }

    // Show loading state
    mainProductCard.style.display = CONSTANTS.DISPLAY.block;
    mainProductCard.innerHTML = '<div class="loading">Searching...</div>';

    // Simulate API call delay
    setTimeout(() => {
        // Search in product database
        const results = PRODUCT_DATABASE.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        if (results.length > 0) {
            displaySearchResults(results, mainProductCard);
        } else {
            mainProductCard.innerHTML = `
                <div class="no-results">
                    <p>No products found matching "${escapeHtml(searchTerm)}"</p>
                    <button class="reset-search" onclick="resetSearch()">Clear Search</button>
                </div>
            `;
        }
    }, 500);
}

// Display search results
function displaySearchResults(results, container) {
    const resultsHTML = results.map(product => `
        <div class="search-result-item">
            <img src="${escapeHtml(product.image)}" 
                 alt="${escapeHtml(product.name)}" 
                 class="product-image">
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p class="brand">${escapeHtml(product.brand)}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="comparison-buttons">
                    <button 
                        id="formulaMatch" 
                        class="toggle-button"
                        onclick="showProductCard('product-card-1', 'formulaMatch')"
                    >
                        Formula Match
                    </button>
                    <button 
                        id="lowestPrice" 
                        class="toggle-button"
                        onclick="showProductCard('product-card-2', 'lowestPrice')"
                    >
                        Lowest Price
                    </button>
                    <button 
                        id="highestRated" 
                        class="toggle-button"
                        onclick="showProductCard('product-card-3', 'highestRated')"
                    >
                        Highest Rated
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="search-results">
            <div class="search-header">
                <h3>Search Results</h3>
                <button class="reset-search" onclick="resetSearch()">Clear Search</button>
            </div>
            <div class="results-container">
                ${resultsHTML}
            </div>
        </div>
    `;
}

// Function to reset search
function resetSearch() {
    const searchInput = document.querySelector(CONSTANTS.SELECTORS.searchInput);
    const mainProductCard = document.querySelector(CONSTANTS.SELECTORS.mainProductCard);
    
    // Clear search input
    searchInput.value = '';
    
    // Hide results
    mainProductCard.style.display = CONSTANTS.DISPLAY.none;

    // Hide all comparison cards
    CONSTANTS.PRODUCT_CARDS.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            card.style.display = CONSTANTS.DISPLAY.none;
        }
    });
}

// Add to cart functionality
function addToCart(productName, price) {
    try {
        if (!productName || typeof price !== 'number') {
            throw new Error('Invalid product details');
        }
        
        const cartItem = {
            name: productName,
            price: price,
            quantity: 1,
            timestamp: new Date().toISOString()
        };
        
        console.log('Added to cart:', cartItem);
        showNotification(`${productName} added to cart - $${price.toFixed(2)}`);
        
    } catch (error) {
        console.error('Add to cart error:', error);
        showNotification('Failed to add item to cart', 'error');
    }
}

// Product card display with transitions
function showProductCard(cardId, buttonId) {
    if (!CONSTANTS.PRODUCT_CARDS.includes(cardId) || !CONSTANTS.BUTTONS.includes(buttonId)) {
        console.error('Invalid card or button ID');
        return;
    }

    // Hide all cards with fade-out effect
    CONSTANTS.PRODUCT_CARDS.forEach(card => {
        const element = document.getElementById(card);
        if (element) {
            element.classList.add('fade-out');
            setTimeout(() => {
                element.style.display = CONSTANTS.DISPLAY.none;
                element.classList.remove('fade-out');
            }, 300);
        }
    });

    // Show selected card with fade-in effect
    const selectedCard = document.getElementById(cardId);
    if (selectedCard) {
        setTimeout(() => {
            selectedCard.style.display = CONSTANTS.DISPLAY.block;
            selectedCard.classList.add('fade-in');
        }, 300);
    }

    updateButtonStates(buttonId);
}

// Button state management
function updateButtonStates(activeButtonId) {
    CONSTANTS.BUTTONS.forEach(btn => {
        const button = document.getElementById(btn);
        if (button) {
            button.classList.remove(`clicked-${btn}`);
            if (btn === activeButtonId) {
                button.classList.add(`clicked-${activeButtonId}`);
            }
        }
    });
}

// Modal functionality
function showModal(productName) {
    const modal = document.querySelector(CONSTANTS.SELECTORS.modal);
    const modalTitle = document.querySelector(CONSTANTS.SELECTORS.modalTitle);
    const modalText = document.querySelector(CONSTANTS.SELECTORS.modalText);
    
    if (!modal || !modalTitle || !modalText) return;

    modalTitle.textContent = `Product Recommendation for ${escapeHtml(productName)}`;
    modalText.textContent = `Here is a recommended ${escapeHtml(productName)} product just for you!`;
    
    modal.classList.add('modal-fade-in');
    modal.style.display = CONSTANTS.DISPLAY.block;
}

function closeModal() {
    const modal = document.querySelector(CONSTANTS.SELECTORS.modal);
    if (!modal) return;
    
    modal.classList.add('modal-fade-out');
    setTimeout(() => {
        modal.style.display = CONSTANTS.DISPLAY.none;
        modal.classList.remove('modal-fade-out');
    }, 300);
}

// Utility functions
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    
    // Hide main product card and comparison cards initially
    const mainProductCard = document.querySelector(CONSTANTS.SELECTORS.mainProductCard);
    if (mainProductCard) {
        mainProductCard.style.display = CONSTANTS.DISPLAY.none;
    }
    
    CONSTANTS.PRODUCT_CARDS.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            card.style.display = CONSTANTS.DISPLAY.none;
        }
    });

    // Debounced search
    const searchInput = document.querySelector(CONSTANTS.SELECTORS.searchInput);
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchProduct, 300));
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                resetSearch();
            }
        });
    }

    // Modal close on outside click
    window.onclick = (event) => {
        const modal = document.querySelector(CONSTANTS.SELECTORS.modal);
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Sign in
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const cartButton = document.querySelector('.cart-button');
    const signinButton = document.querySelector('.signin-button');
    const authModal = document.getElementById('auth-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    
    // Show/hide modals
    function showModal(modal) {
        modal.classList.add('active');
    }
 
    function closeModal(modal) {
        modal.classList.remove('active');
    }
 
    // Cart button logic
    cartButton.addEventListener('click', () => {
        /* showModal(checkoutModal); */
        alert('i dey o')
    });
 
    // Sign-in button logic
    signinButton.addEventListener('click', () => {
        showModal(authModal);
    });
 
    // Close modal on click of close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(authModal);
            closeModal(checkoutModal);
        });
    });
 
    // Form submit handling for login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Login Successful! Proceeding to checkout.");
        closeModal(authModal);
        showModal(checkoutModal);  // Redirecting to checkout modal after login
    });
 
    // Form submit handling for sign-up
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Account created successfully! Proceeding to checkout.");
        closeModal(authModal);
        showModal(checkoutModal);  // Redirecting to checkout modal after sign-up
    });
 
    // Show login form and hide signup form
    const loginTab = document.querySelector('[data-tab="login"]');
    const signupTab = document.querySelector('[data-tab="signup"]');
    const signupFormSection = document.getElementById('signup-form');
    const loginFormSection = document.getElementById('login-form');
 
    // Switching between forms on tab click
    loginTab.addEventListener('click', () => {
        loginFormSection.style.display = 'block';
        signupFormSection.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    });
 
    signupTab.addEventListener('click', () => {
        signupFormSection.style.display = 'block';
        loginFormSection.style.display = 'none';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
    });
 
    // Initial view is login form
    loginFormSection.style.display = 'block';
    signupFormSection.style.display = 'none';
});