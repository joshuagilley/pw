# Prestige Worldwide — Project Requirements (Nuxt)

## 1. Overview

**Project Name:** Prestige Worldwide  
**Type:** Nuxt (Vue) web application  
**Purpose:** A family “systems dashboard” for tracking how our systems (starting with finances) are connected, and running a weekly check-in to review what we accomplished, what we missed, and what actions to take next.

The app should help us:
- Define and document family systems (Finance, Home, Health, Parenting, etc.)
- Model relationships between parts of a system (accounts → bills → goals)
- Run a weekly check-in ritual with outcomes + reflections + next steps
- Track progress over time without becoming a complicated accounting app

## 2. Primary Users

- **Family Admin (primary):** sets up systems, connections, routines, and manages structure
- **Family Member:** participates in check-ins, marks tasks done, adds notes

## 3. Product Principles

- **Simple > perfect:** Track what matters; don’t rebuild Mint/YNAB.
- **Systems thinking:** show relationships, dependencies, and cause/effect.
- **Weekly cadence:** the weekly review is the heartbeat.
- **Low friction:** fast entry, few required fields, sensible defaults.
- **Audit-friendly:** changes and check-ins should be reviewable later.

## 4. Core Features

### 4.1 Systems
A **System** is a container like “Family Finance”.
Each system can have:
- Description / purpose
- Components (accounts, bills, checklists, routines, metrics, goals)
- Connections (relationships between components)

**Acceptance Criteria**
- Can create/edit/archive a system
- Can view a system overview page
- Can list components within a system

### 4.2 Components
Components are objects inside a system. MVP component types:
- **Account** (checking, savings, credit card)
- **Bill** (rent, insurance, subscriptions)
- **Goal** (emergency fund, debt payoff, vacation)
- **Routine** (weekly budget review, monthly statement check)
- **Checklist** (weekly admin checklist, “Sunday reset”)
- **Metric** (grocery spend, debt balance, savings rate)

**Acceptance Criteria**
- Can create/edit each component type (MVP can start with a generic “Component” with a type field)
- Components can belong to exactly one system
- Each component has a name, type, optional notes, status (active/archived)

### 4.3 Connections (System Map)
Connections describe how things relate:
- Bill is paid from an account
- Goal is funded by an account
- Routine affects a goal
- Metric is tracked for a system

**MVP Connection Types**
- `FUNDS` (Account -> Goal)
- `PAYS` (Account -> Bill)
- `AFFECTS` (Routine/Checklist -> Goal/Metric)
- `TRACKS` (System -> Metric)

**Acceptance Criteria**
- Can create/delete a connection between two components
- System view shows a simple “Connections” list
- Stretch: visualize as a graph (later)

### 4.4 Weekly Check-In (Core Loop)
A weekly check-in captures:
- Week start/end date
- “Wins” (what we accomplished)
- “Misses” (what we didn’t do)
- “Reasons / Notes”
- “Scorecard” (optional quick ratings like 1–5 for Finance/Home/Health)
- Action items created from misses

**Acceptance Criteria**
- Can start a new check-in for a week
- Can fill out wins/misses/notes
- Can create action items from a check-in
- Can view past check-ins in a timeline

### 4.5 Action Items / Tasks
Simple tasks:
- Title, optional description
- Due date (optional)
- Status: open / done
- Linked to a check-in (optional) and/or system

**Acceptance Criteria**
- Create/edit/complete tasks
- Filter tasks by open/done and system
- Tasks created from check-in automatically link back

### 4.6 Dashboard (Home)
A quick “today/this week” view:
- Next check-in due / last check-in summary
- Open tasks
- Key systems status (counts: open tasks, last updated)

**Acceptance Criteria**
- Home shows last check-in date + button to start next check-in
- Home shows open tasks list

## 5. Non-Functional Requirements

### 5.1 UX / UI
- Mobile-friendly responsive layout
- Fast navigation, minimal friction for weekly check-in
- Clean, calm visual style (not “finance app anxiety”)

### 5.2 Performance
- Page load feels instant on local dev
- Avoid heavy charts/graphs in MVP
- Use server-side data fetching where appropriate

### 5.3 Security & Privacy
- This is family data; must be private
- Auth required (even MVP)
- Never commit credentials
- Configure secrets via Fly.io environment variables

## 6. Tech Stack (Tooling Specifics)

### Frontend / App
- **Nuxt 3**
- **TypeScript**
- **TailwindCSS**
- Optional UI library: Nuxt UI or shadcn-vue (choose one)

### Database
- **MongoDB**
- Connection configuration is via Fly.io environment variables:
  - `MONGODB_URI` (Mongo connection string)
  - `MONGODB_DB` (database name)

### Deployment
- **Fly.io**
- Repository must include a `fly.toml` file (source controlled)
- Fly.io app configuration:
  - All environment variables managed in Fly.io (not committed)
  - Deployment performed via GitHub Actions using `flyctl`

## 7. Required Repo Files

### 7.1 `fly.toml`
Must exist at repo root.
**Requirements**
- Configured for a Nuxt app deployment on Fly.io
- Uses Fly build/deploy process (Dockerfile optional; prefer simplest working approach)
- App name and region set appropriately (can be updated later)

### 7.2 GitHub Actions: Fly Deploy
A workflow must exist at:
- `.github/workflows/fly-deploy.yml`

**Requirements**
- Runs on push to `main` (and optionally manual `workflow_dispatch`)
- Installs `flyctl`
- Deploys using `flyctl deploy`
- Uses `FLY_API_TOKEN` stored as a GitHub Actions secret
- Does not print secrets or env values to logs

## 8. Data Model (MVP)

### Entities
- `User`
- `System`
- `Component`
- `Connection`
- `CheckIn`
- `Task`

### Suggested Fields (high-level)
**System**
- id, name, description, status, createdAt, updatedAt

**Component**
- id, systemId, type, name, notes, status, createdAt, updatedAt
- (Later) type-specific fields via optional nested fields

**Connection**
- id, systemId, fromComponentId, toComponentId, type, notes, createdAt

**CheckIn**
- id, weekStart, weekEnd, wins (text), misses (text), notes (text)
- optional scorecard (e.g. { finance: 4, home: 3 })
- createdAt, updatedAt

**Task**
- id, systemId (nullable), checkInId (nullable), title, description
- status (open/done), dueDate (nullable), createdAt, updatedAt

## 9. Pages / Routes (MVP)

- `/login`
- `/` Dashboard
- `/systems` Systems list
- `/systems/:id` System detail (components + connections + tasks summary)
- `/systems/:id/components/new`
- `/checkins` Check-in history
- `/checkins/new` Create weekly check-in
- `/checkins/:id` View check-in + generated tasks
- `/tasks` Task list

## 10. MVP Scope (Phase 1)

**Must Have**
- Auth (basic)
- Systems CRUD
- Component CRUD (generic component with type)
- Connections CRUD (list-based, no graph yet)
- Weekly check-in create/view
- Tasks create/complete + link to check-ins/systems
- Simple dashboard
- Fly.io deployment via `fly.toml` + GitHub Action

**Nice to Have**
- “Start next check-in” auto-selects current week range
- Templates (prebuilt Finance system starter kit)
- Graph visualization of connections

## 11. Future Enhancements (Phase 2+)

- Graph view of system connections (nodes/edges)
- Recurring routines (auto-create weekly tasks)
- Financial snapshots (manual totals, not bank sync)
- Notifications/reminders (check-in due)
- Multi-user roles (admin/member)
- Export (CSV/JSON) for backup

## 12. Definition of Done

A feature is “done” when:
- Works end-to-end (UI + API + persistence)
- Has basic validation and error states
- Is reachable via navigation
- Doesn’t break on refresh (SSR/CSR safe)
- Has at least minimal tests for critical logic (optional MVP)

## 13. Cursor Working Agreements

- Prefer small, composable components
- Keep forms consistent (shared form components)
- Use TypeScript strictly
- Add a short README section for how to run locally
- Keep MVP simple: avoid premature abstraction