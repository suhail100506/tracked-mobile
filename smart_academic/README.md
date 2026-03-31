# TrackEd - Smart Academic Activity & Attendance Analytics System

## 1. Project Overview
TrackEd is a full-stack academic management platform for institutes to manage users, attendance, marks, activities, analytics, and reports.

It supports three roles:
- Admin
- Faculty
- Student

### Core Features
- Role-based authentication and authorization with JWT
- User management (create/list/update/delete users)
- Attendance marking (bulk) and attendance shortage detection
- Marks upload and academic performance tracking
- Student activity submission and approval workflow
- Analytics dashboards (correlation, toppers, slow learners, risk, department summary)
- Report generation (Student PDF/Excel, Faculty summary, Department summary)
- Responsive frontend with chart visualizations and role-aware widgets

---

## 2. Tech Stack
- Backend: Django, Django REST Framework
- Auth: JWT via djangorestframework-simplejwt
- Database: MySQL
- Frontend: HTML, CSS, JavaScript
- Charts: Chart.js
- Reports: reportlab (PDF), openpyxl (Excel)

---

## 3. Step-by-Step Installation

### a) Clone repository
```bash
git clone <your-repo-url>
cd smart_academic
```

### b) Create virtual environment
Windows (PowerShell):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### c) Install dependencies
```bash
pip install -r requirements.txt
```

### d) Create MySQL database
```sql
CREATE DATABASE smart_academic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### e) Configure environment variables (.env)
Create/update .env in project root with:
```env
DEBUG=True
SECRET_KEY=your-strong-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=smart_academic_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://127.0.0.1:5500,http://localhost:5500

# Optional JWT env settings for future extension
JWT_ACCESS_MINUTES=60
JWT_REFRESH_DAYS=1
```

Note:
- Current JWT lifetimes are configured in smart_academic/settings.py.
- If needed, you can wire JWT_ACCESS_MINUTES and JWT_REFRESH_DAYS into settings.py.

### f) Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### g) Create superuser
```bash
python manage.py createsuperuser
```

### h) Run server
```bash
python manage.py runserver
```

Backend base URL:
- http://127.0.0.1:8000

---

## 4. API Endpoint Reference

Base path: /api

| Method | URL | Role | Description |
|---|---|---|---|
| POST | /api/auth/token/ | Public | Obtain JWT access/refresh token |
| POST | /api/auth/token/refresh/ | Public | Refresh access token |
| POST | /api/users/login/ | Public | Login and return JWT + user profile |
| POST | /api/users/logout/ | Authenticated | Logout (refresh token invalidation attempt) |
| GET | /api/users/ | Admin | List all users |
| POST | /api/users/create/ | Admin | Create user |
| GET | /api/users/{id}/ | Admin or Self | Retrieve user details |
| PUT/PATCH | /api/users/{id}/ | Admin or Self | Update user details |
| DELETE | /api/users/{id}/ | Admin or Self | Delete user |
| GET | /api/users/student/profile/ | Student | Get current student profile |
| POST | /api/attendance/mark/ | Admin/Faculty | Mark attendance in bulk |
| GET | /api/attendance/student/{student_id}/ | Admin/Faculty/Self Student | Attendance records by subject |
| GET | /api/attendance/percentage/{student_id}/ | Admin/Faculty/Self Student | Attendance percentage per subject |
| GET | /api/attendance/shortage/ | Admin/Faculty | Students below threshold (default 75%) |
| POST | /api/marks/upload/ | Admin/Faculty | Upload/update student marks |
| GET | /api/marks/student/{student_id}/ | Admin/Faculty/Self Student | Student marks by subject |
| GET | /api/marks/topper/ | Admin/Faculty | Top performer list |
| GET | /api/marks/average/ | Admin/Faculty | Subject-wise class average |
| POST | /api/activities/add/ | Student | Add activity |
| PUT | /api/activities/approve/{activity_id}/ | Admin/Faculty | Approve/reject activity and assign points |
| GET | /api/activities/student/{student_id}/ | Admin/Faculty/Self Student | Student activities |
| GET | /api/activities/pending/ | Admin/Faculty | Pending activity approvals |
| GET | /api/analytics/correlation/ | Admin/Faculty | Attendance vs marks data |
| GET | /api/analytics/top-performers/ | Admin/Faculty | Top 10 students |
| GET | /api/analytics/slow-learners/ | Admin/Faculty | Below-average students |
| GET | /api/analytics/at-risk/ | Admin/Faculty | Low attendance + low marks students |
| GET | /api/analytics/department-summary/ | Admin/Faculty | Department-level stats |
| GET | /api/reports/student/{student_id}/?format=pdf | Admin/Faculty/Self Student | Download student PDF report |
| GET | /api/reports/student/{student_id}/?format=excel | Admin/Faculty/Self Student | Download student Excel report |
| GET | /api/reports/faculty/{faculty_id}/ | Admin/Faculty | Faculty summary report |
| GET | /api/reports/department/ | Admin/Faculty | Department report |

---

## 5. Database Schema Diagram (ASCII)

```text
+-------------------+
| users_customuser  |
+-------------------+
| id (PK)           |
| username          |
| password          |
| role              |
| department        |
| phone             |
| created_at        |
+-------------------+

          1                     *
users_customuser ---------> attendance_subject
                            +-----------------------+
                            | id (PK)               |
                            | name                  |
                            | code (UNIQUE)         |
                            | faculty_id (FK user)  |
                            | department            |
                            +-----------------------+

          1                     *
users_customuser ---------> attendance_attendance <--------- attendance_subject
                            +-----------------------------------------------+
                            | id (PK)                                       |
                            | student_id (FK user)                          |
                            | subject_id (FK subject)                       |
                            | date                                           |
                            | status (present/absent/late)                  |
                            | marked_by_id (FK user)                        |
                            | created_at                                     |
                            | UNIQUE(student_id, subject_id, date)          |
                            +-----------------------------------------------+

          1                     *
users_customuser ---------> marks_marks <---------------- attendance_subject
                            +--------------------------------------------+
                            | id (PK)                                    |
                            | student_id (FK user)                       |
                            | subject_id (FK subject)                    |
                            | internal_marks                             |
                            | assignment_marks                           |
                            | lab_marks                                  |
                            | uploaded_by_id (FK user)                   |
                            | created_at                                 |
                            | UNIQUE(student_id, subject_id)             |
                            +--------------------------------------------+

          1                     *
users_customuser ---------> activities_activity
                            +---------------------------------------+
                            | id (PK)                               |
                            | student_id (FK user)                  |
                            | activity_type                         |
                            | title                                 |
                            | description                           |
                            | date_of_activity                      |
                            | points                                |
                            | status (pending/approved/rejected)    |
                            | approved_by_id (FK user, nullable)    |
                            | certificate (nullable)                |
                            | created_at                            |
                            +---------------------------------------+
```

---

## 6. Folder Structure

---

## 7. SQL Benchmark (MySQL or Supabase/Postgres)

TrackEd includes a built-in benchmark management command to measure common query latency.

### Run benchmark on current default DB
```bash
python manage.py sql_benchmark --iterations 20 --warmup 5
```

### Save benchmark output as JSON
```bash
python manage.py sql_benchmark --iterations 30 --output-json benchmark/default.json
```

### Benchmark a second DB alias (for example, Supabase/Postgres)
1. Add a second database alias in `smart_academic/settings.py` under `DATABASES` (e.g. `supabase`).
2. Run:
```bash
python manage.py sql_benchmark --database supabase --iterations 30 --output-json benchmark/supabase.json
```

### Compare results
- Lower `avg_ms` and `p95_ms` are better.
- Focus on slowest query first and add indexes before changing architecture.
- Compare under similar dataset size and same warmup/iteration counts.

```text
smart_academic/
├── manage.py
├── requirements.txt
├── .env
├── README.md
├── smart_academic/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── __init__.py
│   ├── users/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── attendance/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── marks/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── activities/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── analytics/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   └── reports/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── attendance.html
│   ├── marks.html
│   ├── activities.html
│   ├── analytics.html
│   ├── reports.html
│   ├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── dashboard.js
│       ├── attendance.js
│       ├── marks.js
│       ├── activities.js
│       ├── analytics.js
│       └── reports.js
└── static/
```

---

## 7. Run Frontend with Live Server

Because frontend pages are static HTML + JS:

1. Open project in VS Code.
2. Install Live Server extension (if not installed).
3. Right-click frontend/index.html and select Open with Live Server.
4. Frontend usually runs on:
   - http://127.0.0.1:5500/frontend/index.html
5. Ensure Django backend is running at:
   - http://127.0.0.1:8000

Important:
- CORS_ALLOWED_ORIGINS in .env should include your Live Server origin.
- JWT token is stored in localStorage by the frontend auth module.

---

## 8. Sample Login Credentials (Testing)

Create these users via Django admin or shell:

| Role | Username | Password |
|---|---|---|
| Admin | admin1 | Admin@12345 |
| Faculty | faculty1 | Faculty@12345 |
| Student | student1 | Student@12345 |

Recommended test setup:
- Assign all three users to a valid department.
- Create at least one Subject linked to faculty1.
- Add attendance and marks data for student1 to see analytics and reports.

---

## Quick Start Checklist
- Backend server running
- MySQL database created and credentials verified
- Migrations applied
- Superuser created
- Frontend opened with Live Server
- Login tested for all three roles
