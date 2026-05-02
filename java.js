// Sample Product Data
const products = [
    { id: 1, name: "Premium Headphones", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", category: "electronics", stock: 10, description: "High-fidelity audio with active noise cancellation and 40-hour battery life." },
    { id: 2, name: "Organic Honey", price: 12.50, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80", category: "groceries", stock: 15, description: "100% pure, raw, and unfiltered organic honey sourced from local wildflower apiaries." },
    { id: 3, name: "Smart Watch", price: 249.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", category: "electronics", stock: 5, description: "Advanced fitness tracking, heart rate monitoring, and seamless smartphone integration." },
    { id: 4, name: "Gourmet Coffee", price: 18.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80", category: "groceries", stock: 20, description: "Small-batch roasted Arabica beans with notes of dark chocolate and toasted hazelnuts." },
    { id: 5, name: "Cotton T-Shirt", price: 25.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", category: "fashion", stock: 12, description: "Premium 100% organic cotton tee with a modern slim fit and breathable weave." },
    { id: 6, name: "Leather Wallet", price: 45.00, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80", category: "fashion", stock: 8, description: "Handcrafted full-grain leather wallet with RFID protection and minimalist design." },
    { id: 7, name: "Iphone 14 Pro", price: 999.99, image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80", category: "electronics", stock: 10, description: "The ultimate smartphone featuring the Dynamic Island and a 48MP Pro camera system." },
    { id: 8, name: "Running Sneakers", price: 85.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", category: "fashion", stock: 7, description: "Lightweight performance sneakers with ultra-responsive cushioning for long-distance comfort." },
    { id: 9, name: "Mechanical Keyboard", price: 129.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80", category: "electronics", stock: 6, description: "Tactile mechanical switches with RGB backlighting and durable aircraft-grade aluminum frame." }
];

// Load cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedPaymentMethod = 'visa'; // Default selection

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const productModal = document.getElementById('product-modal');
const modalOverlay = document.getElementById('product-modal-overlay');
const modalContent = document.getElementById('modal-content');

// 1. Initialize Products
function displayProducts(productsToDisplay = products) {
    productContainer.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <span class="category-badge">${product.category}</span>
            <img src="${product.image}" alt="${product.name}" onclick="openProductModal(${product.id})" style="cursor: pointer;">
            <h3 onclick="openProductModal(${product.id})" style="cursor: pointer;">${product.name}</h3>
            <p class="price">$${product.price}</p>
            <p class="stock-info ${product.stock < 5 ? 'low-stock' : ''}">${product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock > 0 ? 'Add to Cart' : 'Sold Out'}</button>
        </div>
    `).join('');
}

// Category Filter Logic
window.filterProducts = (category) => {
    // Update active button state
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const isMatch = btn.getAttribute('onclick')?.includes(`'${category}'`);
        btn.classList.toggle('active', isMatch);
    });

    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    displayProducts(filtered);
};

// Product Modal Logic
window.openProductModal = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalContent.innerHTML = `
        <div class="modal-img-container">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info-container">
            <span class="category-badge">${product.category}</span>
            <h2>${product.name}</h2>
            <p class="modal-price">$${product.price}</p>
            <p class="modal-description">${product.description}</p>
            <p class="stock-info ${product.stock < 5 ? 'low-stock' : ''}">Availability: ${product.stock} units left</p>
            <button class="add-to-cart" onclick="addToCart(${product.id}); closeProductModal()" ${product.stock <= 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;
    productModal.classList.add('active');
    modalOverlay.classList.add('active');
};

window.closeProductModal = () => {
    productModal.classList.remove('active');
    modalOverlay.classList.remove('active');
};

// 2. Cart Logic
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product.stock <= 0) return;

    const existingItem = cart.find(item => item.id === productId);
    product.stock--;

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, stock: undefined }); // Don't store full stock in cart
    }
    displayProducts(); // Refresh stock in UI
    updateCartUI();
};

window.selectPaymentMethod = (method) => {
    selectedPaymentMethod = method;
    // Update UI active state
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.method === method);
    });
    
    // Show or hide Visa details form
    const visaForm = document.getElementById('visa-details');
    if (visaForm) {
        visaForm.classList.toggle('active', method === 'visa');
    }
};

window.updateQuantity = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);

    if (item && product) {
        if (delta === 1 && product.stock <= 0) return alert("No more stock available!");
        
        product.stock -= delta;
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        displayProducts();
        updateCartUI();
    }
};

window.removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    if (item && product) {
        product.stock += item.quantity;
    }
    cart = cart.filter(item => item.id !== productId);
    displayProducts();
    updateCartUI();
};

function updateCartUI() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">🛍️ Your cart is empty</div>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = total.toFixed(2);

    // Save to localStorage so cart persists on refresh
    localStorage.setItem('cart', JSON.stringify(cart));

    // Initialize Scroll Reveal for Cart Items
    const cartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1, root: cartItemsContainer });

    document.querySelectorAll('.cart-item').forEach(item => cartObserver.observe(item));
}

// 3. UI Interactions
const toggleCart = (isOpen) => {
    cartSidebar.classList.toggle('active', isOpen);
    cartOverlay.classList.toggle('active', isOpen);
};

cartBtn.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

// Close Product Modal
document.getElementById('close-modal')?.addEventListener('click', closeProductModal);
modalOverlay?.addEventListener('click', closeProductModal);

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    if (selectedPaymentMethod === 'visa') {
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvc = document.getElementById('card-cvc').value.trim();

        if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
            return alert("Please fill in all Visa card information.");
        }
        
        if (cardNumber.length < 16) {
            return alert("Please enter a valid 16-digit card number.");
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            return alert("Please enter a valid expiry date (MM/YY).");
        }
    }

    const total = cartTotal.innerText;
    alert(`Success! Payment confirmed via ${selectedPaymentMethod.toUpperCase()}\nTotal: $${total}\nThank you for your purchase!`);

    // Clear the cart after successful checkout
    cart = [];
    localStorage.removeItem('cart');
    
    // Update UI
    updateCartUI();
    toggleCart(false);
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-active');
    menuToggle.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Update active class
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // Trigger click animation
        this.classList.add('menu-item-clicked');
        setTimeout(() => this.classList.remove('menu-item-clicked'), 300);

        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        navMenu.classList.remove('nav-active');
        menuToggle.classList.remove('toggle');
    });
});

// Real-time Formatting for Visa Information
document.getElementById('card-number')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Add space every 4 digits
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = value.substring(0, 19); // Max 16 digits + 3 spaces
});

document.getElementById('card-expiry')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value.substring(0, 5);
});

// Sync stock logic with cart on page load
function syncStockOnLoad() {
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) product.stock -= cartItem.quantity;
    });
}

// Load app
syncStockOnLoad();
displayProducts();
updateCartUI();
