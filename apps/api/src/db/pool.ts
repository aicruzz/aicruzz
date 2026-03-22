import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Test connection (you can remove later)
pool.query("SELECT NOW()")
  .then(res => console.log("✅ DB connected:", res.rows))
  .catch(err => console.error("❌ DB error:", err));

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

export default pool;
