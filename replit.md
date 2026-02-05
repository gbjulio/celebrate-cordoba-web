# Celebrate Córdoba

## Overview

Celebrate Córdoba is a web application for organizing birthday parties and events in Córdoba. The platform allows visitors to view venue information, pricing packages, gallery images, and check date availability through an interactive calendar. An admin panel enables staff to manage calendar bookings and availability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration
- **Animations**: Framer Motion for UI animations
- **Carousel**: Embla Carousel for image galleries

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **Session Management**: express-session with connect-pg-simple for PostgreSQL-backed sessions
- **Authentication**: Custom session-based auth with bcryptjs for password hashing
- **API Design**: RESTful JSON API under `/api` prefix

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Tables**:
  - `users`: Admin user accounts (id, username, password)
  - `bookings`: Calendar date reservations (id, date, status)

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route pages (home, admin, not-found)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and query client
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── static.ts     # Static file serving
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle schema definitions
└── migrations/       # Database migrations
```

### Key Design Patterns
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Type Sharing**: Zod schemas generated from Drizzle for validation across stack
- **Path Aliases**: `@/` for client, `@shared/` for shared, `@assets/` for attached files

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Session Store**: PostgreSQL-backed session storage using connect-pg-simple

### UI Components
- **Radix UI**: Headless component primitives (dialog, dropdown, toast, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date manipulation for calendar functionality

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **Replit Plugins**: Dev banner, cartographer, runtime error overlay

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (optional, has fallback)