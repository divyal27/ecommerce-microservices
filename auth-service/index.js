const pool = new Pool({
  user: 'postgres',
  host: 'postgres',   // ✅ THIS IS THE FIX
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});
