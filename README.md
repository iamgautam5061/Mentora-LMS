# Mentora LMS

Mentora LMS is a full-stack Learning Management System built with a React frontend and a Node.js/Express backend. It supports role-based access (student, teacher, admin), structured academic hierarchy management, and secure video hosting using AWS S3 and CloudFront.

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- AWS S3
- AWS CloudFront

### Frontend
- React
- Vite
- React Router
- Axios

---

## Features

- User registration and login  
- Role-based access control (Admin, Teacher, Student)  
- University management  
- Course management  
- Subject management (Year and Semester support)  
- Video upload to AWS S3  
- Secure video streaming using CloudFront signed URLs  
- Separate dashboards for each role  

---

## Database Schema (Prisma)

### Enum

Role:
- student
- teacher
- admin

### Models

#### User
- id (UUID)  
- name  
- email (unique)  
- password (hashed)  
- role  
- createdAt  

#### University
- id  
- name (unique)  

#### Course
- id  
- name  
- universityId (relation)  

#### Subject
- id  
- name  
- year  
- semester  
- courseId (relation)  

#### Video
- id  
- title  
- s3Key  
- userId (relation)  
- subjectId (relation)  
- createdAt  

---

## Project Structure

Mentora-LMS/
│
├── backend/
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── migrations/
│ ├── routes/
│ │ ├── auth.js
│ │ ├── categories.js
│ │ └── videos.js
│ ├── utils/
│ │ ├── cloudfront.js
│ │ └── s3.js
│ ├── keys/
│ │ └── private_key.pem
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── DashboardLayout.jsx
│ │ │ └── Sidebar.jsx
│ │ ├── pages/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── TeacherDashboard.jsx
│ │ │ ├── StudentDashboard.jsx
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
└── README.md


---

## Backend Setup

1. Navigate to backend directory:
cd backend

2. Install dependencies:
npm install

3. Create a `.env` file:
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

CLOUDFRONT_KEY_PAIR_ID=your_key_pair_id
CLOUDFRONT_PRIVATE_KEY_PATH=path_to_private_key
CLOUDFRONT_DISTRIBUTION_DOMAIN=your_distribution_domain

4. Run Prisma migrations:
npx prisma migrate dev

5. Start the server:
node server.js

---

## Frontend Setup

1. Navigate to frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Start development server:
npm run dev

4. Open the URL provided by Vite in your browser.
---
## API Routes

### Authentication
- POST `/auth/register`
- POST `/auth/login`
  
### Categories
- Create and manage Universities  
- Create and manage Courses  
- Create and manage Subjects
   
### Videos
- Upload video  
- Fetch videos by subject  
- Generate signed CloudFront URLs
  
---

## Authentication & Authorization
- Passwords are hashed using bcrypt.  
- JWT tokens are generated on login.  
- Protected routes use `authMiddleware`.  
- Role-based access restricts admin and teacher functionality.
  
---

## Requirements
- Node.js  
- PostgreSQL  
- AWS S3 bucket  
- AWS CloudFront distribution
  
---

Mentora LMS provides a structured system for managing academic content and securely delivering educational videos using a modern full-stack architecture.
