let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
});

async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
            renderProducts(data.products);
        }
    } catch (err) {
        console.error('Failed to fetch products:', err);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-icon">${p.image}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price.toFixed(2)}</div>
            <button onclick="addToCart('${p.id}', '${p.name}', ${p.price})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(id, name, price) {
    cart.push({ id, name, price, quantity: 1 });
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotal');

    badge.innerText = `Cart: ${cart.length} item${cart.length === 1 ? '' : 's'}`;

    if (cart.length === 0) {
        list.innerHTML = '<p style="color: #94a3b8;">Your cart is empty.</p>';
        totalEl.innerText = '$0.00';
        return;
    }

    list.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        </div>
    `).join('');

    const estTotal = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = `$${estTotal.toFixed(2)}`;
}

async function handleCheckout() {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'none';
    alertBox.className = 'alert-box';

    if (cart.length === 0) {
        alertBox.innerText = 'Please add products to your cart before checking out.';
        alertBox.classList.add('alert-error');
        alertBox.style.display = 'block';
        return;
    }

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart, customerName: 'Student Developer' })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            // Log uncaught error to browser console for Playwright to capture
            console.error('CHECKOUT_FAILED_ERROR:', data.error || 'Server error during checkout');
            if (data.stack) console.error('SERVER_STACK_TRACE:', data.stack);
            
            alertBox.innerText = `Checkout Error: ${data.error || 'HTTP 500 Internal Server Error'}`;
            alertBox.classList.add('alert-error');
            alertBox.style.display = 'block';
            return;
        }

        alertBox.innerText = `Success! Order ${data.orderId} placed for $${data.total.toFixed(2)}`;
        alertBox.classList.add('alert-success');
        alertBox.style.display = 'block';
        cart = [];
        updateCartUI();

    } catch (err) {
        console.error('Network or client error during checkout:', err);
        alertBox.innerText = `Network Error: ${err.message}`;
        alertBox.classList.add('alert-error');
        alertBox.style.display = 'block';
    }
}
