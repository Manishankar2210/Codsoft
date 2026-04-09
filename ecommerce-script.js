// =====================================
// E-COMMERCE APPLICATION - JavaScript
// =====================================

// Sample Products Data
const sampleProducts = [
    { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 79.99, originalPrice: 99.99, rating: 4.5, reviews: 128, image: 'https://via.placeholder.com/300', description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.', featured: true },
    { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 256, image: 'https://via.placeholder.com/300', description: 'Advanced smartwatch with health monitoring, GPS, and water resistance. Perfect for fitness enthusiasts.', featured: true },
    { id: 3, name: 'Men\'s Classic Polo Shirt', category: 'Clothing', price: 34.99, originalPrice: 44.99, rating: 4.3, reviews: 89, image: 'https://via.placeholder.com/300', description: 'Classic fit polo shirt made from 100% cotton. Available in multiple colors.', featured: true },
    { id: 4, name: 'Women\'s Running Shoes', category: 'Sports', price: 89.99, originalPrice: 119.99, rating: 4.6, reviews: 203, image: 'https://via.placeholder.com/300', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', featured: true },
    { id: 5, name: 'Modern Table Lamp', category: 'Home', price: 49.99, originalPrice: 59.99, rating: 4.4, reviews: 67, image: 'https://via.placeholder.com/300', description: 'Elegant table lamp with adjustable brightness. Perfect for bedside or desk.', featured: true },
    { id: 6, name: 'Laptop Stand Aluminum', category: 'Electronics', price: 39.99, originalPrice: 49.99, rating: 4.5, reviews: 142, image: 'https://via.placeholder.com/300', description: 'Ergonomic aluminum laptop stand for better posture. Compatible with all laptops up to 17 inches.', featured: true },
    { id: 7, name: 'Cotton T-Shirt Pack', category: 'Clothing', price: 29.99, originalPrice: 39.99, rating: 4.2, reviews: 178, image: 'https://via.placeholder.com/300', description: 'Pack of 3 comfortable cotton t-shirts in black, white, and gray.', featured: false },
    { id: 8, name: 'Yoga Mat Premium', category: 'Sports', price: 45.99, originalPrice: 55.99, rating: 4.8, reviews: 312, image: 'https://via.placeholder.com/300', description: 'Non-slip yoga mat with alignment lines. Extra thick for joint protection.', featured: true },
    { id: 9, name: 'Decorative Throw Pillows', category: 'Home', price: 24.99, originalPrice: 32.99, rating: 4.3, reviews: 95, image: 'https://via.placeholder.com/300', description: 'Set of 2 decorative throw pillows. Soft velvet cover with hidden zipper.', featured: false },
    { id: 10, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, originalPrice: 39.99, rating: 4.4, reviews: 234, image: 'https://via.placeholder.com/300', description: 'Ergonomic wireless mouse with silent clicks and long battery life.', featured: false },
    { id: 11, name: 'Denim Jacket', category: 'Clothing', price: 69.99, originalPrice: 89.99, rating: 4.6, reviews: 145, image: 'https://via.placeholder.com/300', description: 'Classic denim jacket with modern fit. Versatile for any casual occasion.', featured: true },
    { id: 12, name: 'Fitness Resistance Bands', category: 'Sports', price: 19.99, originalPrice: 29.99, rating: 4.5, reviews: 289, image: 'https://via.placeholder.com/300', description: 'Set of 5 resistance bands with varying resistance levels for home workouts.', featured: false }
];

// Application State
let products = [...sampleProducts];
let filteredProducts = [...products];
let cart = [];
let currentUser = null;
let orders = [];
let selectedProduct = null;

// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const page = document.getElementById(pageName + 'Page');
    if (page) {
        page.style.display = 'block';
        window.scrollTo(0, 0);
    }

    switch (pageName) {
        case 'home':
            loadFeaturedProducts();
            break;
        case 'products':
            loadProducts();
            break;
        case 'cart':
            loadCart();
            break;
        case 'checkout':
            loadCheckout();
            break;
        case 'orders':
            if (!currentUser) {
                showModal('login');
                return;
            }
            loadOrders();
            break;
    }
}

// =====================================
// PRODUCTS
// =====================================

function loadFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;

    const featured = products.filter(p => p.featured).slice(0, 8);
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('productCount');
    if (!grid) return;

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    countEl.textContent = `${filteredProducts.length} products`;
}

function createProductCard(product) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation();">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function viewProduct(productId) {
    selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    const container = document.getElementById('productDetailContent');
    const discount = Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100);

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
                </div>
            </div>
            <div class="product-detail-info">
                <span class="product-category">${selectedProduct.category}</span>
                <h1>${selectedProduct.name}</h1>
                <div class="product-rating">
                    ${generateStars(selectedProduct.rating)}
                    <span>(${selectedProduct.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${selectedProduct.price.toFixed(2)}</span>
                    ${selectedProduct.originalPrice > selectedProduct.price ? `<span class="original-price">$${selectedProduct.originalPrice.toFixed(2)}</span>` : ''}
                    ${discount > 0 ? `<span class="product-badge" style="margin-left: 12px;">Save ${discount}%</span>` : ''}
                </div>
                <p class="product-description">${selectedProduct.description}</p>
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(-1)">-</button>
                        <span id="productQuantity">1</span>
                        <button onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                <div class="product-detail-actions">
                    <button class="btn btn-primary btn-large" onclick="addToCartWithQuantity()">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline btn-large">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    showPage('productDetail');
}

let detailQuantity = 1;

function changeQuantity(delta) {
    detailQuantity = Math.max(1, detailQuantity + delta);
    document.getElementById('productQuantity').textContent = detailQuantity;
}

function addToCartWithQuantity() {
    if (selectedProduct) {
        for (let i = 0; i < detailQuantity; i++) {
            addToCartSilent(selectedProduct.id);
        }
        showToast(`Added ${detailQuantity} item(s) to cart`, 'success');
        detailQuantity = 1;
    }
}

// =====================================
// SEARCH & FILTER
// =====================================

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    if (document.getElementById('productsPage').style.display !== 'none') {
        loadProducts();
    }
}

function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }
    showPage('products');
}

function applyFilters() {
    const checkboxes = document.querySelectorAll('.filters-sidebar input[type="checkbox"]:checked');
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const sortBy = document.getElementById('sortSelect').value;

    filteredProducts = products.filter(p => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        const priceMatch = p.price >= minPrice && p.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    // Sort
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    loadProducts();
}

function clearFilters() {
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'default';
    filteredProducts = [...products];
    loadProducts();
}

// =====================================
// CART
// =====================================

function addToCart(productId) {
    addToCartSilent(productId);
    showToast('Added to cart', 'success');
}

function addToCartSilent(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    saveCart();
    loadCart();
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveCart();
        loadCart();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function loadCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
                <button class="btn btn-primary" onclick="showPage('products')">Shop Now</button>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <span class="product-category">${item.category}</span>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="current-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadSavedCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartBadge();
    }
}

// =====================================
// CHECKOUT
// =====================================

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    showPage('checkout');
}

function loadCheckout() {
    const checkoutItems = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const totalEl = document.getElementById('checkoutTotal');

    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-info">
                <h4>${item.name}</h4>
                <span>Qty: ${item.quantity}</span>
            </div>
            <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    // Pre-fill email if logged in
    if (currentUser) {
        document.getElementById('checkoutEmail').value = currentUser.email;
    }
}

function placeOrder(event) {
    event.preventDefault();

    const orderNumber = '#' + Math.floor(Math.random() * 90000 + 10000);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;

    const order = {
        id: orderNumber,
        items: [...cart],
        total: subtotal + shipping,
        status: 'processing',
        date: new Date().toLocaleDateString()
    };

    orders.push(order);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();

    // Show success
    document.getElementById('orderNumber').textContent = orderNumber;
    showPage('orderSuccess');
    showToast('Order placed successfully!', 'success');
}

// =====================================
// ORDERS
// =====================================

function loadOrders() {
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-box"></i>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <button class="btn btn-primary" onclick="showPage('products')">Shop Now</button>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order ${order.id}</h3>
                <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-thumb">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span>${order.date}</span>
                <span class="order-total">$${order.total.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

// =====================================
// AUTHENTICATION
// =====================================

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;

    currentUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('login');
    showToast('Welcome back!', 'success');
}

function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;

    currentUser = {
        id: Date.now(),
        name: name,
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('register');
    showToast('Account created!', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    closeUserMenu();
    showToast('Logged out');
    showPage('home');
}

function updateAuthUI() {
    const guestMenu = document.getElementById('guestMenu');
    const loggedInMenu = document.getElementById('loggedInMenu');

    if (currentUser) {
        guestMenu.style.display = 'none';
        loggedInMenu.style.display = 'block';
    } else {
        guestMenu.style.display = 'block';
        loggedInMenu.style.display = 'none';
    }
}

// =====================================
// UI HELPERS
// =====================================

function showModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.remove('show');
    document.body.style.overflow = '';
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => showModal(to), 200);
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function closeUserMenu() {
    document.getElementById('userDropdown').classList.remove('show');
}

function toggleMobileNav() {
    const navCategories = document.querySelector('.nav-categories');
    navCategories.style.display = navCategories.style.display === 'flex' ? 'none' : 'flex';
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) closeUserMenu();
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id.replace('Modal', '');
        closeModal(modalId);
    }
});

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    // Load saved cart
    loadSavedCart();

    // Load featured products
    loadFeaturedProducts();
});
