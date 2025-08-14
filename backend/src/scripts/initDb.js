const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres123@localhost:5432/task_management",
});

async function initDatabase() {
  try {
    console.log("Connecting to database...");

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        assigned_to INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        attachments TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if demo users exist
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@example.com"]
    );
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["user@example.com"]
    );

    // Create admin user if it doesn't exist
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
        ["admin@example.com", hashedPassword, "admin"]
      );
      console.log("✅ Admin user created: admin@example.com / admin123");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Create regular user if it doesn't exist
    if (userExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
        ["user@example.com", hashedPassword, "user"]
      );
      console.log("✅ User created: user@example.com / user123");
    } else {
      console.log("✅ User already exists");
    }

    console.log("✅ Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initDatabase();
