const express = require('express');
const redis = require('redis');
const app = express();

app.use(express.json());

// Connect to your Kubernetes Redis Database
const redisClient = redis.createClient({
    url: 'redis://redis-cache:6379'
});

redisClient.on('error', (err) => console.log('Redis Error:', err));
redisClient.connect().then(() => console.log('Connected to Redis!')).catch(console.error);

// 1. Health Check (The page you saw in the browser)
app.get('/', (req, res) => {
    res.send('Cart Service Running 🚀 (Connected to Redis)');
});

// 2. View Cart Endpoint
app.get('/cart/:userId', async (req, res) => {
    try {
        const cartData = await redisClient.get(req.params.userId);
        if (cartData) {
            res.json(JSON.parse(cartData));
        } else {
            res.json({ items: [], total: 0, message: "Cart is empty" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database read failed" });
    }
});

// 3. Add to Cart Endpoint
app.post('/cart', async (req, res) => {
    try {
        const { userId, item, quantity, price } = req.body;
        
        // Get existing cart or create a new one
        let cartData = await redisClient.get(userId);
        let cart = cartData ? JSON.parse(cartData) : { items: [], total: 0 };

        // Add the new item to the cart
        cart.items.push({ item, quantity, price });
        cart.total += (price * quantity);

        // Save the updated cart back to Redis
        await redisClient.set(userId, JSON.stringify(cart));
        
        res.json({ message: "Item added successfully!", cart });
    } catch (err) {
        res.status(500).json({ error: "Database write failed" });
    }
});

app.listen(3001, () => {
    console.log('Backend Cart Service listening on port 3001');
});
