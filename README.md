# Prestige Worldwide

A family systems management dashboard built with Nuxt 3. Track systems, components, connections, weekly check-ins, and action items.

## Features

- **Systems Management**: Create and organize family systems (Finance, Home, Health, etc.)
- **Components**: Track accounts, bills, goals, routines, checklists, and metrics
- **Connections**: Model relationships between components
- **Weekly Check-ins**: Capture wins, misses, notes, and scorecards
- **Tasks**: Create and manage action items linked to systems and check-ins
- **Dashboard**: Quick overview of systems, tasks, and recent check-ins

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Library**: Nuxt UI
- **Database**: MongoDB
- **Deployment**: Fly.io

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or yarn

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd prestige-worldwide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=prestige-worldwide
   SESSION_SECRET=your-secret-key-here
   ```

   For local MongoDB:
   - Install MongoDB locally, or
   - Use MongoDB Atlas (free tier available)
   - Update `MONGODB_URI` with your connection string

4. **Create initial user**
   
   You'll need to create a user in the database. You can do this by:
   - Using MongoDB Compass or a similar tool
   - Creating a script to seed the database
   - Or implementing a registration endpoint (not included in MVP)

   Example user document structure:
   ```json
   {
     "email": "admin@example.com",
     "password": "<hashed-password>",
     "name": "Admin User",
     "role": "admin",
     "createdAt": new Date(),
     "updatedAt": new Date()
   }
   ```

   Note: Passwords are hashed using SHA-256. For production, consider using bcrypt.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
prestige-worldwide/
├── assets/           # CSS and static assets
├── composables/      # Vue composables
├── layouts/          # Layout components
├── pages/            # Application pages/routes
├── server/           # Server-side code
│   ├── api/          # API routes
│   ├── middleware/   # Server middleware
│   └── utils/        # Server utilities
├── types/            # TypeScript type definitions
├── fly.toml          # Fly.io configuration
└── nuxt.config.ts    # Nuxt configuration
```

## Deployment

### Fly.io Deployment

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

3. **Set environment variables in Fly.io**
   ```bash
   flyctl secrets set MONGODB_URI="your-mongodb-connection-string"
   flyctl secrets set MONGODB_DB="prestige-worldwide"
   flyctl secrets set SESSION_SECRET="your-secret-key"
   ```

4. **Deploy**
   ```bash
   flyctl deploy
   ```

   Or push to `main` branch to trigger automatic deployment via GitHub Actions.

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/fly-deploy.yml`) that automatically deploys to Fly.io when you push to the `main` branch.

**Setup:**
1. Add `FLY_API_TOKEN` as a secret in your GitHub repository settings
2. Get your Fly.io API token: `flyctl auth token`
3. Add it to GitHub: Settings → Secrets and variables → Actions → New repository secret

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB` | Database name | No (defaults to `prestige-worldwide`) |
| `SESSION_SECRET` | Secret for session encryption | Yes (use a strong random string in production) |

## API Routes

All API routes are prefixed with `/api/`:

- **Auth**: `/api/auth/login`, `/api/auth/logout`
- **Systems**: `/api/systems` (GET, POST), `/api/systems/:id` (GET, PUT)
- **Components**: `/api/components` (GET, POST), `/api/components/:id` (PUT)
- **Connections**: `/api/connections` (GET, POST), `/api/connections/:id` (DELETE)
- **Check-ins**: `/api/checkins` (GET, POST), `/api/checkins/:id` (GET, PUT)
- **Tasks**: `/api/tasks` (GET, POST), `/api/tasks/:id` (PUT)

## Pages

- `/login` - Login page
- `/` - Dashboard
- `/systems` - Systems list
- `/systems/:id` - System detail
- `/checkins` - Check-in history
- `/checkins/new` - Create new check-in
- `/checkins/:id` - View check-in
- `/tasks` - Task list

## Development Notes

- Authentication uses simple cookie-based sessions (MVP)
- Passwords are hashed with SHA-256 (consider bcrypt for production)
- All API routes require authentication except `/api/auth/login`
- MongoDB ObjectIds are used as string IDs throughout the app

## License

Private project - for family use only.
