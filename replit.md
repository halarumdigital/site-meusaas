# SaaS White Label Landing Page

## Overview

This is a white label SaaS platform with a conversion-focused marketing landing page and a complete MySQL-based authentication and user management system. The platform allows users to subscribe and resell a salon/barbershop management system under their own brand. The target audience consists of developers, freelancers, and digital entrepreneurs who want to profit from a ready-made SaaS solution without programming.

The application features:
- **Public Landing Page**: Hero section, process explanation, feature lists, FAQ accordion, and conversion-optimized design
- **Authentication System**: Secure login with bcrypt password hashing and persistent MySQL sessions
- **Admin Dashboard**: User management interface with CRUD operations, role-based access control, and sidebar navigation

Recent Changes (November 2025):
- Implemented complete MySQL authentication system with express-session
- Created admin dashboard with user management (create, read, delete users)
- Added role-based access control (admin/user roles)
- Configured production-ready session management with MySQL store
- Applied security hardening: required SESSION_SECRET, trust proxy configuration, secure cookies

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter - A lightweight client-side routing library for single-page applications. The router is configured in `client/src/App.tsx` with routes for:
- `/` - Public landing page
- `/login` - Authentication page with email/password form
- `/dashboard` - Admin dashboard with user management (protected route)
- `404` - Not found fallback page

**UI Component System**: shadcn/ui with Radix UI primitives. The application uses a comprehensive component library built on Radix UI headless components, styled with Tailwind CSS using the "New York" style variant. Components are located in `client/src/components/ui/`.

**Styling Approach**: Tailwind CSS with custom design tokens. The configuration uses CSS variables for theming (defined in `client/src/index.css`) with support for light and dark modes. The design follows a blue-purple gradient theme as specified in `design_guidelines.md`, with emphasis on conversion-focused layouts inspired by Stripe and Linear.

**Animation**: Framer Motion is used for scroll-triggered animations and micro-interactions, particularly in the home page component (`fadeInUp` animations).

**State Management**: TanStack Query (React Query) for server state management. The query client is configured with:
- Custom fetcher function that handles authentication (credentials: "include")
- Graceful handling of 401 unauthorized responses (returns null)
- Disabled automatic refetching for static content
- Optimistic updates for user CRUD operations

**Form Handling**: React Hook Form with Zod validation via `@hookform/resolvers` for:
- Login form: email and password validation
- User creation form: name (min 2 chars), email validation, password (min 6 chars), role selection

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript. The server is configured in `server/index.ts` with middleware for:
- JSON parsing and URL encoding
- Express-session with MySQL store for persistent sessions
- Trust proxy configuration for secure cookies behind reverse proxies
- Request logging for API routes
- CORS and credentials handling

**Session Management**: Production-ready session configuration:
- MySQL-backed session store using `express-mysql-session`
- Required SESSION_SECRET environment variable (fails fast if missing)
- Secure cookies: httpOnly, sameSite (strict in production), 7-day expiration
- Trust proxy enabled for HTTPS deployments behind reverse proxies
- Automatic session table creation in MySQL database
- Sessions persist across server restarts

**Development Setup**: Vite is integrated as middleware in development mode for hot module replacement and serves the React frontend. In production, the build generates static files that are served by Express.

**API Structure**: RESTful API endpoints registered through `server/routes.ts`:
- **Authentication Routes**:
  - `POST /api/auth/login` - Authenticate user with email/password
  - `POST /api/auth/logout` - Destroy session and logout
  - `GET /api/auth/me` - Get current authenticated user
- **User Management Routes** (admin only):
  - `GET /api/users` - List all users
  - `POST /api/users` - Create new user
  - `DELETE /api/users/:id` - Delete user by ID

**Authentication Middleware**: 
- `requireAuth` - Validates session and loads user data
- `requireAdmin` - Ensures user has admin role
- Both middlewares use TypeScript declaration merging to extend Express Request with user object

**Type Safety**: Shared types between frontend and backend are defined in `shared/schema.ts` using Drizzle ORM schema definitions and Zod for runtime validation:
- `User` - Database user model
- `InsertUser` - User creation schema with validation
- `LoginCredentials` - Login form validation schema

### Database Design

**Database**: MySQL 8.0+ running on remote server (31.97.91.252)

**ORM**: Drizzle ORM configured for MySQL dialect using `mysql2/promise` driver for connection pooling and async operations.

**Connection Management**: Singleton pattern with `getDb()` function that creates and reuses database connection instance.

**Schema Location**: `shared/schema.ts` contains the database schema definitions:

**Tables**:
1. **users** - Application users with authentication
   - `id` (INT, auto-increment primary key)
   - `name` (VARCHAR 255, not null)
   - `email` (VARCHAR 255, unique, not null)
   - `password` (VARCHAR 255, bcrypt hashed, not null)
   - `role` (VARCHAR 50, default 'user', values: 'user' or 'admin')
   - `createdAt` (TIMESTAMP, default CURRENT_TIMESTAMP)

2. **sessions** - Express session storage (auto-created by express-mysql-session)
   - `session_id` (VARCHAR, primary key)
   - `expires` (TIMESTAMP)
   - `data` (JSON)

**Security**:
- Passwords hashed with bcrypt (cost factor 10)
- Session data encrypted in database
- SQL injection prevention via parameterized queries through Drizzle ORM
- Database credentials stored in environment variables

**Initialization**: Script `server/init-db.ts` creates tables and seeds default admin user:
- Email: admin@sistema.com
- Password: admin123 (bcrypt hashed)
- Role: admin

**Migration Strategy**: Currently using manual SQL schema creation. Drizzle Kit configured for future migrations to `migrations/` directory.

### Design System Decisions

**Typography**: Poppins font family loaded from Google Fonts, with hierarchical text sizes (text-5xl/6xl for H1, text-4xl for H2, text-2xl for H3) and semantic font weights.

**Component Patterns**: 
- Rounded buttons using `rounded-full` for CTAs
- Grid-based layouts for features (1-2-3 column responsive grids)
- Gradient backgrounds for hero and CTA sections
- Accordion for FAQ section using Radix UI primitives

**Color Strategy**: CSS custom properties for theming with a neutral base color palette. The design guidelines specify blue-purple gradients for primary sections, though the exact color values are to be defined during implementation.

**Layout System**: Container-based layouts with max-width constraints (max-w-7xl for main sections, max-w-4xl for text-heavy content) and consistent spacing using Tailwind's spacing scale.

## External Dependencies

### Third-Party Services

**Payment Integration**: Asaas payment gateway for subscription billing at R$ 297/month. The system is designed to allow resellers to configure their own Asaas accounts for receiving customer payments directly.

**Infrastructure References**: The landing page content mentions Hostinger Brasil for hosting, Cloudflare for DNS/CDN, and automatic backups every 2 hours, though these are features of the white label product being sold rather than dependencies of the landing page itself.

**Communication**: WhatsApp contact integration for the primary CTA button, linking to WhatsApp Web/API for lead generation.

### Development Tools

**Build System**: Vite with React plugin, TypeScript support, and Replit-specific plugins for error overlays, cartographer, and dev banners.

**Linting/Type Checking**: TypeScript in strict mode with ESNext module resolution and bundler mode for compatibility with Vite.

**UI Component Library**: Complete shadcn/ui component collection including accordions, buttons, cards, dialogs, forms, navigation, and more, all built on Radix UI primitives.

**Utility Libraries**: 
- `clsx` and `tailwind-merge` for conditional class name construction
- `class-variance-authority` for component variant management
- `date-fns` for date manipulation
- `lucide-react` for iconography

### Frontend Libraries

**Icons**: Lucide React provides the icon system (Check, Rocket, DollarSign, Code, TrendingUp, etc.) used throughout the landing page.

**Animation**: Framer Motion for declarative animations with viewport-triggered effects.

**Developer Experience**: Replit-specific Vite plugins provide runtime error modals, code cartography, and development banners when running in Replit environment.

## Authentication & Authorization

### User Roles
- **Admin**: Full access to user management dashboard, can create and delete users
- **User**: Standard user role (placeholder for future features)

### Authentication Flow
1. User submits login form with email and password
2. Backend validates credentials against MySQL database
3. On success, creates session in MySQL sessions table
4. Session cookie sent to client (secure, httpOnly, sameSite)
5. Subsequent requests include session cookie for authentication
6. Dashboard checks authentication on mount via `/api/auth/me`
7. Unauthenticated users redirected to login page

### Protected Routes
- Dashboard requires authentication (checks session via React Query)
- User management API endpoints require admin role
- Redirects happen in useEffect to prevent render-time side effects

### Password Security
- Passwords hashed with bcrypt before storage
- Plain text passwords never stored in database
- Hash verification on login without exposing hashes to client

## Environment Variables

Required environment variables:
- `SESSION_SECRET` - Required. Cryptographically random string for session signing. Application fails to start if not set.
- `MYSQL_HOST` - MySQL server hostname
- `MYSQL_PORT` - MySQL server port (default: 3306)
- `MYSQL_USER` - MySQL username
- `MYSQL_PASSWORD` - MySQL password
- `MYSQL_DATABASE` - MySQL database name

## Production Deployment Notes

### Security Checklist
- ✅ SESSION_SECRET is set to a strong random value
- ✅ MySQL credentials are properly secured
- ✅ Trust proxy enabled for HTTPS reverse proxies
- ✅ Secure cookies enabled in production
- ✅ Sessions persist in database (not memory)
- ✅ CSRF protection via sameSite cookies
- ✅ Password hashing with bcrypt

### Recommended Improvements for Production
1. Implement CSRF tokens for non-sameSite contexts
2. Add session store connectivity monitoring/alerting
3. Configure rate limiting on login endpoint
4. Add password complexity requirements
5. Implement password reset functionality
6. Add email verification for new users
7. Configure MySQL connection pool limits
8. Set up automated database backups
9. Implement audit logging for admin actions
10. Add two-factor authentication option