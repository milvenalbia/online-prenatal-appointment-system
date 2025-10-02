# Prenatal Appointment System

![Prenatal Appointment System](https://i.imgur.com/MtujExq.jpeg)

A comprehensive web-based system for managing prenatal care, appointments, and patient records in maternal healthcare facilities.

## Overview

The Prenatal Appointment System streamlines the management of prenatal care by providing healthcare professionals with tools to track pregnancies, schedule appointments, maintain immunization records, and manage patient visits efficiently. The system supports multiple user roles to ensure appropriate access control and workflow management.

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Laravel (PHP Framework)
- **Database**: MySQL
- **Styling**: Tailwind CSS

## Features

### Dashboard
Centralized overview displaying key metrics, upcoming appointments, recent activities, and important notifications for healthcare providers and administrators.

### Appointment Management
Schedule, reschedule, and manage prenatal appointments with automated reminders and conflict detection to optimize clinic workflow.

### Pregnancy Tracking
Comprehensive monitoring of pregnancy progression including:
- Gestational age calculation
- Expected delivery date tracking
- Trimester-based milestones
- Medical history documentation
- Risk assessment

### Prenatal Visit Records
Detailed documentation of each prenatal visit including:
- Vital signs (blood pressure, weight, temperature)
- Fetal heart rate monitoring
- Fundal height measurements
- Laboratory results
- Clinical observations and recommendations

### Out-Patient Department (OPD)
Manage general outpatient consultations and services for expectant mothers, including walk-in visits and emergency consultations.

### Immunization Records
Track and manage maternal immunizations including:
- Tetanus toxoid (TT) vaccinations
- Other required prenatal immunizations
- Vaccination schedules and reminders
- Immunization history tracking

### Healthcare Provider Management

#### Doctors
Manage doctor profiles, specializations, schedules, and assigned patients.

#### Midwives
Coordinate midwife assignments, duties, and patient care responsibilities.

#### Nurses
Track nursing staff, shift schedules, and patient care activities.

### User Management
Comprehensive user administration with role-based access control, user creation, modification, and activity monitoring.

## User Roles

### Admin
Full system access with capabilities including:
- Complete user management (create, edit, delete users)
- System configuration and settings
- Access to all modules and reports
- Healthcare provider management
- System-wide analytics and reporting

### OPD Staff
Focused on outpatient operations with access to:
- Appointment scheduling and management
- Patient registration and check-in
- Basic patient information management
- OPD-specific reporting

### Midwife
Clinical care access including:
- Pregnancy tracking and monitoring
- Prenatal visit documentation
- Immunization record management
- Patient care coordination
- Appointment viewing and updates
- Clinical reporting

## Installation

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 18.x
- npm or yarn
- MySQL >= 8.0

### Backend Setup (Laravel)

```bash
# Clone the repository
git clone <repository-url>
cd prenatal-appointment-system

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prenatal_system
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run database migrations
php artisan migrate

# Seed the database (optional)
php artisan db:seed

# Start the development server
php artisan serve
```

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

### Database Configuration
Update the `.env` file with your MySQL credentials and ensure the database exists before running migrations.

### Environment Variables
Key environment variables to configure:
- `APP_URL`: Your application URL
- `DB_*`: Database connection settings
- `MAIL_*`: Email configuration for notifications
- `VITE_API_URL`: Backend API URL for frontend

## Usage

1. Access the application at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend API)
2. Login with your assigned credentials
3. Navigate through the dashboard to access various modules based on your role
4. Refer to the user manual for detailed feature-specific instructions

## API Documentation

API documentation is available at `/api/documentation` when running in development mode. The API follows RESTful conventions and returns JSON responses.

## Security

- All passwords are hashed using bcrypt
- Role-based access control (RBAC) implemented
- CSRF protection enabled
- API authentication using Laravel Sanctum
- Input validation and sanitization
- SQL injection prevention through Eloquent ORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Acknowledgments

Developed to improve maternal healthcare delivery and enhance prenatal care management efficiency.
