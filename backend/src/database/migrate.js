const pool = require("./config");

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        due_date DATE,
        assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
        created_by UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create task_attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

const seedData = async () => {
  try {
    // Check if admin user already exists
    const adminCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@example.com"]
    );

    if (adminCheck.rows.length === 0) {
      // Create admin user
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await pool.query(
        `
        INSERT INTO users (email, password, role) 
        VALUES ($1, $2, $3)
      `,
        ["admin@example.com", hashedPassword, "admin"]
      );

      console.log("Admin user created: admin@example.com / admin123");
    }

    // Check if regular user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["user@example.com"]
    );

    if (userCheck.rows.length === 0) {
      // Create regular user
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("user123", 10);

      await pool.query(
        `
        INSERT INTO users (email, password, role) 
        VALUES ($1, $2, $3)
      `,
        ["user@example.com", hashedPassword, "user"]
      );

      console.log("Regular user created: user@example.com / user123");
    }

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    await createTables();
    await seedData();
    console.log("Database migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { createTables, seedData };
