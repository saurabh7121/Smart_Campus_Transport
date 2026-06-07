# 🚍 CampusRide Backend API

Production-ready Node.js + Express backend for the CampusRide college transportation management system.

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Edit .env with your MongoDB URI and other config

# Seed database (creates admin + sample data)
npm run seed

# Start development server
npm run dev
```

### Default Admin Credentials
```
Email: admin@campusride.com
Password: admin123
```

## API Endpoints (Phase 1)

### Auth (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register/student` | Student registration (PRN verified) | No |
| POST | `/register/parent` | Parent registration | No |
| POST | `/register/driver` | Driver registration | No |
| POST | `/login` | Login (all roles) | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/logout` | Logout | Yes |
| POST | `/change-password` | Change password | Yes |
| GET | `/me` | Get current user | Yes |
| PATCH | `/fcm-token` | Update FCM token | Yes |

### Users (`/api/v1/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get role-based profile | Yes |
| PATCH | `/profile` | Update basic info | Yes |
| PATCH | `/student-profile` | Update student details | Yes (Student) |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/approved-students` | Add PRNs (bulk) | Admin |
| GET | `/approved-students` | List approved PRNs | Admin |
| GET | `/students` | List all students | Admin |
| PATCH | `/students/:id/approve` | Approve student | Admin |
| PATCH | `/students/:id/block` | Block student | Admin |
| GET | `/dashboard/stats` | Dashboard stats | Admin |

### Health Check
```
GET /api/v1/health
```

## Architecture

```
src/
├── config/          # DB, Firebase, Cloudinary, Razorpay, Socket.IO
├── constants/       # Roles, status enums, app constants
├── controllers/     # Route handlers (auth, user, admin)
├── middlewares/      # Auth, RBAC, validation, error handling, rate limit
├── models/          # 20 MongoDB schemas
├── routes/          # Express route definitions
├── seeds/           # Database seeding scripts
├── services/        # Business logic (auth, audit, notification)
├── sockets/         # Socket.IO event handlers
├── utils/           # ApiError, ApiResponse, asyncHandler, helpers, logger
├── validations/     # Joi validation schemas
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## Database Models (20 Collections)

| # | Model | Description |
|---|-------|-------------|
| 1 | User | Base auth (email, password, role) |
| 2 | ApprovedStudent | PRN whitelist for verification |
| 3 | Student | Student profile + transport assignment |
| 4 | Parent | Parent with student linking |
| 5 | Driver | Driver with license + bus assignment |
| 6 | Admin | Admin with granular permissions |
| 7 | Bus | Fleet with capacity + seat layout |
| 8 | Route | Routes with ordered stops + pricing |
| 9 | BusStop | Stops with GeoJSON coordinates |
| 10 | Seat | Individual seats per bus |
| 11 | SeatAllocation | Seat-to-student mapping |
| 12 | Booking | Transport bookings |
| 13 | WaitingList | Queue for full buses |
| 14 | Payment | Razorpay transactions |
| 15 | BusPass | Digital QR passes |
| 16 | Notification | Push notification records |
| 17 | LiveLocation | GPS data (TTL: 24h) |
| 18 | Trip | Morning/evening trip tracking |
| 19 | LostAndFound | Lost item reports |
| 20 | AuditLog | Action tracking |
