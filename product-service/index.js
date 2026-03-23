const express = require('express');
const { Client } = require('pg');   // ✅ THIS WAS MISSING

const app = express();

const client = new Client({
  host: 'postgres',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
});

client.connect()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection failed', err));

app.get('/', (req, res) => {
  res.send('Product Service Running 🚀');
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
