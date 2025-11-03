# SaaS White Label Landing Page

## Overview

This is a single-page marketing website for a white label SaaS platform. The platform allows users to subscribe and resell a salon/barbershop management system under their own brand. The target audience consists of developers, freelancers, and digital entrepreneurs who want to profit from a ready-made SaaS solution without programming.

The application features a conversion-focused landing page with hero section, process explanation, feature lists, and FAQ accordion, built with modern web technologies and designed for high conversion rates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter - A lightweight client-side routing library for single-page applications. The router is configured in `client/src/App.tsx` with routes for the home page and a 404 fallback.

**UI Component System**: shadcn/ui with Radix UI primitives. The application uses a comprehensive component library built on Radix UI headless components, styled with Tailwind CSS using the "New York" style variant. Components are located in `client/src/components/ui/`.

**Styling Approach**: Tailwind CSS with custom design tokens. The configuration uses CSS variables for theming (defined in `client/src/index.css`) with support for light and dark modes. The design follows a blue-purple gradient theme as specified in `design_guidelines.md`, with emphasis on conversion-focused layouts inspired by Stripe and Linear.

**Animation**: Framer Motion is used for scroll-triggered animations and micro-interactions, particularly in the home page component (`fadeInUp` animations).

**State Management**: TanStack Query (React Query) for server state management. The query client is configured with specific defaults including disabled automatic refetching and infinite stale time, suggesting a primarily static content website.

**Form Handling**: React Hook Form with Zod validation via `@hookform/resolvers`, though no forms are currently implemented in the visible pages.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript. The server is configured in `server/index.ts` with middleware for JSON parsing, URL encoding, and request logging.

**Development Setup**: Vite is integrated as middleware in development mode for hot module replacement and serves the React frontend. In production, the build generates static files that are served by Express.

**API Structure**: The routes are registered through `server/routes.ts`, though the file currently contains no implemented endpoints. The architecture is prepared for RESTful API endpoints with the `/api` prefix convention.

**Data Storage**: The application uses an in-memory storage implementation (`MemStorage` class in `server/storage.ts`) with a defined interface for CRUD operations. This is designed to be replaced with a persistent database solution.

**Type Safety**: Shared types between frontend and backend are defined in `shared/schema.ts` using Drizzle ORM schema definitions and Zod for runtime validation.

### Database Design

**ORM**: Drizzle ORM configured for PostgreSQL dialect. The configuration (`drizzle.config.ts`) expects a `DATABASE_URL` environment variable and uses the Neon serverless Postgres driver (`@neondatabase/serverless`).

**Schema Location**: `shared/schema.ts` contains the database schema definitions, currently including a `users` table with UUID primary keys, username, and password fields.

**Migration Strategy**: Drizzle Kit is configured for schema migrations with output to the `migrations/` directory. The `db:push` script is available for pushing schema changes.

**Current State**: The database integration is prepared but not actively used. The in-memory storage implementation suggests the database will be added as the application evolves beyond the static landing page.

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