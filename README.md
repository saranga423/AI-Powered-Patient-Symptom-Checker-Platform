# Full-Stack Web Application – Technical Assignment

A full-stack customer submission management system with JWT authentication, refresh tokens, role-based authorization, CRUD operations, filtering, search, validation, and responsive React UI.

## Tech Stack

- Frontend: React.js + Vite + React Router + Axios
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT access + refresh tokens
- Password hashing: bcryptjs
- Styling: Plain CSS

## Features

### Customer
- Register with email/password/confirmation
- Customer login
- JWT access and refresh tokens
- Protected application form
- Submit personal details
- Client and server validation

### Admin
- Separate admin login
- Protected admin dashboard
- Create admins from a protected endpoint
- Auto-generated admin password
- View submissions
- Search by first/last name
- Filter by gender
- Edit submissions
- Delete submissions
- Audit fields for creator/modifier and dates

## Project Structure

```text
full-stack-assignment/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection

## Backend Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

The server seeds the initial admin on startup if it does not already exist.

## Frontend Setup

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/customer/register`
- `POST /api/auth/customer/login`
- `POST /api/auth/admin/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Admin

- `POST /api/admin/create`
- `GET /api/submissions`
- `GET /api/submissions/:id`
- `PUT /api/submissions/:id`
- `DELETE /api/submissions/:id`

### Customer

- `POST /api/submissions`

## Example Admin Login

Use the seeded credentials from `.env`.

The admin creation endpoint requires an authenticated ADMIN token. For the assignment's protected admin creation requirement, the seeded admin is the initial privileged account.

## Validation

Server-side validation checks:
- Required names/address
- Valid email
- Unique submission email
- Password minimum length of 4
- Password confirmation
- Gender enum
- Sri Lankan/local-style mobile number validation
- Duplicate user email prevention

## HTTP Status Codes

- `200` Success
- `201` Created
- `400` Validation/bad request
- `401` Authentication failure
- `403` Authorization failure
- `404` Resource not found
- `409` Duplicate resource
- `500` Server error

## Notes

Refresh tokens are stored hashed in the database. Access tokens are short-lived JWTs. The frontend automatically attempts a refresh after a `401` response and retries the original request.

For production deployment, use HTTPS, secure/httpOnly refresh-token cookies, stronger secret management, rate limiting, logging, and additional operational hardening.
