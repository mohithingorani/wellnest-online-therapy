# WELLNEST

A mental health platform connecting users with licensed therapists. WELLNEST provides a secure, confidential environment for individuals to find and connect with verified mental health professionals, alongside self-assessment tools, journaling, breathing exercises, and a gamified rewards system.

> **Live:** [wellnest-online-therapy.vercel.app](https://wellnest-online-therapy.vercel.app)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, React Router |
| **Backend** | Express 5, TypeScript, Prisma ORM, PostgreSQL |
| **Auth** | Argon2 (admin), SHA-256 token sessions (users), Google OAuth 2.0 |
| **Tooling** | ESLint, tsx, Prisma Studio |

---

## Features

### 🧑‍⚕️ Therapist Discovery
- Browse and search therapists with real-time filtering
- Filter by concern, therapy type, session type, language, gender, and location
- Detailed therapist profiles with credentials, experience, and verified badges
- Booking flow with date/time selection and checkout

### 📝 Journal & Mood Tracking
- Daily journal entries with mood check-in (5-point scale)
- Mood trend chart (14-day SVG area chart)
- Guided prompts and reflection streaks
- Entry history grouped by day with word count and reading time

### 🌬️ Breathing Exercises
- 3 techniques: 4-7-8 (calming), Box (focus), Simple (reset)
- Configurable duration (1, 3, or 5 minutes)
- Real-time SVG ring animation with phase tracking
- Optional sound cues (Web Audio API chimes) and haptic feedback
- Seeds awarded on completion

### 📋 Self-Assessments
- Clinically-informed screening tools (GAD-7 adapted, Maslach adapted, PSS-4 adapted, Mood Check)
- Question-by-question flow with progress tracking
- Color-coded severity bands with actionable recommendations
- Assessment history tracking

### 📚 Resource Library
- Evidence-informed mental health articles (Anxiety, Burnout, Journaling, CBT, Therapy, Stigma)
- Topic-based filtering
- Read timer awards seeds after 30 seconds

### 🎮 Gamification & Rewards
- **Seeds** — earn by journaling, breathing, assessments, reading, daily check-ins, referrals
- **8 levels** — Seedling → Sprout → Sapling → Bloom → Grove → Flourishing → Forest → Ancient
- **Achievements** — 7 badges (First Seed, First Reflection, Self Aware, Connector, 3-Day Streak, 7-Day Streak, 30-Day Streak)
- **Weekly Challenges** — rotating challenges with day-by-day tracking
- **28-day streak heatmap** — visual streak calendar
- **Redeemable rewards** — themes, badges, donations at 150/400/1000 seeds

### 👥 Referral System
- Share referral codes via WhatsApp, X (Twitter), or copy link
- 75 seeds awarded per successful referral
- Referral stats dashboard

### 📊 Admin Panel
- Role-based admin dashboard (super_admin, admin, moderator)
- User and therapist management (CRUD)
- Analytics with user growth chart and top specialties
- Activity feed
- Settings and password management

### 🔐 Authentication
- **User auth** — cookie-based sessions (`wellnest_session`), SHA-256 hashed tokens, 7-day expiry
- **Admin auth** — separate cookie (`wellnest_admin`), Argon2 password verification
- **Google OAuth** — one-tap sign-in and sign-up

---

## Project Structure

```
WELLNEST/
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   └── admin/                 # Admin panel components
│   │   ├── pages/                     # Route pages
│   │   │   └── admin/                 # Admin pages
│   │   ├── contexts/                  # React contexts (auth, admin auth)
│   │   ├── services/                  # API client modules
│   │   ├── data/                      # Static data (levels, challenges, assessments, resources)
│   │   ├── hooks/                     # Custom hooks (useSeeds)
│   │   ├── main.tsx                   # Entry point / router
│   │   └── index.css                  # Global styles + Tailwind + animations
│   ├── public/                        # Static assets
│   └── package.json
│
├── backend/                           # Express API
│   ├── src/
│   │   ├── controllers/               # Request handlers
│   │   ├── routes/                    # API route definitions
│   │   ├── middleware/                # Express middleware (auth, CORS)
│   │   ├── services/                  # Business logic (seeds engine)
│   │   ├── auth/                      # Auth utilities
│   │   ├── db/                        # Prisma client singleton
│   │   ├── inputs.ts                  # Zod validation schemas
│   │   └── app.ts                     # Express app setup + router mounts
│   ├── prisma/
│   │   └── schema.prisma              # Database schema (18 models)
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### User Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/login` | Login (email + password) |
| POST | `/api/users/logout` | Logout / clear session |
| GET | `/api/users/me` | Get current user |
| POST | `/api/users/google` | Google OAuth sign-in/sign-up |

### Therapists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/therapists` | List therapists (with filters) |
| POST | `/api/therapists` | Create therapist |
| GET | `/api/therapists/:id` | Get therapist by ID |
| PATCH | `/api/therapists/:id` | Update therapist |
| DELETE | `/api/therapists/:id` | Delete therapist |

### Booking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List user's bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking details |
| PATCH | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Cancel booking |

### Journal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journal` | List journal entries |
| POST | `/api/journal` | Create entry (+10 seeds) |
| PATCH | `/api/journal/:id` | Update entry |
| DELETE | `/api/journal/:id` | Delete entry |
| GET | `/api/journal/:id` | Get single entry |

### Seeds & Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seeds/me` | Balance + recent transactions |
| POST | `/api/seeds/award` | Award seeds (client-safe reasons) |
| POST | `/api/seeds/complete-challenge` | Complete weekly challenge |
| GET | `/api/seeds/achievements` | Earned achievements |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessments` | Save assessment result (+15 seeds) |
| GET | `/api/assessments/history` | Last 40 results |
| GET | `/api/assessments/latest` | Latest result per type |

### Referrals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/referrals/me` | Get/create referral code |
| POST | `/api/referrals/use` | Apply referral code |
| GET | `/api/referrals/stats` | Referral stats |

### Waitlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/waitlist` | Join waitlist |
| GET | `/api/waitlist/count` | Public signup count |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | Get current admin |
| PATCH | `/api/admin/me` | Update profile |
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/therapists` | List all therapists |
| POST | `/api/admin/therapists` | Create therapist |
| PATCH | `/api/admin/therapists/:id` | Update therapist |
| DELETE | `/api/admin/therapists/:id` | Delete therapist |
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create user |
| PATCH | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/activity` | Recent activity feed |
| GET | `/api/admin/analytics` | Analytics data |
| GET | `/api/admin/specialties` | List specialties |
| POST | `/api/admin/change-password` | Change admin password |

---

## Database Schema (18 models)

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `User` | email, name, passwordHash, googleId | User accounts |
| `Session` | sessionToken, userId, expiresAt | Auth sessions |
| `Therapist` | name, title, experience, gender | Therapist profiles |
| `SessionType` | name, description | Online / Offline / Chat / Group / Emergency |
| `TherapyType` | name, description | CBT / Mindfulness / Psychodynamic / etc. |
| `Language` | name | Languages spoken |
| `Concerns` | name | Specialties (Anxiety, Depression, etc.) |
| `Booking` | userId, therapistId, date, time, status | Appointments |
| `JournalEntry` | userId, content, mood, date | Daily journal entries |
| `Admin` | email, password, name, role, sessionToken | Admin accounts |
| `Message` | senderId, receiverId, content | Chat messages |
| `UserSeeds` | userId, total, lifetime, level | Seed balance |
| `SeedTransaction` | userId, amount, reason, meta | Seed earn/spend log |
| `Achievement` | userId, slug, title | Earned badges |
| `Assessment` | userId, type, score, band, answers | Self-assessment results |
| `ReferralCode` | userId, code | Referral links |
| `WaitlistEntry` | email, userId, city, concern | Waitlist signups |
| `Subscription` | userId, therapistId, status | Ongoing therapy subscriptions |

---

## Seeds Economy

| Action | Seeds | Daily Cap |
|--------|-------|-----------|
| Sign up | 30 | once |
| Daily check-in | 5 | 1/day |
| Journal entry | 10 | 1/day |
| Breathing session | 8 | 1/day |
| Complete assessment | 15 | 1/day |
| Read an article (30s) | 3 | 1/day |
| 3-day streak bonus | 15 | — |
| 7-day streak bonus | 40 | — |
| 30-day streak bonus | 150 | — |
| Refer a friend | 75 | — |
| Weekly challenge | 35 | 1/week |

### Levels
| Level | Threshold | Title |
|-------|-----------|-------|
| 1 | 0 | Seedling |
| 2 | 100 | Sprout |
| 3 | 250 | Sapling |
| 4 | 500 | Bloom |
| 5 | 850 | Grove |
| 6 | 1,350 | Flourishing |
| 7 | 2,000 | Forest |
| 8 | 3,000 | Ancient |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm

### Backend Setup
```bash
cd backend
npm install

# Create .env:
# DATABASE_URL=postgresql://user:password@localhost:5432/wellnest
# PORT=3000
# GOOGLE_CLIENT_ID=your-google-client-id

npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Runs at `http://localhost:3000`.

### Frontend Setup
```bash
cd frontend
npm install

# Optional: create .env for custom API URL:
# VITE_API_URL=http://localhost:3000/api
# VITE_GOOGLE_CLIENT_ID=your-google-client-id

npm run dev
```

Runs at `http://localhost:5173` — proxies `/api` to `localhost:3000`.

### Admin Access
After seeding:
- **URL:** `http://localhost:5173/admin/login`
- **Credentials:** `admin@wellnest.com` / `password123`

---

## Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (:5173) |
| `npm run build` | TypeScript check + Vite build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Compile + start server |
| `npm run build` | TypeScript compile only |
| `npm run start` | Run pre-compiled server |
| `npm run db:seed` | Seed database |
| `npx prisma studio` | Open Prisma GUI |
| `npx prisma migrate dev` | Run migrations |
| `npx prisma generate` | Regenerate Prisma client |

---

## Architecture Notes

### Two Independent Auth Systems
- **User auth** — `wellnest_session` cookie. Random token → SHA-256 hash stored in `Session` table. 7-day expiry. `optionalAuth` / `requireAuth` middleware populates `req.authUser`.
- **Admin auth** — `wellnest_admin` cookie. SHA-256 hash stored directly in `Admin.sessionToken`. Argon2 password verification on login.

### CORS
Allow-list is hardcoded in `backend/src/app.ts`. Currently allows `localhost:5173`, `localhost:5174`, and the Vercel deployment. Add new origins there.

### API Response Convention
Every endpoint returns:
```json
{ "success": boolean, "data"?: any, "message"?: string, "errors"?: any }
```

---

## License

MIT
