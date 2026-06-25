# 🤖 CareerCraft-AI

> AI-Powered Resume Intelligence & Personalized Interview Preparation Platform

CareerCraft-AI is a full-stack AI application that simulates an intelligent technical recruiter by analyzing resumes against job descriptions using Google's Gemini AI. It identifies skill gaps, evaluates compatibility scores, generates personalized learning roadmaps, creates interview preparation plans, and exports professional reports.

The project combines Artificial Intelligence, Resume Parsing, Authentication, File Processing, PDF Generation, and Protected Dashboards into a modern production-ready web application.

---

# 🌐 Live Demo

🚀 **Website**

https://careercraft-ai.yourdomain.com

# ✨ Key Features

## 🔐 Authentication

- Secure JWT Authentication
- HTTP-Only Cookie Sessions
- Protected Routes
- User Registration
- Login & Logout
- Session Validation
- Persistent Authentication

---

## 📄 Resume Processing

- Upload PDF Resume
- Upload DOCX Resume
- Maximum File Size Validation
- Resume Text Extraction
- AI Context Preparation
- Secure File Handling
- Automatic Cleanup

---

## 💼 Job Description Analysis

Users can either:

- Paste Job Description
- Upload Company Requirements
- Provide Role Description
- Compare Resume with Target Role

The system intelligently understands the relationship between the resume and job requirements before generating insights.

---

## 🤖 AI Resume Intelligence

Powered by **Google Gemini AI**

The application performs:

- Resume Understanding
- Job Requirement Analysis
- Skill Gap Detection
- Experience Matching
- ATS Compatibility Review
- Missing Technologies Detection
- Industry Keyword Matching
- Soft Skill Analysis
- Technical Skill Extraction
- Personalized Suggestions

---

## 📊 Match Score Generation

CareerCraft-AI automatically calculates:

- Overall Resume Match %
- Technical Skill Score
- Experience Score
- Missing Skills
- Recommended Skills
- ATS Readiness
- Resume Strength Index

---

## 🛣 Personalized Learning Roadmap

The application generates structured preparation plans divided into multiple stages.

### Technical Preparation

- Programming Concepts
- Frameworks
- System Design
- Databases
- APIs
- Cloud
- Security

### Behavioral Preparation

- STAR Method
- Leadership Questions
- Teamwork
- Conflict Resolution
- Communication

### Interview Timeline

- 7-Day Plan
- 15-Day Plan
- 30-Day Plan
- Custom Learning Path

---

## 🎯 Interview Preparation

AI dynamically generates:

- Technical Questions
- HR Questions
- Behavioral Questions
- Scenario Questions
- Company Specific Questions
- Coding Preparation Topics

---

## 📑 PDF Report Generation

Using Puppeteer the application exports:

- Resume Analysis
- Skill Gap Report
- Interview Questions
- Learning Roadmap
- Personalized Recommendations

All reports are generated as downloadable professional PDF documents.

---

# ⚙️ Project Architecture

```text
CareerCraft-AI
│
├── Backend
│   ├── config
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── analysisController.js
│   │   ├── reportController.js
│   │   └── interviewController.js
│   │
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── errorHandler.js
│   │   └── jwtVerifier.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Reports.js
│   │   └── BlacklistedToken.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── analysisRoutes.js
│   │   ├── reportRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── services
│   │   ├── GeminiService.js
│   │   ├── PDFGenerator.js
│   │   ├── ResumeParser.js
│   │   └── RoadmapGenerator.js
│   │
│   ├── utils
│   ├── uploads
│   └── server.js
│
└── Frontend
    ├── public
    └── src
        ├── assets
        ├── components
        ├── context
        ├── hooks
        ├── layouts
        ├── pages
        ├── routes
        ├── services
        ├── utils
        ├── App.jsx
        └── main.jsx
```

---

# 🔄 Application Workflow

```text
User Login
      │
      ▼
Protected Dashboard
      │
      ▼
Upload Resume
      │
      ▼
Provide Job Description
      │
      ▼
Resume Parsing
      │
      ▼
Gemini AI Analysis
      │
      ▼
Skill Gap Detection
      │
      ▼
Match Score Calculation
      │
      ▼
Interview Question Generation
      │
      ▼
Learning Roadmap
      │
      ▼
Generate PDF Report
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Context API
- Tailwind CSS

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cookie Parser

---

## Artificial Intelligence

- Google Gemini API
- Prompt Engineering
- Resume Context Processing

---

## PDF & File Handling

- Puppeteer
- PDF Parser
- DOCX Parser
- File Upload Middleware

---

## Database

MongoDB Atlas

Collections:

- Users
- Reports
- Tokens

---

# 🔑 Authentication Flow

```text
Register
    │
    ▼
Password Hashing
    │
    ▼
JWT Generation
    │
    ▼
HTTP-Only Cookie
    │
    ▼
Protected Routes
    │
    ▼
Dashboard Access
```

---

# 📡 REST API Overview

## Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## Resume

```
POST /api/resume/upload
POST /api/resume/analyze
```

---

## Interview

```
POST /api/interview/questions
POST /api/interview/roadmap
```

---

## Reports

```
GET /api/report/download
```

---

# 📈 Future Improvements

- AI Mock Interviews
- Voice Interview Simulation
- ATS Resume Builder
- Company-wise Question Bank
- LinkedIn Profile Analyzer
- Resume Version Comparison
- Multi-language Support
- AI Career Mentor
- Email Report Delivery
- Admin Analytics Dashboard

---

# 🧪 Testing

- Authentication Testing
- Protected Route Testing
- Resume Upload Validation
- PDF Export Testing
- API Testing
- Error Handling
- AI Response Validation

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
