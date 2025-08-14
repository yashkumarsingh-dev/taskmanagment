const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const pool = require("../database/config");
const {
  taskValidation,
  validate,
  validateQuery,
} = require("../utils/validation");
const {
  authenticateToken,
  requireOwnerOrAdmin,
} = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3, // Maximum 3 files
  },
});

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks with filtering and sorting
 *     tags: [Tasks]
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
 *         description: Number of tasks per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, due_date, priority, status]
 *           default: created_at
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticateToken,
  validateQuery(taskValidation.query),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        sortBy = "created_at",
        sortOrder = "desc",
        search,
      } = req.query;

      const offset = (page - 1) * limit;
      const userId = req.user.id;
      const isAdmin = req.user.role === "admin";

      // Build WHERE clause
      let whereConditions = [];
      let values = [];
      let paramCount = 1;

      // Non-admin users can only see their own tasks or tasks assigned to them
      if (!isAdmin) {
        whereConditions.push(
          `(created_by = $${paramCount} OR assigned_to = $${paramCount})`
        );
        values.push(userId);
        paramCount++;
      }

      if (status) {
        whereConditions.push(`status = $${paramCount++}`);
        values.push(status);
      }

      if (priority) {
        whereConditions.push(`priority = $${paramCount++}`);
        values.push(priority);
      }

      if (search) {
        whereConditions.push(
          `(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`
        );
        values.push(`%${search}%`);
        paramCount++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      // Get total count
      const countQuery = `
      SELECT COUNT(*) FROM tasks 
      LEFT JOIN users creator ON tasks.created_by = creator.id
      LEFT JOIN users assignee ON tasks.assigned_to = assignee.id
      ${whereClause}
    `;
      const countResult = await pool.query(countQuery, values);
      const totalTasks = parseInt(countResult.rows[0].count);

      // Get tasks with pagination and sorting
      const tasksQuery = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.updated_at,
        creator.email as created_by_email,
        assignee.email as assigned_to_email
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      ${whereClause}
      ORDER BY t.${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;
      values.push(limit, offset);

      const result = await pool.query(tasksQuery, values);

      res.json({
        success: true,
        data: {
          tasks: result.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalTasks,
            pages: Math.ceil(totalTasks / limit),
          },
        },
      });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // Build WHERE clause for access control
    let whereConditions = ["t.id = $1"];
    let values = [id];
    let paramCount = 2;

    if (!isAdmin) {
      whereConditions.push(
        `(t.created_by = $${paramCount} OR t.assigned_to = $${paramCount})`
      );
      values.push(userId);
      paramCount++;
    }

    const whereClause = whereConditions.join(" AND ");

    // Get task with creator and assignee info
    const taskQuery = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.updated_at,
        creator.email as created_by_email,
        assignee.email as assigned_to_email
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE ${whereClause}
    `;

    const taskResult = await pool.query(taskQuery, values);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Get task attachments
    const attachmentsQuery = `
      SELECT id, filename, original_name, mime_type, size, created_at
      FROM task_attachments
      WHERE task_id = $1
      ORDER BY created_at DESC
    `;
    const attachmentsResult = await pool.query(attachmentsQuery, [id]);

    const task = taskResult.rows[0];
    task.attachments = attachmentsResult.rows;

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 default: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               due_date:
 *                 type: string
 *                 format: date
 *               assigned_to:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticateToken,
  validate(taskValidation.create),
  async (req, res) => {
    try {
      const {
        title,
        description,
        status = "pending",
        priority = "medium",
        due_date,
        assigned_to,
      } = req.body;

      const created_by = req.user.id;

      // Validate assigned_to user exists if provided
      if (assigned_to) {
        const userCheck = await pool.query(
          "SELECT id FROM users WHERE id = $1",
          [assigned_to]
        );
        if (userCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Assigned user not found",
          });
        }
      }

      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, status, priority, due_date, created_at`,
        [
          title,
          description,
          status,
          priority,
          due_date,
          assigned_to,
          created_by,
        ]
      );

      const task = result.rows[0];

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: { task },
      });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               due_date:
 *                 type: string
 *                 format: date
 *               assigned_to:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.put(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  validate(taskValidation.update),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status, priority, due_date, assigned_to } =
        req.body;

      // Validate assigned_to user exists if provided
      if (assigned_to) {
        const userCheck = await pool.query(
          "SELECT id FROM users WHERE id = $1",
          [assigned_to]
        );
        if (userCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Assigned user not found",
          });
        }
      }

      // Build update query dynamically
      let updateFields = [];
      let values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updateFields.push(`title = $${paramCount++}`);
        values.push(title);
      }

      if (description !== undefined) {
        updateFields.push(`description = $${paramCount++}`);
        values.push(description);
      }

      if (status !== undefined) {
        updateFields.push(`status = $${paramCount++}`);
        values.push(status);
      }

      if (priority !== undefined) {
        updateFields.push(`priority = $${paramCount++}`);
        values.push(priority);
      }

      if (due_date !== undefined) {
        updateFields.push(`due_date = $${paramCount++}`);
        values.push(due_date);
      }

      if (assigned_to !== undefined) {
        updateFields.push(`assigned_to = $${paramCount++}`);
        values.push(assigned_to);
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
        `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = $${paramCount} 
       RETURNING id, title, description, status, priority, due_date, updated_at`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task updated successfully",
        data: { task: result.rows[0] },
      });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  authenticateToken,
  requireOwnerOrAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Delete task (this will cascade to attachments)
      const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}/attachments:
 *   post:
 *     summary: Upload attachments to a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 3
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.post(
  "/:id/attachments",
  authenticateToken,
  requireOwnerOrAdmin,
  upload.array("files", 3),
  async (req, res) => {
    try {
      const { id } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Check current attachment count
      const currentAttachments = await pool.query(
        "SELECT COUNT(*) FROM task_attachments WHERE task_id = $1",
        [id]
      );
      const currentCount = parseInt(currentAttachments.rows[0].count);

      if (currentCount + files.length > 3) {
        return res.status(400).json({
          success: false,
          message: "Maximum 3 attachments allowed per task",
        });
      }

      const uploadedFiles = [];

      for (const file of files) {
        const result = await pool.query(
          `INSERT INTO task_attachments (task_id, filename, original_name, mime_type, size, file_path)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, filename, original_name, mime_type, size, created_at`,
          [
            id,
            file.filename,
            file.originalname,
            file.mimetype,
            file.size,
            file.path,
          ]
        );

        uploadedFiles.push(result.rows[0]);
      }

      res.json({
        success: true,
        message: "Files uploaded successfully",
        data: { attachments: uploadedFiles },
      });
    } catch (error) {
      console.error("Upload attachments error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}/attachments/{filename}:
 *   get:
 *     summary: Download a task attachment
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Attachment filename
 *     responses:
 *       200:
 *         description: File download
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get(
  "/:id/attachments/:filename",
  authenticateToken,
  requireOwnerOrAdmin,
  async (req, res) => {
    try {
      const { id, filename } = req.params;

      const result = await pool.query(
        "SELECT * FROM task_attachments WHERE task_id = $1 AND filename = $2",
        [id, filename]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      const attachment = result.rows[0];
      const filePath = path.resolve(attachment.file_path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "File not found on disk",
        });
      }

      res.setHeader("Content-Type", attachment.mime_type);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${attachment.original_name}"`
      );
      res.sendFile(filePath);
    } catch (error) {
      console.error("Download attachment error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
