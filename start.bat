@echo off
echo 🚀 Starting Task Management System...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 📦 Building and starting containers...
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo ✅ Application is starting up!
echo.
echo 🌐 Access the application at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    API Documentation: http://localhost:5000/api-docs
echo.
echo 👤 Demo accounts:
echo    Admin: admin@example.com / admin123
echo    User: user@example.com / user123
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo.
pause
