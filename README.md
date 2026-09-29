# Student Management System

A professional full-stack **Student Management System** built with the **MERN Stack**.  
The application provides secure authentication, student management, profile photo upload, dashboard analytics, course insights, reports, Excel/PDF export, search, sorting, pagination, and light/dark theme support.

---

## 📌 Project Overview

The Student Management System is designed to manage student records through a modern and responsive web application.

### Main Technologies

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Image Storage:** Cloudinary
- **File Upload:** Multer
- **HTTP Client:** Axios
- **Charts:** Chart.js
- **Excel Export:** SheetJS (`xlsx`)
- **PDF Export:** jsPDF + AutoTable
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Routing:** React Router DOM

---

# ✨ Features

## 🔐 Authentication & Security

- User registration
- Email OTP verification
- Resend OTP
- Secure login
- JWT-based authentication
- Protected routes
- Password hashing using bcrypt
- Forgot password
- Password reset using OTP
- Show/hide password
- Authentication state management
- Logout functionality

## 👨‍🎓 Student Management

- Add new student
- View all students
- View individual student
- Edit student details
- Delete student
- Delete confirmation modal
- Student profile photo upload
- Profile photo preview
- Profile photo removal before submission
- Cloudinary image storage
- Automatic deletion of old profile photos when replaced
- Automatic Cloudinary cleanup when a student is deleted

### Student Information

- Student ID
- Name
- Email
- Age
- Course
- Phone Number
- Address
- Profile Photo
- Created Date

## 🔎 Search, Sort & Pagination

- Search students by:
  - Name
  - Email
  - Course
  - Phone
  - Address
- Search from the global top navigation
- Sort students by name
- Ascending A-Z sorting
- Descending Z-A sorting
- Pagination
- URL-based search support

## 📊 Dashboard

The dashboard provides a quick overview of the student system.

### Dashboard Statistics

- Total Students
- Total Courses
- Recently Added Students

### Analytics

- Student/course analytics
- Dashboard charts
- Recent student activity
- Summary cards

## 📚 Courses

The Courses page provides course-level insights.

- Total number of courses
- Students per course
- Course distribution
- Course search
- Student list for each course
- Student profile avatars

## 📑 Reports

The Reports page provides reporting and export functionality.

### Report Statistics

- Total Students
- Total Courses
- Average Student Age
- Latest Added Student
- Course-wise student summary

### Excel Export

Exports student information and summary data into an `.xlsx` file.

### PDF Export

Generates a professional PDF report containing:

- Report title
- Generation date
- Student statistics
- Course summary
- Student details

## 🎨 UI & User Experience

- Professional responsive design
- Dark mode
- Light mode
- Glassmorphism-style cards
- Responsive navigation
- Sidebar navigation
- Top navigation bar
- User profile dropdown
- Loading states
- Toast notifications
- Form validation
- Mobile-friendly layouts

---

# 🏗️ Project Architecture

```text
student-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopNavbar.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ResetPassword.jsx
│   │   │   │   └── VerifyOTP.jsx
│   │   │   │
│   │   │   └── students/
│   │   │       ├── StudentList.jsx
│   │   │       ├── AddStudent.jsx
│   │   │       └── EditStudent.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── studentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Student.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Requirements

Before running the project, install:

- **Node.js** 18+ recommended
- **npm**
- **MongoDB** or MongoDB Atlas account
- **Cloudinary** account
- Git

Check Node.js and npm:

```bash
node --version
npm --version
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
```

Move into the project:

```bash
cd student-management-system
```

---

# 2. Backend Setup

Open a terminal and run:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```text
server/.env
```

Add the following variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Email account used for OTP emails |
| `EMAIL_PASS` | Email app password |

> **Important:** Never upload the real `.env` file to GitHub. It contains private credentials.

---

# 3. Start the Backend

From the `server` directory:

```bash
npm start
```

If your server package provides a development script, you can use:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

---

# 4. Frontend Setup

Open another terminal.

From the project root:

```bash
cd client
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend should normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Running the Complete Project

You need two terminals.

### Terminal 1 — Backend

```bash
cd student-management-system/server
npm install
npm start
```

### Terminal 2 — Frontend

```bash
cd student-management-system/client
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔑 Authentication Flow

The authentication flow works as follows:

```text
Register
   ↓
Email OTP
   ↓
Verify OTP
   ↓
Account Activated
   ↓
Login
   ↓
JWT Token
   ↓
Protected Dashboard
```

### Forgot Password Flow

```text
Forgot Password
       ↓
Enter Email
       ↓
Receive OTP
       ↓
Verify OTP
       ↓
Set New Password
       ↓
Login
```

---

# 👨‍🎓 Student Management Flow

```text
Dashboard
    │
    ├── Students
    │     ├── View Students
    │     ├── Search
    │     ├── Sort
    │     ├── Pagination
    │     ├── Add Student
    │     ├── Edit Student
    │     └── Delete Student
    │
    ├── Courses
    │
    ├── Reports
    │     ├── Excel Export
    │     └── PDF Export
    │
    └── Settings
```

---

# 🔌 REST API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/verify-otp` | Verify registration OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/verify-reset-otp` | Verify reset OTP |
| POST | `/api/auth/reset-password` | Reset password |

## Student APIs

All student APIs require JWT authentication where applicable.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Student Create/Update

Student data includes:

```text
name
email
age
course
phone
address
profilePhoto
```

Profile photos are sent using `multipart/form-data`.

---

# 🗄️ Database Structure

## User Collection

Used for authentication and account management.

Typical information includes:

```text
name
email
password
verification status
OTP information
password reset information
timestamps
```

## Student Collection

```text
_id
name
email
age
course
phone
address
profilePhoto
createdAt
updatedAt
```

### Profile Photo Structure

```json
{
  "profilePhoto": {
    "url": "Cloudinary image URL",
    "publicId": "Cloudinary public ID"
  }
}
```

---

# ☁️ Cloudinary Integration

Student profile images are uploaded using:

```text
React
   ↓
FormData
   ↓
Multer
   ↓
Express
   ↓
Cloudinary
   ↓
MongoDB
```

Images are stored in the Cloudinary folder:

```text
student-management/students
```

The database stores:

- Cloudinary secure URL
- Cloudinary public ID

This allows the application to remove old images when a profile photo is replaced or a student is deleted.

---

# 🛡️ Validation

The application validates student information before saving.

### Student Validation

- Name is required
- Email is required
- Valid email format
- Age is required
- Age must be greater than 16
- Course is required
- Phone number is required
- Address is required
- Duplicate student email is prevented

### Profile Photo Validation

Allowed formats:

```text
JPG
JPEG
PNG
WEBP
```

Maximum file size:

```text
5 MB
```

---

# 🎨 Theme System

The application supports:

- Dark Mode
- Light Mode

The selected theme is applied across the application including:

- Dashboard
- Students
- Courses
- Reports
- Settings
- Authentication pages
- Navigation
- Tables
- Forms
- Modals

---

# 📤 Export Features

## Excel

The Excel report contains:

### Students Sheet

```text
S.No
Student ID
Name
Email
Age
Course
Phone
Address
Created At
```

### Summary Sheet

```text
Total Students
Total Courses
Average Age
Course-wise Student Count
```

Generated file format:

```text
student-report-YYYY-MM-DD.xlsx
```

## PDF

The PDF report includes:

- Student Management System title
- Student Report
- Generated date
- Student statistics
- Course summary
- Student details

Generated file format:

```text
student-report-YYYY-MM-DD.pdf
```

---

# 📊 Dashboard Analytics

The dashboard provides an overview of the student database.

Key metrics include:

```text
Total Students
Total Courses
Recently Added Students
```

Charts provide visual insights into student/course data.

---

# 🧪 Testing Checklist

After starting the project, verify the following:

### Authentication

- [ ] Register a new account
- [ ] Receive OTP
- [ ] Verify OTP
- [ ] Login
- [ ] Logout
- [ ] Forgot password
- [ ] Reset password

### Students

- [ ] Add student
- [ ] Upload profile photo
- [ ] View student list
- [ ] Search student
- [ ] Sort students
- [ ] Navigate pagination
- [ ] Edit student
- [ ] Replace profile photo
- [ ] Delete student
- [ ] Confirm delete modal

### Dashboard

- [ ] Total Students
- [ ] Total Courses
- [ ] Recently Added Students
- [ ] Charts

### Courses

- [ ] Course list
- [ ] Course search
- [ ] Student count per course

### Reports

- [ ] Export Excel
- [ ] Export PDF
- [ ] Check exported data

### UI

- [ ] Dark mode
- [ ] Light mode
- [ ] Responsive desktop layout
- [ ] Responsive mobile layout
- [ ] Loading states
- [ ] Toast notifications

---

# 🔐 GitHub Security

The following files should **never** be committed:

```text
.env
.env.*
node_modules/
dist/
build/
```

The root `.gitignore` should contain at least:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
client/dist/
*.log
.DS_Store
.vscode/
.idea/
coverage/
```

Before pushing:

```bash
git status
```

Make sure your real `.env` file and secrets are not listed.

---

# 📝 Environment Example

For other developers, create:

```text
server/.env.example
```

with placeholder values only:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Do **not** put real credentials in `.env.example`.

---

# 🧰 Useful Commands

## Backend

```bash
cd server
npm install
npm start
```

Development mode, if configured:

```bash
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

## Git

Check status:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update Student Management System"
```

Push:

```bash
git push
```

---

# 📦 Production Build

To create a frontend production build:

```bash
cd client
npm run build
```

The production files will be generated in:

```text
client/dist
```

To preview the production build locally:

```bash
npm run preview
```

---

# 👨‍💻 Development Notes

The application follows a separation between frontend and backend.

### Frontend

Responsible for:

- UI
- Routing
- Forms
- Authentication state
- API requests
- Theme management
- Search/sort/pagination
- Reports and exports

### Backend

Responsible for:

- REST APIs
- Authentication
- JWT verification
- Password hashing
- Student CRUD operations
- Validation
- File upload handling
- Cloudinary integration
- MongoDB operations
- Error handling

---

# 📈 Future Improvements

Possible future enhancements:

- Role-based Admin/User permissions
- Advanced student filters
- Attendance management
- Student marks/grades
- Course management CRUD
- Email notifications
- Advanced analytics
- More dashboard visualizations
- Deployment with production environment variables
- Automated testing
- Docker support

---

# 📄 Assignment Coverage

The project covers the major Student Management System requirements including:

- Dashboard
- Student listing
- Search
- Sorting
- Pagination
- Add student
- Edit student
- Delete student
- Validation
- REST APIs
- MongoDB
- Registration
- Login
- JWT authentication
- Protected routes
- Dark/light mode
- Loading states
- Toast notifications
- Student profile photo upload
- Excel export
- PDF export
- Dashboard charts

---

# 🌐 Project Links

### GitHub

```text
https://github.com/YOUR_USERNAME/student-management-system
```

### Frontend

```text
Add deployed frontend URL here
```

### Backend API

```text
Add deployed backend URL here
```

---

# 👤 Author

**Biswa Ranjan Behera**

Software & Data Professional | SQL | Databricks | MERN Stack

### GitHub

https://github.com/biswaranjanbehera006

### LinkedIn

https://www.linkedin.com/in/biswa-ranjan-behera

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📌 Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/student-management-system.git

# Backend
cd student-management-system/server
npm install

# Create server/.env and add required credentials

npm start

# Open another terminal
cd ../client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

**Built with React, Node.js, Express, MongoDB, Cloudinary and modern web technologies.**
