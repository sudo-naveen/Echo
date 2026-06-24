# Echo - Community-Driven Interview Preparation Q&A Platform

A full-stack web application where students and job seekers can ask interview-related questions, share answers, and prepare for interviews at top companies.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend:** Node.js, Express.js, SQLite, JWT Authentication, bcrypt
- **Deployment:** Vercel (frontend), Railway (backend)

## Project Structure

```
echo/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components (8)
│   │   ├── pages/        # Page components (8)
│   │   ├── services/     # API client services
│   │   ├── context/      # Auth context provider
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper utilities
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── controllers/ # Route handlers (5)
│   ├── routes/      # Express route definitions (5)
│   ├── middleware/   # Auth, validation, error handling (3)
│   ├── models/      # Database query methods (4)
│   ├── database/    # Schema & seed scripts
│   ├── config/      # Database configuration
│   ├── utils/       # Token generation
│   └── package.json
└── README.md
```

## Features

- User registration & login with JWT authentication
- Ask, edit, and delete interview questions
- Post, edit, and delete answers
- Upvote/downvote answers with real-time count updates
- Search questions by keywords, company, or tags
- Filter questions by company (20 companies), tags, and category
- Verified, Community Verified, and User Submitted status badges
- Company-wise interview questions section
- View trending questions by popularity
- Bookmark questions for later reference
- User profile with questions, answers, and bookmarks tabs
- Responsive mobile-first design with skeleton loaders
- Pagination with page number navigation
- Loading, error, and empty state handling

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- npm

### 1. Clone and Install

```bash
git clone <repo-url>
cd echo

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Backend - server/.env
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Initialize Database

```bash
cd server
npm run seed
```

This creates the SQLite database with **86 interview questions** across **20 companies**, **5 users**, answers, and votes.

### 4. Start Development Servers

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 - Frontend (http://localhost:3000)
cd client
npm run dev
```

### 5. Demo Accounts

All seed users have password: `password123`

- sarah@example.com (sarah_dev)
- mike@example.com (mike_codes)
- priya@example.com (priya_engineer)
- alex@example.com (alex_tech)
- jordan@example.com (jordan_dev)

## Company Interview Questions

The platform includes company-specific interview questions for:

| Product-Based | Service-Based |
|---|---|
| Google, Microsoft, Amazon, Meta, Apple | Accenture, TCS, Infosys |
| Netflix, Adobe, Oracle, Salesforce | Wipro, Cognizant |
| IBM, Intel, NVIDIA, Cisco | Zoho, Freshworks |

Questions cover: **Technical, System Design, Behavioral/HR, and Domain-specific topics.**

## API Endpoints

### Authentication

| Method | Endpoint              | Description      | Auth |
|--------|-----------------------|------------------|------|
| POST   | /api/auth/register    | Register user    | No   |
| POST   | /api/auth/login       | Login user       | No   |

### Questions

| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| GET    | /api/questions              | List questions        | No   |
| GET    | /api/questions/trending     | Trending questions    | No   |
| GET    | /api/questions/tags         | All tags with counts  | No   |
| GET    | /api/questions/companies    | Companies with counts | No   |
| GET    | /api/questions/company/:name | Questions by company  | No   |
| GET    | /api/questions/:id          | Question details      | No   |
| POST   | /api/questions              | Create question       | Yes  |
| PUT    | /api/questions/:id          | Update question       | Yes  |
| DELETE | /api/questions/:id          | Delete question       | Yes  |

Query params for GET /api/questions: `search`, `tag`, `company`, `page`, `limit`

### Answers

| Method | Endpoint           | Description     | Auth |
|--------|--------------------|-----------------|------|
| POST   | /api/answers       | Add answer      | Yes  |
| PUT    | /api/answers/:id   | Update answer   | Yes  |
| DELETE | /api/answers/:id   | Delete answer   | Yes  |

### Votes

| Method | Endpoint     | Description       | Auth |
|--------|--------------|-------------------|------|
| POST   | /api/votes   | Upvote/downvote   | Yes  |

Body: `{ "answer_id": number, "vote_type": "upvote" | "downvote" }`

### Users

| Method | Endpoint               | Description               | Auth |
|--------|------------------------|---------------------------|------|
| GET    | /api/users/profile     | Get profile + activity    | Yes  |
| GET    | /api/users/bookmarks   | Get bookmarks             | Yes  |
| POST   | /api/users/bookmarks   | Toggle bookmark           | Yes  |

## Deployment

### Backend (Railway)

1. Create a Railway project linked to your GitHub repo
2. Set root directory to `server/`
3. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=<strong-random-string>`
   - `NODE_ENV=production`
4. Deploy (Railway will use `server/railway.json`)

### Frontend (Vercel)

1. Import your GitHub repo in Vercel
2. Set root directory to `client/`
3. Add environment variable:
   - `VITE_API_URL=https://your-railway-app.railway.app/api`
4. Deploy (Vercel will use `client/vercel.json`)

