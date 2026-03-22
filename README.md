# College Attendance Management System

A full-stack web application for managing college attendance with role-based access for Students, Teachers, and Admins.

## Live Demo

> Run locally following the setup instructions below.

## Screenshots

### Login Page
<img width="458" height="537" alt="image" src="https://github.com/user-attachments/assets/9c7f720a-5257-43f9-beb2-7bb90131d535" />


### Teacher Dashboard
<img width="625" height="720" alt="image" src="https://github.com/user-attachments/assets/3edda600-e290-43cc-a9aa-261965a9546c" />

### Bulk Attendance
<img width="632" height="596" alt="image" src="https://github.com/user-attachments/assets/0b98bf19-0dc4-4512-8999-97f1ff7dc9a5" />


### Student Dashboard
<img width="703" height="449" alt="image" src="https://github.com/user-attachments/assets/4bff4a5d-a59d-498f-a78e-2ed70e8cc6df" />


### Admin Dashboard
<img width="825" height="628" alt="image" src="https://github.com/user-attachments/assets/d2a11e8d-16a6-4bf4-bd9f-d2cc014d0012" />


### Leave Management
<img width="600" height="629" alt="image" src="https://github.com/user-attachments/assets/17b6005e-0709-4ba0-879c-a1d46fe36cc3" />
<img width="610" height="581" alt="image" src="https://github.com/user-attachments/assets/c6e21d47-d23d-466d-8479-bb7de9251bd4" />


## Features
Report management
<img width="704" height="573" alt="image" src="https://github.com/user-attachments/assets/44a6ea7f-e882-4f42-835e-a8a720cce612" />


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

**Shivam Wagh**
- GitHub: [@Divyawagh78](https://github.com/Divyawagh78)
- LinkedIn: [your-linkedin-url]

## License

MIT License
```

---

Now take screenshots of each page and save them in a folder called `screenshots` inside the project root. The README references them so they'll show up on GitHub automatically.

Then push the README:
```
git add README.md
git commit -m "Add README with project documentation"
git push
