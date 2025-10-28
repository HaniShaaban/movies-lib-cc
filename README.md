# Movies Library - Full Stack Application

A full-stack movie management system with role-based access control, featuring a NestJS backend, React frontend, and PostgreSQL database, all containerized with Docker.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend (NestJS)](#backend-nestjs)
- [Frontend (React)](#frontend-react)
- [Database](#database)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)

---

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│   NestJS    │─────▶│ PostgreSQL  │
│  Frontend   │      │   Backend   │      │  Database   │
│             │◀─────│             │◀─────│             │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Database**: PostgreSQL 16

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: Context API (AuthContext)
- **Language**: TypeScript

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Persistence**: Docker volumes
- **Reverse Proxy**: Nginx (for frontend)

---

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/HaniShaaban/movies-lib-cc.git
cd movies-lib
```

### 2. Configure environment variables

Create a `.env.prod` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/movies?schema=public"
JWT_SECRET=e8d692d14546a6103fe4f1fd0ff9b9e4
ES_URL="http://elasticsearch:9200"
```

### 3. Start all services

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Run database migrations
- Seed initial data (10 genres, 10 directors, 200 movies, admin user)
- Start the NestJS backend on `http://localhost:3000`
- Start the React frontend on `http://localhost:5173`

### 4. Access the application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs (Swagger UI)

### 5. Default credentials

```
Email: admin@example.com
Password: 123456
```

---

## Backend (NestJS)

### Overview

NestJS-based REST API exposing endpoints for movies, users, and authentication with comprehensive role-based access control.

### Key Features

- **Authentication**: Registration and login with JWT token issuance and verification
- **Authorization**: Role-based guards to protect admin-only routes
- **Validation**: DTO-based validation with global validation pipeline
- **Database**: Relational schema managed by Prisma with migrations
- **Seeding**: Automated seeding of initial data on startup
- **API Documentation**: Interactive Swagger documentation

### Validation Details

Global validation pipeline configured to:
- **Whitelist**: Remove unknown properties from incoming requests
- **Forbid non-whitelisted**: Reject requests with unexpected fields
- **Transform**: Convert payloads to DTO instances with proper types
- **DTO-level rules**: Enforce types, required fields, email format, password strength, and domain constraints

### Project Structure

```
be/
├── src/
│   ├── auth/              # Authentication module (login, register, JWT)
│   ├── movies/            # Movies CRUD operations
│   ├── users/             # User management
│   ├── genres/            # Genre management
│   ├── directors/         # Director management
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.js            # Seeding script
├── Dockerfile
└── package.json
```

---

## Frontend (React)

### Overview

React built with Vite, focusing on simplicity and clean integration with the backend API.

### Key Features

- **Authentication**: JWT-based auth with persistent login via localStorage
- **Protected Routes**: Route guards for authenticated users
- **API Integration**: Axios-based HTTP client with interceptors
- **State Management**: Context API for authentication state

---

## Database

### Seeding

On every `docker-compose up`, the database is:
1. Truncated (all existing data removed)
2. Seeded with fresh data:
   - 10 genres (Action, Drama, Comedy, etc.)
   - 10 directors (Christopher Nolan, Steven Spielberg, etc.)
   - 200 movies (with random assignments)
   - 1 admin user (admin@example.com)

---

## ElasticSearch

### Overview

Fast text search on movies (title and synopsis)

---

## Production Deployment

### Build and start services

```bash
docker-compose up -d --build
```

### Stop services

```bash
docker-compose down
```


## API Documentation

Interactive API documentation is available via Swagger UI:

**URL**: http://localhost:3000/api-docs

### Using Swagger

1. Open Swagger UI in browser
2. Click "Authorize" button
3. Login via `/auth/login` endpoint to get JWT token
4. Copy the token (without "Bearer" prefix)
5. Paste token in authorization dialog
6. Test authenticated endpoints directly from Swagger


## Troubleshooting

### Database connection issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify DATABASE_URL in `.env.prod`

---