# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a white label SaaS platform targeting developers, freelancers, and digital entrepreneurs who want to resell a salon/barbershop management system under their own brand. The codebase contains both a public marketing landing page and a complete admin dashboard with user management.

The application uses a full-stack TypeScript architecture with React (Vite) frontend and Express backend, connected to a MySQL database.

## Development Commands

### Running the Application
```bash
npm run dev        # Start development server with hot reload (port 5000)
npm run build      # Build frontend and backend for production
npm start          # Start production server
npm run check      # Type-check TypeScript without building
```

**Windows Compatibility**: The scripts use `cross-env` to set environment variables, ensuring compatibility across Windows, macOS, and Linux. This prevents the "NODE_ENV is not recognized" error on Windows.

### Database Operations
```bash
npm run db:push    # Push schema changes to database using Drizzle Kit
```

Note: The database must be manually initialized on first setup by running `tsx server/init-db.ts`, which creates tables and seeds the default admin user (admin@sistema.com / admin123).

## Architecture Overview

### Monorepo Structure

The project uses a monorepo pattern with three main directories:
- **`client/`** - React frontend application
- **`server/`** - Express backend API
- **`shared/`** - Shared TypeScript types and database schema definitions

TypeScript path aliases:
- `@/*` resolves to `client/src/*`
- `@shared/*` resolves to `shared/*`
- `@assets/*` resolves to `attached_assets/*`

### Database Architecture

**Critical**: Despite the presence of `drizzle.config.ts` showing PostgreSQL dialect, this application actually uses **MySQL**. The configuration file is outdated. The real database connection is defined in `server/db.ts` using MySQL with the following env vars: `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

Database schema is defined in `shared/schema.ts` using Drizzle ORM with MySQL dialect. The schema includes:
- **users table**: Authentication and user management with bcrypt password hashing
- **sessions table**: Auto-created by express-mysql-session for persistent login sessions

### Session Management

The application uses MySQL-backed sessions (not memory store) via `express-mysql-session`. Key implementation details:
- **Required**: `SESSION_SECRET` environment variable - application fails to start without it
- Sessions persist across server restarts in MySQL `sessions` table
- 7-day session expiration with automatic cleanup
- Trust proxy enabled for HTTPS reverse proxy deployments
- Secure cookies in production (httpOnly, sameSite strict)

### Authentication Flow

1. User submits credentials to `POST /api/auth/login`
2. Backend validates against MySQL users table with bcrypt comparison
3. Session created in MySQL sessions table, session ID cookie sent to client
4. Frontend checks auth status via `GET /api/auth/me` on protected route mounts
5. Auth middleware (`requireAuth`, `requireAdmin`) validates session on subsequent requests

**Important**: Dashboard page redirects to login in `useEffect` (not during render) to avoid side effects during the render phase.

### Frontend State Management

**TanStack Query (React Query)** manages all server state with specific configurations:
- Custom fetcher with `credentials: "include"` for cookie-based auth
- 401 responses gracefully return `null` instead of throwing errors
- Automatic refetching disabled for static landing page content
- Optimistic updates for user management operations

Forms use **React Hook Form** with **Zod** schema validation. All validation schemas are shared from `shared/schema.ts` using `drizzle-zod` for type safety between frontend and backend.

### Routing

**Wouter** handles client-side routing (not React Router). Routes defined in `client/src/App.tsx`:
- `/` - Public landing page
- `/login` - Authentication page
- `/dashboard` - Admin dashboard (protected)
- 404 fallback for unknown routes

### Development vs Production

**Development**:
- Vite runs as middleware in Express (`server/vite.ts`)
- Hot module replacement enabled
- Replit-specific dev tools load conditionally

**Production**:
- Frontend built to `dist/public/` directory
- Backend bundled with esbuild to `dist/index.js`
- Express serves static files from `dist/public/`
- Single server process on port 5000 (or `process.env.PORT`)

## Design System Conventions

The project follows specific design guidelines documented in `design_guidelines.md`:

### Typography
- Primary font: Poppins (loaded from Google Fonts)
- Headings use `font-bold` with sizes: `text-5xl`/`text-6xl` (H1), `text-4xl` (H2), `text-2xl` (H3)
- Body text uses `text-lg` with `text-gray-700`

### Layout Patterns
- Main sections: `max-w-7xl` containers
- Text-heavy content: `max-w-4xl` containers
- Major section spacing: `py-16 md:py-24`
- Responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Component Conventions
- Buttons: `rounded-full` for primary CTAs with gradient backgrounds
- Cards: `rounded-xl` with subtle hover effects (lift + shadow)
- Gradients: Blue-purple gradient theme for hero and CTA sections
- Animations: Framer Motion with `fadeInUp` viewport-triggered effects
- Icons: Lucide React (not Heroicons despite design doc reference)
- FAQ: Radix UI accordion components

### UI Components

All UI components from **shadcn/ui** are in `client/src/components/ui/`. The project uses the "New York" style variant with Radix UI primitives. Components are built with Tailwind CSS using CSS variables for theming (defined in `client/src/index.css`).

## API Routes

All routes defined in `server/routes.ts`:

**Authentication**:
- `POST /api/auth/login` - Email/password authentication
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/me` - Get current user (requires auth)

**User Management** (admin only):
- `GET /api/users` - List all users (excludes password field)
- `POST /api/users` - Create new user with bcrypt hashed password
- `DELETE /api/users/:id` - Delete user (prevents self-deletion)

## Environment Variables

**Required**:
- `SESSION_SECRET` - Cryptographic secret for session signing (app crashes without this)
- `MYSQL_HOST` - MySQL server hostname
- `MYSQL_PORT` - MySQL server port (default: 3306)
- `MYSQL_USER` - MySQL username
- `MYSQL_PASSWORD` - MySQL password
- `MYSQL_DATABASE` - MySQL database name

**Optional**:
- `NODE_ENV` - Set to "production" for production builds
- `PORT` - Server port (default: 5000)

## User Preferences

The team prefers simple, everyday language in communications (Brazilian Portuguese for user-facing content).

## Important Implementation Notes

### Security Considerations
- All passwords hashed with bcrypt (cost factor 10) before storage
- Session data encrypted in MySQL
- SQL injection prevented via Drizzle ORM parameterized queries
- Admin middleware prevents users from deleting their own account
- Trust proxy configured for deployment behind reverse proxies

### Type Safety Pattern
The codebase maintains strict type safety between frontend and backend using:
1. Database schema defined once in `shared/schema.ts` with Drizzle ORM
2. Zod schemas generated from Drizzle schema via `drizzle-zod`
3. TypeScript types inferred from Zod schemas
4. Same validation schemas used on both client and server

Example pattern:
```typescript
// shared/schema.ts
export const users = mysqlTable("users", { /* ... */ });
export const insertUserSchema = createInsertSchema(users, { /* zod refinements */ });
export type InsertUser = z.infer<typeof insertUserSchema>;
```

### Express Type Extensions
The server uses TypeScript declaration merging to extend Express types. The `requireAuth` middleware adds `user` property to `Request` object. This pattern is implemented in `server/auth.ts`.

### Build Output
- Frontend: `dist/public/` (served as static files)
- Backend: `dist/index.js` (single bundled file)
- Both builds must complete for production deployment

### Port Configuration
**Critical**: The application must run on port 5000 (or `process.env.PORT` if set). Other ports are firewalled in the deployment environment. The server binds to `0.0.0.0` for network accessibility.

**Windows Compatibility**: The `reusePort` option has been removed as it's not supported on Windows systems.
