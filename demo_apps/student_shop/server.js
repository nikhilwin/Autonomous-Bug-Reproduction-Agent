const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Products Catalog
const PRODUCTS = [
    { id: 'prod_1', name: 'Wireless Headphones', price: 99.99, image: '🎧' },
    { id: 'prod_2', name: 'Mechanical Keyboard', price: 149.50, image: '⌨️' },
    { id: 'prod_3', name: 'Ergonomic Mouse', price: 59.99, image: '🖱️' },
    { id: 'prod_4', name: '4K Gaming Monitor', price: 399.00, image: '🖥️' }
];

// Helper function with deliberate bug
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        // PLANTED BUG #1:
        // When i > 0, attempts to read items[i].details.price where details is undefined for items > 0
        if (i > 0) {
            total += items[i].details.price; // Throws TypeError: Cannot read properties of undefined (reading 'price')
        } else {
            total += items[i].price * (items[i].quantity || 1);
        }
    }
    return total;
}

// API Routes
app.get('/api/products', (req, res) => {
    res.json({ success: true, products: PRODUCTS });
});

app.post('/api/checkout', (req, res) => {
    const { items, customerName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    try {
        // Triggers calculateTotal which crashes if items.length > 1
        const grandTotal = calculateTotal(items);
        return res.json({
            success: true,
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            total: grandTotal,
            message: `Thank you for your purchase, ${customerName || 'Valued Customer'}!`
        });
    } catch (err) {
        console.error('SERVER ERROR IN CHECKOUT:', err.message);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            error: err.message,
            stack: err.stack,
            location: 'server.js:calculateTotal line 25'
        });
    }
});

app.listen(PORT, () => {
    console.log(`StudentShop Demo Server running on http://localhost:${PORT}`);
});
