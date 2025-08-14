# Task Management System

A full-stack web application for managing tasks with user authentication, file uploads, and real-time updates.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 👥 **User Management**: CRUD operations for users with admin privileges
- 📋 **Task Management**: Create, read, update, and delete tasks with assignment capabilities
- 📎 **File Attachments**: Upload up to 3 PDF documents per task
- 🔍 **Advanced Filtering**: Filter and sort tasks by status, priority, and due date
- 📱 **Responsive Design**: Modern UI built with TailwindCSS
- 🐳 **Dockerized**: Complete containerization for easy deployment
- 🧪 **Comprehensive Testing**: Unit and integration tests with 80%+ coverage
- 📚 **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

### Frontend

- React 18
- Redux Toolkit (State Management)
- React Router (Navigation)
- TailwindCSS (Styling)
- Axios (HTTP Client)
- React Hook Form (Form Management)

### Backend

- Node.js
- Express.js
- PostgreSQL (Database)
- JWT (Authentication)
- Multer (File Uploads)
- Bcrypt (Password Hashing)
- Joi (Validation)

### DevOps & Testing

- Docker & Docker Compose
- Jest (Testing)
- Swagger (API Documentation)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd task-management
```

2. Start the application:

```bash
docker-compose up --build
```

3. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Local Development

1. Install dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. Set up environment variables:

```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Edit the .env file with your configuration
```

3. Start the development servers:

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

## API Documentation

The API documentation is available at `http://localhost:5000/api-docs` when the backend is running.

### Key Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Users

- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Tasks

- `GET /api/tasks` - Get tasks (with filtering/sorting)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/attachments` - Upload task attachments
- `GET /api/tasks/:id/attachments/:filename` - Download attachment

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'user', 'admin')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Tasks Table

- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `status` (Enum: 'pending', 'in_progress', 'completed')
- `priority` (Enum: 'low', 'medium', 'high')
- `due_date` (Date)
- `assigned_to` (UUID, Foreign Key to Users)
- `created_by` (UUID, Foreign Key to Users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Task Attachments Table

- `id` (UUID, Primary Key)
- `task_id` (UUID, Foreign Key to Tasks)
- `filename` (String)
- `original_name` (String)
- `mime_type` (String)
- `size` (Integer)
- `file_path` (String)
- `created_at` (Timestamp)

## Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests with coverage
npm run test:coverage
```

## Project Structure

```
task-management/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store configuration
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── Dockerfile
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app setup
│   ├── tests/              # Test files
│   ├── uploads/            # File upload directory
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker Compose configuration
├── .gitignore
└── README.md
```

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
UPLOAD_PATH=./uploads
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
