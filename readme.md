# OnTrack

**Your goals, your pace.**

An AI-powered planner that helps users juggle multiple hobbies, tasks, and goals within their existing schedule. Users input areas they want to improve, and the app generates a personalized routine with actionable steps, milestones, and regular check-ins — all integrated with Google Calendar.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express 5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT + Google OAuth 2.0
- **AI:** OpenAI API (GPT-4)
- **Calendar:** Google Calendar API

---

## Core Features

### 1. Onboarding Flow

Users complete a guided setup to define their goals:

- **Goals** — what they want to improve (e.g., "Learn guitar", "Get better at running")
- **Timeline** — target end date, or mark as ongoing (no end date)
- **Frequency** — how often they want to practice (times per week/month)
- **Current level** — beginner / intermediate / advanced
- **Schedule constraints** — work hours, sleep schedule, existing commitments

### 2. AI Plan Generation

The AI takes the user's goals + constraints and produces:

- **Daily routines** — specific tasks slotted into available time
- **Weekly milestones** — measurable targets to hit each week
- **Monthly checkpoints** — bigger-picture progress markers
- **Sub-goals** — each goal broken into concrete, sequential steps

Plans respect the user's schedule and balance multiple goals against each other.

### 3. Google Calendar Integration

- OAuth 2.0 flow to connect the user's Google account
- Read existing events to avoid scheduling conflicts
- Write generated tasks/routines as calendar events
- Sync updates when the plan is regenerated

### 4. Progress Tracking & Check-ins

- **Weekly check-ins** — short form: did you complete your tasks? Rate your week 1-5. Notes.
- **Monthly reviews** — summary of progress toward each goal, milestone completion rate
- Dashboard showing streaks, completion rates, and trends over time

### 5. AI Adaptability

- Users can request a **regenerated plan** at any time
- Check-in data feeds back into the AI to adjust difficulty and pacing
- If a user falls behind, the plan recalibrates rather than stacking missed tasks
- If a user is ahead, the plan can accelerate

### 6. User Auth & Pricing

- **Auth:** Email/password (JWT) + Google OAuth sign-in
- **Free tier:** 1 active goal, basic plan generation
- **Paid tier:** Unlimited goals, calendar sync, advanced analytics, priority regeneration
- Stripe integration for payments

---

## Data Models

### User
```
{
  email, passwordHash, name, googleId?,
  subscription: { plan, stripeCustomerId, expiresAt },
  schedule: { workStart, workEnd, sleepStart, sleepEnd, busyBlocks[] },
  createdAt
}
```

### Goal
```
{
  userId, title, description,
  level: "beginner" | "intermediate" | "advanced",
  timeline: { startDate, endDate?, ongoing: boolean },
  frequency: { times: number, per: "week" | "month" },
  status: "active" | "paused" | "completed",
  subGoals: [{ title, targetDate, completed }],
  createdAt
}
```

### Plan
```
{
  userId,
  generatedAt,
  tasks: [{ goalId, title, description, date, startTime, endTime, completed }],
  weeklyMilestones: [{ goalId, title, weekOf, completed }],
  monthlyCheckpoints: [{ goalId, title, month, completed }]
}
```

### CheckIn
```
{
  userId, type: "weekly" | "monthly",
  date, ratings: [{ goalId, score: 1-5 }],
  notes, completionRate
}
```

---

## API Routes

### Auth
- `POST /api/auth/register` — email/password signup
- `POST /api/auth/login` — email/password login
- `GET /api/auth/google` — Google OAuth redirect
- `GET /api/auth/google/callback` — OAuth callback

### Goals
- `GET /api/goals` — list user's goals
- `POST /api/goals` — create a new goal
- `PUT /api/goals/:id` — update a goal
- `DELETE /api/goals/:id` — delete a goal

### Plans
- `POST /api/plans/generate` — generate a new AI plan
- `GET /api/plans/current` — get active plan
- `PUT /api/plans/tasks/:id` — mark task complete/incomplete

### Check-ins
- `POST /api/checkins` — submit a check-in
- `GET /api/checkins` — get check-in history

### Calendar
- `POST /api/calendar/connect` — initiate Google Calendar OAuth
- `POST /api/calendar/sync` — sync current plan to calendar

---

## Project Structure

```
OnTime/
├── client/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level page components
│       │   ├── Landing.tsx
│       │   ├── Onboarding.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Goals.tsx
│       │   ├── CheckIn.tsx
│       │   └── Settings.tsx
│       ├── context/           # Auth & app state context
│       ├── hooks/             # Custom React hooks
│       ├── services/          # API client functions
│       ├── types/             # TypeScript interfaces
│       ├── App.tsx
│       └── main.tsx
├── server/
│   └── src/
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express route handlers
│       ├── middleware/        # Auth, validation middleware
│       ├── services/          # AI, Calendar, Stripe logic
│       ├── config/            # DB connection, env config
│       └── index.js           # Server entry point
└── readme.md
```

---

## Build Order

A suggested sequence for implementation, each phase building on the last:

### Phase 1 — Foundation
- [ ] Server: Express setup, MongoDB connection, env config
- [ ] Server: User model + auth routes (register/login with JWT)
- [ ] Client: Tailwind setup, routing (React Router)
- [ ] Client: Landing page, login/register forms
- [ ] Client: Auth context, protected routes

### Phase 2 — Goal Management
- [ ] Server: Goal model + CRUD routes
- [ ] Client: Onboarding flow (multi-step form for goals + schedule)
- [ ] Client: Goals page (list, create, edit, delete)

### Phase 3 — AI Plan Generation
- [ ] Server: OpenAI integration service
- [ ] Server: Plan model + generation route
- [ ] Server: Prompt engineering — take goals, schedule, and constraints and produce structured plan
- [ ] Client: Dashboard showing daily tasks, weekly milestones, monthly checkpoints
- [ ] Client: Task completion toggling

### Phase 4 — Check-ins & Adaptability
- [ ] Server: CheckIn model + routes
- [ ] Client: Weekly/monthly check-in forms
- [ ] Server: Feed check-in data into regeneration prompt
- [ ] Client: Progress dashboard (charts, streaks, completion rates)

### Phase 5 — Google Calendar
- [ ] Server: Google OAuth 2.0 flow
- [ ] Server: Google Calendar API — read events, write tasks
- [ ] Client: Calendar connect button in settings
- [ ] Server: Conflict detection when generating plans

### Phase 6 — Payments & Polish
- [ ] Server: Stripe integration (checkout, webhooks, subscription management)
- [ ] Client: Pricing page, upgrade flow
- [ ] Client: Responsive design pass
- [ ] Deployment (Vercel for client, Railway/Render for server)