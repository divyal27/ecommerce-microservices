const express = require('express');
const redis = require('redis');
const app = express();
app.use(express.json());

const PORT = 3001;

// Connect to Redis using the Kubernetes Service name
const client = redis.createClient({
    url: 'redis://redis-cache:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => console.log('Connected to Redis successfully!'));

// Basic health check for the frontend
app.get('/', (req, res) => {
    res.send('Cart Service Running 🚀 (Connected to Redis)');
});

// Add an item to the cart
app.post('/add', async (req, res) => {
    const item = req.query.item || 'Mystery Item';
    await client.lPush('shopping-cart', item);
    res.send(`Added ${item} to your cart!`);
});

// View the cart
app.get('/items', async (req, res) => {
    const items = await client.lRange('shopping-cart', 0, -1);
    res.json({ cart: items });
});

app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});
