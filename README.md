# Studio Management System

A complete SaaS web app for freelancers and small creative studios. Manage clients, projects, tasks, invoices, time, calendar, and reporting in one workspace.

Live product brand in the UI: **Atelier**.

Repository: [Mierul01/studio-management-system](https://github.com/Mierul01/studio-management-system)

---

## What this system is for

Studios often juggle spreadsheets, chat, and separate billing tools. This product is a **studio operating system**: one place to run client work from first lead to paid invoice.

Typical users:
- Freelance designers, developers, and marketers
- Small studio owners (1–5 people)
- Sellers who want a ready-made SaaS demo to customize and sell

Core job of the product:
1. Capture and organize **clients**
2. Run **projects** and **tasks**
3. Track **time** against work
4. Create and follow **invoices**
5. Plan work on a **calendar**
6. Review performance in **reports**

---

## Product map

### Public website
| Page | Purpose |
|------|---------|
| Landing | Brand, product story, feature overview, demo CTA |
| Login | Optional sign-in (browser-local accounts) |
| Register | Optional account creation |

Auth is optional. Users can open a full **demo workspace** without registering.

### App workspace
| Module | What it does |
|--------|----------------|
| Dashboard | Revenue, outstanding invoices, active projects, open tasks, upcoming events |
| Clients | CRUD roster for leads / active / paused clients and pipeline value |
| Projects | Budget, status, progress, due dates, linked to clients |
| Tasks | Kanban board (`todo` / `doing` / `done`) with priorities |
| Invoices | Draft → send → paid / overdue flow with amounts and notes |
| Time | Live timer + manual logs, billable flags, totals |
| Calendar | Month grid, meetings / deadlines / reminders |
| Reports | Paid / sent / overdue / draft totals, hours by project, client value |
| Profile | Studio identity: name, role, bio, phone, location, website |
| Settings | Workspace preferences and notification toggles |
| Messages | Inbox for client threads (opened from notification bell) |
| Files | Project file library (available in app routes) |
| Help | In-app guides linked from the header help icon |

---

## System design

### Architecture
```
Browser (React SPA)
  ├── Landing / Auth routes
  └── App shell
        ├── Fixed sidebar navigation
        ├── Top header (date, page title, actions, notifications)
        └── Feature pages
              └── DataContext + AuthContext
                    └── localStorage persistence
```

Stack:
- **React 19** + **TypeScript**
- **Vite** for build/dev
- **React Router** for routing
- **Tailwind CSS v4** for styling
- **localStorage** for users, session, and workspace data (no backend required)

This is a front-end complete product. Suitable for demos, sales showcases, and later backend upgrade (API / database / real auth).

### Auth model
- Users register with name, email, password, company
- Passwords stay in local browser storage (demo-grade, not production security)
- Session keeps `{ user, isDemo }`
- Demo mode loads seeded studio data for immediate exploration
- Logout clears the session and returns to landing

### Data model (main entities)
- **User** — profile + studio identity
- **Client** — contact, status, value, notes
- **Project** — client link, budget, progress, status
- **Task** — project link, priority, kanban status
- **Invoice** — client link, amount, lifecycle status
- **TimeEntry** — project link, minutes, billable flag
- **CalendarEvent** — meeting / deadline / reminder
- **Message** — inbox notifications
- **FileItem** — named assets tied to projects

Seed data ships with realistic sample clients and projects so the demo feels alive on first open.

### Persistence keys
- `atelier_users` — registered accounts
- `atelier_session` — current session
- `atelier_data_demo` — demo workspace
- `atelier_data_<userId>` — per-user workspace

### UI / UX design
- Brand-first landing (cool mist atmosphere, ink + accent coral, teal highlights)
- Typography: **Bricolage Grotesque** (display) + **Source Sans 3** (body)
- App shell:
  - Sidebar fixed (does not scroll with page)
  - Compact white header with date + current page title
  - Orange contextual action button
  - Bell opens a **notification popup** first; clicking an item opens that exact message (`/app/messages?id=...`)
  - Help and logout as icon actions
- Active menu state uses light teal background + orange left accent (not a dark fill)
- Bottom of sidebar shows **name + company** and opens Profile

### Navigation philosophy
Sidebar keeps the important day-to-day modules only:
Dashboard, Clients, Projects, Tasks, Invoices, Time, Calendar, Reports, Settings

Messages are reached from the bell. Profile is reached from the sidebar user block.

---

## Getting started

Requires Node.js 20+ (recommended: 22).

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Preview the production build |

---

## How to demo / sell

1. Open the landing page
2. Click **Open the demo** (or Sign in / Register)
3. Walk buyers through:
   - Dashboard overview
   - Clients → Projects → Tasks flow
   - Time tracking → Invoices → Reports
4. Show Profile + notification bell behavior

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

---

## Roadmap ideas (optional next layer)

- Real backend (auth, Postgres/Supabase)
- Team seats and roles
- PDF invoice export
- Email sending for invoices/messages
- Stripe / payment links
- Multi-currency accounting

---

## License

Private/commercial use by the repo owner unless otherwise stated.
