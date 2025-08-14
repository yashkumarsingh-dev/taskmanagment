const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../database/config");
const {
  userValidation,
  validate,
  validateQuery,
} = require("../utils/validation");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(countResult.rows[0].count);

    // Get users with pagination
    const result = await pool.query(
      "SELECT id, email, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Email already exists
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validate(userValidation.register),
  async (req, res) => {
    try {
      const { email, password, role = "user" } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
        [email, hashedPassword, role]
      );

      const user = result.rows[0];

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validate(userValidation.update),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password, role } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [id]
      );

      if (existingUser.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build update query dynamically
      let updateFields = [];
      let values = [];
      let paramCount = 1;

      if (email !== undefined) {
        updateFields.push(`email = $${paramCount++}`);
        values.push(email);
      }

      if (password !== undefined) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.push(`password = $${paramCount++}`);
        values.push(hashedPassword);
      }

      if (role !== undefined) {
        updateFields.push(`role = $${paramCount++}`);
        values.push(role);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await pool.query(
        `UPDATE users SET ${updateFields.join(
          ", "
        )} WHERE id = $${paramCount} RETURNING id, email, role, created_at, updated_at`,
        values
      );

      res.json({
        success: true,
        message: "User updated successfully",
        data: {
          user: result.rows[0],
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user (this will cascade to tasks created by this user)
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
