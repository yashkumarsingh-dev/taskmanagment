const Joi = require("joi");

const userValidation = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    role: Joi.string().valid("user", "admin").default("user"),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  update: Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid("user", "admin").optional(),
  }),
};

const taskValidation = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.min": "Title must not be empty",
      "string.max": "Title must not exceed 255 characters",
      "any.required": "Title is required",
    }),
    description: Joi.string().optional().allow(""),
    status: Joi.string()
      .valid("pending", "in_progress", "completed")
      .default("pending"),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    due_date: Joi.date().iso().optional().messages({
      "date.format": "Due date must be a valid date in ISO format",
    }),
    assigned_to: Joi.string().uuid().optional().messages({
      "string.guid": "Assigned user ID must be a valid UUID",
    }),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().optional().allow(""),
    status: Joi.string()
      .valid("pending", "in_progress", "completed")
      .optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    due_date: Joi.date().iso().optional().messages({
      "date.format": "Due date must be a valid date in ISO format",
    }),
    assigned_to: Joi.string().uuid().optional().messages({
      "string.guid": "Assigned user ID must be a valid UUID",
    }),
  }),

  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid("pending", "in_progress", "completed")
      .optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    sortBy: Joi.string()
      .valid("created_at", "due_date", "priority", "status")
      .default("created_at"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    search: Joi.string().optional(),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  userValidation,
  taskValidation,
  validate,
  validateQuery,
};
