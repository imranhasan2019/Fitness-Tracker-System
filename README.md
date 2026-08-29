#  Fitness Tracker System

Full-stack MERN web application for  personal fitness tracking system.

**Course:** CSE-323 Web Programming  
 Imran Hosen (23*-11*-***)

## Features

- User registration, login, logout (JWT authentication)
- User profile management
- Membership plan browsing and subscription
- Workout tracker with history (CRUD)
- BMI calculator
- Calorie Calculator
- Admin dashboard with statistics
- Member management (add, update, delete, search)
- Membership plan management

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcrypt |

## Project Structure

```
WP/
├── client/          # React frontend
├── server/          # Express API
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Backend

```bash
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | imran@gym.com | 1245678 |
| Member | imran@gym.com | 1245678 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET/PUT | `/api/users/profile` | Profile management |
| POST | `/api/users/bmi` | Calculate BMI |
| GET | `/api/memberships` | List active plans |
| POST | `/api/memberships/:id/subscribe` | Subscribe to plan |
| GET/POST | `/api/workouts` | Workout CRUD |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST/PUT/DELETE | `/api/admin/members` | Member management |
| GET/POST/PUT/DELETE | `/api/memberships/admin` | Plan management |

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- Set `VITE_API_URL` to your deployed backend URL
- Set `MONGODB_URI` and `JWT_SECRET` in backend environment variables
