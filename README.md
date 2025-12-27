# GearGuard - Maintenance Tracker

Hosted link:
https://v0-gear-guard-maintenance-tracker-bay.vercel.app/

A full-stack Next.js application for managing equipment maintenance requests with MySQL database.

## Features

- User authentication (login/signup)
- Kanban board for maintenance requests
- Equipment management
- Calendar view for preventive maintenance
- Team-based workflow
- Real-time updates
- MySQL database with Prisma ORM

## Prerequisites

- Node.js 18+ 
- MySQL database


### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- Email: `john@example.com`
- Password: `password123`

## Database Schema

The application uses the following main tables:

- `maintenance_teams` - Teams responsible for maintenance
- `departments` - Company departments
- `employees` - Users with authentication
- `equipment_categories` - Equipment categorization
- `equipment` - Equipment inventory
- `maintenance_requests` - Maintenance work orders
- `work_centers` - Work centers (optional)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/[id]` - Get equipment details
- `GET /api/equipment/[id]/open-requests-count` - Count open requests

### Maintenance Requests
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request (with auto-fill)
- `GET /api/requests/kanban` - Get kanban board data
- `GET /api/requests/calendar` - Get calendar events
- `PATCH /api/requests/[id]/state` - Update request state
- `DELETE /api/requests/[id]` - Delete request

### Other
- `GET /api/teams` - List maintenance teams
- `GET /api/equipment-categories` - List equipment categories
- `GET /api/departments` - List departments
- `GET /api/employees` - List employees

## Auto-fill Logic

When creating a maintenance request by selecting equipment, the system automatically fills:
- Equipment category
- Maintenance team
- Department
- Responsible employee

## Deployment

This application is self-hostable and requires:
- Node.js runtime
- MySQL database
- Environment variables configured

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- shadcn/ui components
