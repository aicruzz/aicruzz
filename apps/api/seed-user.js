require("dotenv").config({ path: __dirname + "/.env" });

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function seed() {
  try {
    await pool.query(`
      INSERT INTO users (id, email, password)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'test@example.com',
        'test-password'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("✅ User created");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();