// Get quiz results from localStorage
const quizResults = JSON.parse(localStorage.getItem('quizResults'));

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const sortSelect = document.getElementById('sortSelect');
const quizResultsSummary = document.querySelector('.quiz-results-summary');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

// Sample product data (in real app, this would come from an API)
const products = [
  {
      id: 1,
      name: "Clinical Vitamin C + E + Ferulic Serum",
      brand: "Brandefy",
      type: "serum",
      price: 49.99,
      originalPrice: 182.00,
      image: "assets/images/products/vitamin-c-serum.jpg",
      concerns: ["aging", "pigmentation"],
      dupeFor: "SkinCeuticals C E Ferulic"
  },
  {
      id: 2,
      name: "Gentle Foaming Cleanser",
      brand: "Brandefy",
      type: "cleanser",
      price: 12.99,
      originalPrice: 35.00,
      image: "assets/images/products/cleanser.jpg",
      concerns: ["sensitivity"],
      dupeFor: "Cerave Foaming Facial Cleanser"
  },
  {
      id: 3,
      name: "Hyaluronic Acid + B5 Serum",
      brand: "Brandefy",
      type: "serum",
      price: 28.99,
      originalPrice: 89.00,
      image: "assets/images/products/hyaluronic-serum.jpeg",
      concerns: ["dryness", "aging"],
      dupeFor: "SkinCeuticals H.A. Intensifier"
  },
  {
      id: 4,
      name: "Niacinamide 10% + Zinc 1%",
      brand: "Brandefy",
      type: "serum",
      price: 15.99,
      originalPrice: 42.00,
      image: "assets/images/products/niacinamide-serum.jpg",
      concerns: ["acne", "oiliness", "pores"],
      dupeFor: "The Ordinary Niacinamide 10% + Zinc 1%"
  },
  {
      id: 5,
      name: "Ultra-Light Moisturizing Cream",
      brand: "Brandefy",
      type: "moisturizer",
      price: 19.99,
      originalPrice: 65.00,
      image: "assets/images/products/water-cream-moisturizer.jpg",
      concerns: ["combination", "oiliness"],
      dupeFor: "Tatcha The Water Cream"
  },
  {
      id: 6,
      name: "Retinol 0.5% Night Serum",
      brand: "Brandefy",
      type: "serum",
      price: 32.99,
      originalPrice: 88.00,
      image: "assets/images/products/retinol-serum.jpeg",
      concerns: ["aging", "texture", "acne"],
      dupeFor: "Sunday Riley A+ High-Dose Retinoid Serum"
  },
  {
      id: 7,
      name: "Barrier Repair Moisturizer",
      brand: "Brandefy",
      type: "moisturizer",
      price: 22.99,
      originalPrice: 68.00,
      image: "assets/images/products/barrier-cream.jpg",
      concerns: ["sensitivity", "dryness"],
      dupeFor: "Dr. Jart+ Ceramidin Cream"
  },
  {
      id: 8,
      name: "BHA Exfoliating Toner",
      brand: "Brandefy",
      type: "toner",
      price: 18.99,
      originalPrice: 45.00,
      image: "assets/images/products/bha-toner.jpeg",
      concerns: ["acne", "blackheads", "texture"],
      dupeFor: "Paula's Choice 2% BHA Liquid Exfoliant"
  }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayQuizResults();
    setupEventListeners();
    filterAndDisplayProducts();
});

// Display quiz results summary
function displayQuizResults() {
    if (!quizResults) {
        window.location.href = 'quiz.html';
        return;
    }

    const { answers } = quizResults;
    const tags = [
        `Skin Type: ${answers[1]}`,
        `Main Concern: ${answers[2]}`,
        `Sensitivity: ${answers[3]}`,
        `Budget: ${answers[4]}`
    ];

    quizResultsSummary.innerHTML = tags.map(tag => 
        `<span class="quiz-result-tag">${tag}</span>`
    ).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Sort change
    sortSelect.addEventListener('change', filterAndDisplayProducts);

    // Price range change
    priceRange.addEventListener('input', (e) => {
        priceValue.textContent = `$${e.target.value}`;
        filterAndDisplayProducts();
    });

    // Filter checkboxes
    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', filterAndDisplayProducts);
    });
}

// Filter and sort products
function filterAndDisplayProducts() {
    let filteredProducts = [...products];

    // Apply filters
    filteredProducts = filteredProducts.filter(product => {
        // Price filter
        if (product.price > parseInt(priceRange.value)) return false;

        // Product type filter
        const typeFilters = Array.from(document.querySelectorAll('[id^="filter"]:checked'))
            .map(checkbox => checkbox.value);
        if (typeFilters.length && !typeFilters.includes(product.type)) return false;

        // Concerns filter
        const concernFilters = Array.from(document.querySelectorAll('[id^="filterAcne"]:checked, [id^="filterAging"]:checked, [id^="filterPigmentation"]:checked'))
            .map(checkbox => checkbox.value);
        if (concernFilters.length && !product.concerns.some(concern => concernFilters.includes(concern))) return false;

        return true;
    });

    // Apply sorting
    switch (sortSelect.value) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'savings':
            filteredProducts.sort((a, b) => {
                const savingsA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
                const savingsB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
                return savingsB - savingsA;
            });
            break;
        case 'recommended':
            // Sort by matching quiz results (skin concerns and type)
            filteredProducts.sort((a, b) => {
                const matchScoreA = calculateMatchScore(a);
                const matchScoreB = calculateMatchScore(b);
                return matchScoreB - matchScoreA;
            });
            break;
    }

    displayProducts(filteredProducts);
}

// Calculate how well a product matches quiz results
function calculateMatchScore(product) {
    let score = 0;
    const { answers } = quizResults;

    // Match skin concerns
    if (product.concerns.includes(answers[2].toLowerCase())) score += 3;

    // Match sensitivity level
    switch (answers[3]) {
        case 'very-sensitive':
            if (product.concerns.includes('sensitivity')) score += 2;
            break;
        case 'somewhat-sensitive':
            if (product.concerns.includes('sensitivity')) score += 1;
            break;
    }

    // Match budget preference
    const budget = answers[4];
    if (budget === 'budget' && product.price < 15) score += 2;
    if (budget === 'mid-range' && product.price >= 15 && product.price <= 30) score += 2;
    if (budget === 'high-end' && product.price > 30) score += 2;

    return score;
}

// Display filtered and sorted products
function displayProducts(products) {
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try adjusting your filters to see more products.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const template = document.getElementById('product-card-template');
    const card = template.content.cloneNode(true);

    // Calculate savings percentage
    const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    // Update card elements
    card.querySelector('.comparison-badge').textContent = `Save ${savingsPercent}%`;
    card.querySelector('.product-image img').src = product.image;
    card.querySelector('.product-image img').alt = product.name;
    card.querySelector('.product-name').textContent = product.name;
    card.querySelector('.product-brand').textContent = `${product.brand} | Dupe for ${product.dupeFor}`;
    card.querySelector('.dupe-price').textContent = `$${product.price.toFixed(2)}`;
    card.querySelector('.original-price').textContent = `$${product.originalPrice.toFixed(2)}`;

    // Add to cart functionality
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product));

    return card;
}

// Cart functionality
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show confirmation
    showAddToCartConfirmation(product);
}

// Show add to cart confirmation
function showAddToCartConfirmation(product) {
    // Create and show a toast or notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${product.name} added to cart</span>
            <a href="cart.html" class="toast-action">View Cart</a>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

// Add toast notification styles
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .toast-notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .toast-action {
        color: white;
        text-decoration: underline;
    }
`;
document.head.appendChild(style);