⚙️ GearGuard – Maintenance Tracker

GearGuard is a full-stack maintenance management system built with Next.js and MySQL, designed to streamline equipment maintenance workflows in teams and organizations.
It provides a modern Kanban-based interface, preventive maintenance scheduling, and role-based collaboration with real-time updates.

🌐 Live Demo:
https://v0-gear-guard-maintenance-tracker-bay.vercel.app/

🚀 Features

🔐 Secure user authentication (login & signup)

📋 Kanban board for tracking maintenance requests

🛠️ Equipment inventory management

📆 Calendar view for preventive maintenance

👥 Team-based workflow and responsibility assignment

⚡ Real-time updates for request status changes

🗄️ MySQL database with Prisma ORM

🤖 Smart auto-fill logic for faster request creation

🧩 Tech Stack

Framework: Next.js 16 (App Router)

Frontend: React 19, TypeScript

Styling: Tailwind CSS, shadcn/ui

Backend: Next.js API Routes

Database: MySQL

ORM: Prisma

Deployment: Vercel

📦 Prerequisites

Make sure you have the following installed:

Node.js 18 or higher

MySQL database

⚙️ Setup Instructions
1️⃣ Install Dependencies
npm install

2️⃣ Configure Environment Variables

Create a .env file in the root directory:

DATABASE_URL="mysql://user:password@localhost:3306/gearguard"


Replace the credentials with your MySQL configuration.

3️⃣ Set Up the Database
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

4️⃣ Run the Development Server
npm run dev


Open http://localhost:3000
 in your browser 🎉

🔑 Demo Credentials

Use the following credentials to explore the application:

Email: john@example.com

Password: password123

🗃️ Database Schema Overview

The application is structured around these core tables:

maintenance_teams – Maintenance teams

departments – Organizational departments

employees – Authenticated users

equipment_categories – Equipment classification

equipment – Equipment inventory

maintenance_requests – Maintenance work orders

work_centers – Optional operational units

🔌 API Endpoints
Authentication

POST /api/auth/login – User login

POST /api/auth/signup – User registration

POST /api/auth/logout – User logout

GET /api/auth/me – Get current user

Equipment

GET /api/equipment – List all equipment

POST /api/equipment – Add new equipment

GET /api/equipment/[id] – Equipment details

GET /api/equipment/[id]/open-requests-count – Open request count

Maintenance Requests

GET /api/requests – List requests

POST /api/requests – Create request (auto-filled)

GET /api/requests/kanban – Kanban board data

GET /api/requests/calendar – Calendar events

PATCH /api/requests/[id]/state – Update request status

DELETE /api/requests/[id] – Delete request

Other Resources

GET /api/teams – Maintenance teams

GET /api/equipment-categories – Equipment categories

GET /api/departments – Departments

GET /api/employees – Employees

🤖 Auto-Fill Logic

When a maintenance request is created by selecting equipment, GearGuard automatically fills:

Equipment category

Assigned maintenance team

Department

Responsible employee

This reduces manual input and improves consistency.

🚢 Deployment Notes

GearGuard is fully self-hostable. You will need:

Node.js runtime

MySQL database

Proper environment variable configuration
