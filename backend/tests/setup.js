// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.DATABASE_URL =
  "postgresql://postgres:postgres123@localhost:5432/task_management_test";
process.env.UPLOAD_PATH = "./test-uploads";

// Increase timeout for database operations
jest.setTimeout(30000);
