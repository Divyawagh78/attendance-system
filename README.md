# College Attendance Management System

A full-stack web application for managing college attendance with role-based access for Students, Teachers, and Admins.

## Live Demo

> Run locally following the setup instructions below.

## Screenshots

### Login Page
<img width="1600" height="665" alt="image" src="https://github.com/user-attachments/assets/123934db-3796-455c-9f72-08240674a4a6" />



### Teacher Dashboard
<img width="1600" height="784" alt="image" src="https://github.com/user-attachments/assets/0c4c2072-ae0e-4f85-8a55-c5fed482a9e0" />
 />

### Bulk Attendance
<img width="1600" height="791" alt="image" src="https://github.com/user-attachments/assets/553be87c-a210-49de-bb24-54cc0eb8c46b" />
 />


### Student Dashboard
<img width="1600" height="788" alt="image" src="https://github.com/user-attachments/assets/185e1d59-fec0-4aca-8185-7312cc9d4f0c" />
 />


### Admin Dashboard
<img width="1600" height="797" alt="image" src="https://github.com/user-attachments/assets/d459ce8f-497a-45a4-ab92-0533b3aaf45f" />
 />


### Leave Management
<img width="1600" height="790" alt="image" src="https://github.com/user-attachments/assets/d3d81a65-f496-40cd-9dbe-6fda2952f162" />
 /><img width="1600" height="792" alt="image" src="https://github.com/user-attachments/assets/c30d3740-f028-47af-a7a7-8e3670441c75" />
 />


## Features
Report management
<img width="1600" height="773" alt="image" src="https://github.com/user-attachments/assets/cb3aa031-0eb6-4432-a04e-12b49709ad33" />
 />


### Student
- View attendance percentage per subject
- See present/absent count per subject
- Get alerted when attendance drops below 75%
- Apply for leave with reason
- Track leave application status (pending/approved/rejected)

### Teacher
- Create subjects
- Mark individual student attendance
- Bulk mark attendance for entire class in one click
- Check attendance percentage per student
- View detailed attendance report per subject
- Export attendance to CSV or Excel
- Manage student leave requests (approve/reject)

### Admin
- View total students, teachers, subjects at a glance
- See attendance overview for all students
- Identify at-risk students (below 75%)
- Manage leave requests

## Tech Stack

### Backend
- Python 3.13
- FastAPI
- SQLAlchemy ORM
- SQLite (development)
- JWT Authentication (python-jose)
- bcrypt password hashing

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- XLSX + file-saver (export to Excel/CSV)

## Project Structure
```
attendance-system/
├── backend/
│   └── app/
│       ├── models/
│       │   └── models.py        # SQLAlchemy models
│       ├── routers/
│       │   ├── auth_router.py   # Register, Login
│       │   ├── attendance_router.py
│       │   ├── subject_router.py
│       │   └── leave_router.py
│       ├── auth.py              # JWT + bcrypt
│       ├── database.py          # SQLite connection
│       ├── dependencies.py      # Auth middleware
│       ├── schemas.py           # Pydantic models
│       └── main.py
└── frontend/
    └── src/
        ├── components/
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── TeacherDashboard.jsx
        │   ├── StudentDashboard.jsx
        │   ├── BulkAttendance.jsx
        │   ├── AttendanceReport.jsx
        │   ├── AdminDashboard.jsx
        │   ├── LeaveRequest.jsx
        │   └── LeaveManagement.jsx
        └── services/
            └── api.js
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Divyawagh78/attendance-system.git
cd attendance-system

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] bcrypt python-multipart

# Start the backend server
cd backend
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

API docs available at `http://127.0.0.1:8000/docs`

### Frontend Setup
```bash
# Open a new terminal
cd attendance-system/frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /auth/register | Register user | Public |
| POST | /auth/login | Login | Public |
| GET | /subjects/ | Get all subjects | All |
| POST | /subjects/ | Create subject | Teacher |
| POST | /attendance/mark | Mark attendance | Teacher |
| POST | /attendance/bulk-mark | Bulk mark attendance | Teacher |
| GET | /attendance/students | Get all students | Teacher |
| GET | /attendance/student/{id} | Get student records | All |
| GET | /attendance/percentage/{sid}/{subid} | Get percentage | All |
| GET | /attendance/report/{subject_id} | Get full report | Teacher |
| GET | /attendance/admin/summary | Admin overview | Admin |
| POST | /leave/apply | Apply for leave | Student |
| GET | /leave/my-requests | My leave requests | Student |
| GET | /leave/pending | All leave requests | Teacher |
| PUT | /leave/action/{id} | Approve/Reject leave | Teacher |

## Roles

| Role | Access |
|------|--------|
| Student | Dashboard, attendance view, leave application |
| Teacher | Mark attendance, bulk attendance, reports, leave management |
| Admin | Full overview, all student summaries |

## Author

**Divya wagh**
- GitHub: [@Divyawagh78](https://github.com/Divyawagh78)
- LinkedIn: [your-linkedin-url]


