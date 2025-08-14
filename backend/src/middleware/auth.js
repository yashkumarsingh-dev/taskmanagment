const jwt = require("jsonwebtoken");
const pool = require("../database/config");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database to ensure they still exist
    const result = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

const requireOwnerOrAdmin = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    // Get task to check ownership
    const result = await pool.query(
      "SELECT created_by FROM tasks WHERE id = $1",
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = result.rows[0];

    // Allow if user is admin or task owner
    if (req.user.role === "admin" || req.user.id === task.created_by) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied - you can only manage your own tasks",
    });
  } catch (error) {
    console.error("Owner check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin,
};
