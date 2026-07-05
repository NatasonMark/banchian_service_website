// ========== STOCK MANAGEMENT SYSTEM ==========
// Initialize product stock from localStorage or default values
let productStock = JSON.parse(localStorage.getItem('banchian-stock')) || {
    1: 15,
    2: 8,
    3: 25,
    4: 5,
    5: 12,
    6: 0
};

// Save stock to localStorage
function saveStockData() {
    localStorage.setItem('banchian-stock', JSON.stringify(productStock));
}

// Update stock for a product
function updateStock(productId, newStock) {
    const stock = Math.max(0, newStock);
    productStock[productId] = stock;
    saveStockData();
    
    // Update UI in real-time
    updateProductCardUI(productId);
    updateStockBadgeUI(productId);
    
    console.log(`📦 อัปเดตสต็อกสินค้า #${productId}: ${stock} ชิ้น`);
}

// Update product card UI
function updateProductCardUI(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card) {
        const stockCount = productStock[productId];
        const stockCountElement = card.querySelector('.stock-count');
        const stockBadge = card.querySelector('.stock-badge');
        const addCartBtn = card.querySelector('.add-cart');
        
        // Update stock count display
        if (stockCountElement) {
            stockCountElement.textContent = stockCount;
        }
        
        // Update badge
        if (stockBadge) {
            if (stockCount === 0) {
                stockBadge.innerHTML = '❌ สินค้าหมด';
                stockBadge.classList.add('out-of-stock');
            } else if (stockCount <= 5) {
                stockBadge.innerHTML = '⚠️ สินค้าใกล้หมด';
                stockBadge.classList.remove('out-of-stock');
            } else {
                stockBadge.innerHTML = '✓ มีสต็อก';
                stockBadge.classList.remove('out-of-stock');
            }
        }
        
        // Disable/Enable add cart button
        if (addCartBtn) {
            addCartBtn.disabled = stockCount === 0;
            addCartBtn.style.opacity = stockCount === 0 ? '0.5' : '1';
            addCartBtn.style.cursor = stockCount === 0 ? 'not-allowed' : 'pointer';
        }
    }
}

// Update stock badge UI in cart
function updateStockBadgeUI(productId) {
    const cards = document.querySelectorAll(`[data-product-id="${productId}"]`);
    cards.forEach(card => {
        const stockCount = productStock[productId];
        const badge = card.querySelector('.stock-badge');
        
        if (badge) {
            if (stockCount === 0) {
                badge.innerHTML = '❌ สินค้าหมด';
                badge.classList.add('out-of-stock');
            } else if (stockCount <= 5) {
                badge.innerHTML = '⚠️ สินค้าใกล้หมด';
                badge.classList.remove('out-of-stock');
            } else {
                badge.innerHTML = '✓ มีสต็อก';
                badge.classList.remove('out-of-stock');
            }
        }
    });
}

// Initialize all product cards on page load
function initializeStockDisplay() {
    for (let productId = 1; productId <= 6; productId++) {
        updateProductCardUI(productId);
    }
}

// ========== END STOCK MANAGEMENT ==========

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Open/Close Cart Modal
function openCart() {
    displayCartItems();
    document.getElementById('cartModal').classList.add('show');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Display Cart Items in Modal
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '';
        emptyCartDiv.style.display = 'block';
        document.getElementById('totalPrice').textContent = '฿0';
        return;
    }

    emptyCartDiv.style.display = 'none';
    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">฿${item.price.toLocaleString('th-TH')}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-total">฿${itemTotal.toLocaleString('th-TH')}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">ลบทั้งหมด</button>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;
    document.getElementById('totalPrice').textContent = `฿${total.toLocaleString('th-TH')}`;
}

// Update Quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const productId = item.productId;
    let currentStock = productStock[productId] || 0;

    // 🔵 กด "+"
    if (change > 0) {
        // เช็ค stock ก่อน
        if (currentStock <= 0) {
            showNotification("สินค้าไม่พอ", "error");
            return;
        }

        item.quantity += 1;
        updateStock(productId, currentStock - 1);
    }

    // 🔴 กด "-"
    else if (change < 0) {
        item.quantity -= 1;
        updateStock(productId, currentStock + 1);

        // ถ้าหมดแล้ว ลบออกจาก cart
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    }

    localStorage.setItem('banchian-cart', JSON.stringify(cart));
    displayCartItems();
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('ตะกร้างของคุณว่างเปล่า', 'error');
        return;
    }

    displayCheckoutSummary();
    closeCart();
    document.getElementById('checkoutModal').classList.add('show');
}

// Display Checkout Summary
function displayCheckoutSummary() {
    const summaryDiv = document.getElementById('checkoutSummary');
    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="checkout-item">
                <span>${item.name} (${item.quantity} ชิ้น)</span>
                <span>฿${itemTotal.toLocaleString('th-TH')}</span>
            </div>
        `;
    });

    summaryDiv.innerHTML = html;
    document.getElementById('checkoutTotal').textContent = `฿${total.toLocaleString('th-TH')}`;
}

// Handle Payment Method Change
document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const bankInfo = document.getElementById('bankInfo');
            if (e.target.value === 'bank') {
                bankInfo.style.display = 'block';
            } else {
                bankInfo.style.display = 'none';
            }
        });
    });

    // Handle Checkout Form Submit
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});

// Handle Checkout Submission
async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validate
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = {
        orderId: 'ORD-' + Date.now(),
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        paymentMethod,
        items: cart,
        total,
        status: 'pending',
        createdAt: new Date().toLocaleString('th-TH'),
        timestamp: Date.now()
    };

    // Save to localStorage
    let orders = JSON.parse(localStorage.getItem('banchian-orders')) || [];
    orders.push(order);
    localStorage.setItem('banchian-orders', JSON.stringify(orders));

    // Send email notification
    await sendOrderEmail(order);

    // Show success
    showNotification(`✅ สั่งซื้อสำเร็จ! หมายเลขคำสั่ง: ${order.orderId}`, 'success');

    // Clear cart and close modal
    cart = [];
    localStorage.setItem('banchian-cart', JSON.stringify(cart));
    document.getElementById('checkoutForm').reset();
    document.getElementById('checkoutModal').classList.remove('show');
    updateCartCount();

    // Log order
    console.log('📋 คำสั่งซื้อใหม่:', order);
}

// Send Order Email (เชื่อมกับ Backend)
async function sendOrderEmail(order) {
    try {
        const response = await fetch('send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: order.customerEmail,
                orderDetails: order
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✉️ ส่งอีเมลยืนยันไปที่:', order.customerEmail);
            showNotification(`📧 อีเมลยืนยันถูกส่งไปที่ ${order.customerEmail}`, 'success');
        } else {
            console.log('⚠️ ไม่สามารถส่งอีเมล:', result.message);
            console.log('💾 บันทึกคำสั่ง:', order);
        }
    } catch (error) {
        console.log('⚠️ เชื่อม Backend ไม่ได้ (ใช้ Local Storage เท่านั้น)');
        console.log('📋 คำสั่งซื้อ:', order);
    }
}

// Click outside modal to close
window.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');

    if (e.target === cartModal) {
        closeCart();
    }
    if (e.target === checkoutModal) {
        closeCheckout();
    }
});

// Product Filtering
const brandFilter = document.getElementById('brand-filter');
const btuFilter = document.getElementById('btu-filter');
const roomFilter = document.getElementById('room-filter');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
    const selectedBrand = brandFilter?.value;
    const selectedBtu = btuFilter?.value;
    const selectedRoom = roomFilter?.value;

    productCards.forEach(card => {
        let show = true;

        // Brand filter
        if (selectedBrand && card.dataset.brand !== selectedBrand) {
            show = false;
        }

        // BTU filter
        if (selectedBtu && show) {
            const cardBtu = parseInt(card.dataset.btu);
            const btuRanges = {
                '5000-8000': { min: 5000, max: 8000 },
                '8000-12000': { min: 8000, max: 12000 },
                '12000-18000': { min: 12000, max: 18000 },
                '18000+': { min: 18000, max: Infinity }
            };

            if (btuRanges[selectedBtu]) {
                const range = btuRanges[selectedBtu];
                if (cardBtu < range.min || cardBtu > range.max) {
                    show = false;
                }
            }
        }

        // Room size filter
        if (selectedRoom && card.dataset.room !== selectedRoom) {
            show = false;
        }

        // Show or hide card with animation
        card.style.display = show ? 'flex' : 'none';
        if (show) {
            card.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}

if (brandFilter) brandFilter.addEventListener('change', filterProducts);
if (btuFilter) btuFilter.addEventListener('change', filterProducts);
if (roomFilter) roomFilter.addEventListener('change', filterProducts);

// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('banchian-cart')) || [];

// Add to Cart Functionality
const addCartButtons = document.querySelectorAll('.add-cart');

addCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const card = button.closest('.product-card');
        const productId = card.dataset.productId;
        const productName = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('฿', '').replace(',', ''));
        
        // ตรวจสอบสต็อก
        const currentStock = productStock[productId] || 0;
        if (currentStock === 0) {
            showNotification('สินค้านี้หมดแล้ว ขออภัยค่ะ', 'error');
            return;
        }

        // เพิ่มสินค้าลงตะกร้า
        const cartItem = {
            id: Date.now(),
            productId: productId,
            name: productName,
            price: price,
            quantity: 1,
            timestamp: new Date().toLocaleString('th-TH')
        };

        // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
const existingItem = cart.find(item => item.name === productName);

if (currentStock <= 0) {
    showNotification(`สินค้าหมดแล้ว`, 'error');
    return;
}

// if (existingItem) {
//     if (existingItem.quantity == currentStock) {
//         showNotification(`สินค้าเหลืออยู่ ${currentStock} ชิ้นเท่านั้น`, 'error');
//         return;
//     }
 
//     existingItem.quantity += 1;
// } 
else {
    cart.push({ ...cartItem, quantity: 1 });
}

// 🔥 ลด stock ทุกครั้ง
updateStock(productId, currentStock - 1);

showNotification(`✓ เพิ่ม ${productName} ลงตะกร้าแล้ว`, 'success');

        // บันทึกลง Local Storage
        localStorage.setItem('banchian-cart', JSON.stringify(cart));
        updateCartCount();

        // Show animation
        const originalText = button.textContent;
        button.textContent = '✓ เพิ่มแล้ว';
        button.style.backgroundColor = '#00d4ff';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);

        console.log('ตะกร้าปัจจุบัน:', cart);
    });
});

// อัปเดตจำนวนสินค้าในตะกร้า
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`📦 จำนวนสินค้าในตะกร้า: ${totalItems} รายการ`);
}

// ดูตะกร้า
function viewCart() {
    console.clear();
    console.log('%c📦 ตะกร้าของคุณ', 'font-size: 16px; color: #0099cc; font-weight: bold;');
    console.table(cart);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log(`%c💰 รวมทั้งหมด: ฿${total.toLocaleString('th-TH')}`, 'font-size: 14px; color: #00d4ff; font-weight: bold;');
}

// ลบสินค้าจากตะกร้า
function removeFromCart(itemId) {
    const item = cart.find(i => i.id === itemId);

    if (item && item.productId) {
        const qty = item.quantity || 1;

        const currentStock = productStock[item.productId] || 0;

        // 🔥 คืน stock ตามจำนวนจริง
        updateStock(item.productId, currentStock + qty);
    }

    cart = cart.filter(item => item.id !== itemId);

    localStorage.setItem('banchian-cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();

    showNotification('ลบออกจากตะกร้าแล้ว', 'success');
}

// ล้างตะกร้า
function clearCart() {
    if (confirm('คุณแน่ใจหรือ? ต้องการล้างตะกร้า?')) {
        // ส่งคืนสต็อกสินค้าทั้งหมด
        cart.forEach(item => {
            if (item.productId) {
                const currentStock = productStock[item.productId] || 0;
                updateStock(item.productId, currentStock + item.quantity);
            }
        });
        
        cart = [];
        localStorage.setItem('banchian-cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems(); // ✨ อัปเดต UI แบบ realtime
        showNotification('ล้างตะกร้าแล้ว', 'success');
    }
}

// สั่งซื้อ
function checkout() {
    if (cart.length === 0) {
        showNotification('ตะกร้างของคุณว่างเปล่า', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`สั่งซื้อสำเร็จ! รวม ฿${total.toLocaleString('th-TH')} ✓`, 'success');
    cart = [];
    localStorage.setItem('banchian-cart', JSON.stringify(cart));
    updateCartCount();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.benefit-card, .feature, .review-card, .product-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Validate form
        if (!name || !email || !message) {
            showNotification('กรุณากรอกข้อมูลที่จำเป็นทั้งหมด', 'error');
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            showNotification('กรุณาใส่ที่อยู่อีเมลที่ถูกต้อง', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'กำลังส่ง...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('ส่งข้อความสำเร็จ! เราจะติดต่อคุณในไม่ช้า', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);

        console.log('Form submitted:', { name, email, phone, message });
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.4s ease-out;
        max-width: 300px;
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#FF6B6B';
        notification.style.color = 'white';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Add slide animations to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to top smooth behavior for hash links
window.addEventListener('hashchange', () => {
    const target = document.querySelector(window.location.hash);
    if (target) {
        setTimeout(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
});

// Add active class to navigation links based on scroll position
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Parallax effect on hero image
const heroImage = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const heroSection = document.querySelector('.hero');

    if (heroSection.offsetTop + heroSection.offsetHeight > scrollPosition) {
        const parallaxValue = scrollPosition * 0.5;
        if (heroImage) {
            heroImage.style.transform = `translateY(${parallaxValue}px)`;
        }
    }
});

// Add active style to nav links
const style2 = document.createElement('style');
style2.textContent = `
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style2);

// Counter animation for statistics (optional feature)
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Performance optimization: Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initialize page with animation
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-out';
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
    
    // Initialize stock display
    initializeStockDisplay();
});

// Console welcome message
console.log('%c🌬️ ยินดีต้อนรับ Banchian Service!', 'font-size: 20px; color: #0099cc; font-weight: bold;');
console.log('%cโซลูชันแอร์คอนดิชั่นพรีเมียมสำหรับการใช้ชีวิตสมัยใหม่', 'font-size: 14px; color: #00d4ff;');

// ========== ADMIN STOCK MANAGEMENT ==========
// Product names mapping
const productNames = {
    1: 'Panasonic',
    2: 'เบนเชียน สมาร์ท AI-18',
    3: 'เบนเชียน อีโค คอมแพคท์',
    4: 'เบนเชียน เอลีท',
    5: 'เบนเชียน วอยซ์ คอนโทรล',
    6: 'เบนเชียน โปรเฟชั่นแนล'
};

// Render stock management UI in admin
function renderStockManagement() {
    const container = document.getElementById('stockManagementGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let productId = 1; productId <= 6; productId++) {
        const stock = productStock[productId] || 0;
        const productName = productNames[productId];
        
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item';
        stockItem.innerHTML = `
            <h3>${productName}</h3>
            <div class="stock-item-content">
                <p>รหัสสินค้า: <strong>#${productId}</strong></p>
                <p>สต็อกปัจจุบัน: <strong>${stock} ชิ้น</strong></p>
                <p style="color: ${stock === 0 ? '#FF6B6B' : stock <= 5 ? '#FFA500' : '#4CAF50'};">
                    ${stock === 0 ? '⚠️ สินค้าหมด' : stock <= 5 ? '⚠️ สินค้าใกล้หมด' : '✓ มีสต็อกเพียงพอ'}
                </p>
            </div>
            <div class="stock-input-group">
                <input type="number" id="stock-${productId}" value="${stock}" min="0" max="999" class="stock-input" placeholder="จำนวนสินค้า">
                <button class="stock-btn" onclick="updateStockFromAdmin(${productId})">อัปเดต</button>
            </div>
            <div id="msg-${productId}"></div>
        `;
        
        container.appendChild(stockItem);
    }
}

// Update stock from admin panel
function updateStockFromAdmin(productId) {
    const input = document.getElementById(`stock-${productId}`);
    const newStock = parseInt(input.value) || 0;
    const msgDiv = document.getElementById(`msg-${productId}`);
    
    // Validate input
    if (newStock < 0) {
        showAdminMessage(msgDiv, 'จำนวนสต็อกต้องมากกว่า 0', 'error');
        return;
    }
    
    // Update stock
    updateStock(productId, newStock);
    
    // Show success message
    showAdminMessage(msgDiv, `✓ อัปเดตสต็อกสำเร็จ (${newStock} ชิ้น)`, 'success');
    
    // Re-render UI
    setTimeout(() => {
        renderStockManagement();
    }, 1500);
}

// Show admin message
function showAdminMessage(element, message, type) {
    const msg = document.createElement('div');
    msg.className = `stock-update-message ${type}`;
    msg.textContent = message;
    
    element.innerHTML = '';
    element.appendChild(msg);
    
    setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 0.3s ease';
    }, 2500);
}

// Initialize stock management when on admin page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stockManagementGrid')) {
        renderStockManagement();
    }
});
