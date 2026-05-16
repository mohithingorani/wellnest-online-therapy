# WELLNEST

A mental health platform connecting users with licensed therapists. WELLNEST provides a secure, confidential environment for individuals to find and connect with verified mental health professionals.

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS 4** for styling
- **React Router** for navigation

### Backend

- **Express 5** with TypeScript
- **Prisma ORM** with PostgreSQL
- **Argon2** for password hashing
- **Swagger UI** for API documentation

## Project Structure

```
WELLNEST/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── data.ts        # Static data and constants
│   │   └── main.tsx       # Application entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Express middleware
│   │   ├── db/            # Database configuration
│   │   ├── auth/          # Authentication utilities
│   │   ├── inputs.ts      # Input validation schemas
│   │   └── app.ts         # Express app setup
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
└── README.md
```

## Features

### Frontend Features

- **Therapist Directory** - Browse and search therapists with filtering options
- **Therapist Profiles** - View detailed therapist information including specializations
- **Filter System** - Filter by concern, therapy type, session type, and language
- **User Authentication** - Sign in functionality
- **Responsive Design** - Mobile-first responsive layouts
- **Trust Indicators** - Display of confidentiality, verification, and flexibility features

### Backend Features

- **RESTful API** - Complete CRUD operations for therapists
- **User Management** - Registration, login, logout, and session management
- **Specialty Management** - Manage therapist specializations
- **API Documentation** - Swagger UI at `/api/docs`
- **Password Security** - Argon2 hashing for user passwords
- **Cookie-based Sessions** - Secure session management via HTTP-only cookies

## API Endpoints

### Therapists

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/therapists`     | List all therapists |
| POST   | `/api/therapists`     | Create a therapist  |
| GET    | `/api/therapists/:id` | Get therapist by ID |
| PATCH  | `/api/therapists/:id` | Update therapist    |
| DELETE | `/api/therapists/:id` | Delete therapist    |

### Users

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | `/api/users/signup` | Register new user |
| POST   | `/api/users/login`  | User login        |
| POST   | `/api/users/logout` | User logout       |
| GET    | `/api/users/me`     | Get current user  |

### Specialties

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/api/specialties` | List all specialties |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# DATABASE_URL=postgresql://user:password@mohit.systems:5432/wellnest
# PORT=3000
# SESSION_SECRET=your-secret-key

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The backend runs at `http://mohit.systems:3000` with Swagger docs at `/api/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs at `http://mohit.systems:5173` (default Vite port).

## Database Schema

### User

- `id` - Primary key
- `email` - Unique email address
- `name` - User's full name
- `passwordHash` - Argon2 hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last profile update

### Session

- `id` - Primary key (UUID)
- `sessionToken` - Unique session identifier
- `userId` - Foreign key to User
- `expiresAt` - Session expiration time

### Therapist

- `id` - Primary key
- `name` - Therapist's full name
- `experience` - Years of experience
- `specialities` - Many-to-many relation with Specialty
- `createdAt` - Record creation timestamp
- `updatedAt` - Last update timestamp

### Specialty

- `id` - Primary key (UUID)
- `name` - Specialty name (unique)
- `therapists` - Many-to-many relation with Therapist

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@mohit.systems:5432/wellnest
PORT=3000
```

## Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with tsx
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npx prisma studio` - Open Prisma database GUI

## License

MIT
