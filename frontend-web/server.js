const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Serve a basic HTML page
app.get('/', async (req, res) => {
    let productStatus = 'Loading...';
    let cartStatus = 'Loading...';

    // 1. Try to reach the Product Service via Kubernetes internal DNS
    try {
        const productRes = await axios.get('http://product-service:80');
        productStatus = JSON.stringify(productRes.data) || 'Product Service Reachable';
    } catch (error) {
        productStatus = 'Failed to connect to Product Service';
    }

    // 2. Try to reach the Cart Service via Kubernetes internal DNS
    try {
        const cartRes = await axios.get('http://cart-service:3001');
        cartStatus = JSON.stringify(cartRes.data) || 'Cart Service Reachable';
    } catch (error) {
        cartStatus = 'Failed to connect to Cart Service';
    }

    // Output the HTML
    res.send(`
        <html>
            <head>
                <title>E-Commerce Microservices</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f9;}
                    .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; }
                    h1 { color: #333; }
                    .status { margin: 10px 0; padding: 15px; border-left: 5px solid #007bff; background: #fdfdfd;}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🛍️ Frontend Web UI</h1>
                    <p>This page is served by the Frontend Web pod. Below is the live status of your microservices:</p>
                    
                    <div class="status">
                        <strong>📦 Product Service:</strong> ${productStatus}
                    </div>
                    
                    <div class="status">
                        <strong>🛒 Cart Service:</strong> ${cartStatus}
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Frontend Web Server running on port ${PORT}`);
});
