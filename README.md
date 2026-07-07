# Mini ERP System

---

# Live Demo

- **Frontend:** https://erpclient.krishokai.xyz/login
- **Backend API:** https://erpserver.krishokai.xyz/api/v1

---

# Features

## Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-Based Access Control (RBAC) with granular permissions
- Protected routes and API endpoints
- Password hashing with bcrypt

## Dashboard

- Real-time business statistics and analytics
- Sales overview

## Product Management

- Create, read, update, and delete products
- Image upload with Cloudflare R2 storage
- Product categorization
- Search and pagination
- Stock management

## Category Management

- Organize products into categories
- CRUD operations for categories

## User Management

- User create
- Role assignment (Admin, Manager, Employee)
- User status toggle (active/inactive)

## Sales Management

- Create and track sales
- Sales history and records
- Sales analytics

## Notifications

- Real-time notifications using Socket.io
- Automatic notifications triggered on sale creation
- Notifications sent to Admin
- Mark notifications as read
- Bulk notification read
- **Admin-only access** to notifications page in UI

## UI/UX Features

- Responsive design for all devices
- Role-based UI rendering
- Global error handling
- Loading states and optimistic updates
- Modern, clean interface with Tailwind CSS

---

# Tech Stack

## Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit with RTK Query
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI, ShadCN
- **Forms:** React Hook Form with Zod resolver for type-safe validation
- **Real-time:** Socket.io Client
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Backend

- **Runtime:** Node.js with Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **File Upload:** Multer with Cloudflare R2
- **Real-time:** Socket.io
- **Security:** bcrypt for password hashing, CORS enabled

## Database

- **MongoDB Atlas** - Cloud-hosted MongoDB database

## Authentication

- JWT-based authentication
- Access and refresh token strategy
- Role-based permission system

## State Management

- Redux Toolkit for global state
- RTK Query for API state management and caching
- Optimistic updates and cache invalidation

## Storage

- **Cloudflare R2** - S3-compatible object storage for product images

## Deployment

- **Frontend:** Vercel
- **Backend:** Vercel Serverless Functions
- **Database:** MongoDB Atlas
- **Storage:** Cloudflare R2

---

# Installation

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudflare R2 account (for image storage)
- npm

## Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see Environment Variables section)

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install


# Configure environment variables (see Environment Variables section)

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

# Environment Variables

## Backend (.env)

```env
# Server Configuration
PORT=5000

DATABASE_URL=mongodb+srv://Alamin:ZnEUylHANPiysG7L@cluster0.scp6egc.mongodb.net/mini-erp?retryWrites=true&w=majority

BCRYPT_SALT_ROUNDS=12
ACCESS_TOKEN_SECRET=super_secret_key
REFRESH_TOKEN_SECRET=super_refresh_secret_key
JWT_EXPIRES_IN=5s
REFRESH_TOKEN_EXPIRES_IN=30d

# Cloudflare R2
R2_ACCOUNT_ID=1d1068d87ceebb37e6fdf3117db5e7cf
R2_BUCKET_NAME=alamin

R2_ACCESS_KEY_ID=ad958e6f2ac18f0ef6a0a76a6a6843c0
R2_SECRET_ACCESS_KEY=6bc9bfe6cf995cdffc656520ed578eb74d826e551adf5deffd3d2caf9c7e0b19

R2_ENDPOINT=https://1d1068d87ceebb37e6fdf3117db5e7cf.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-90e1143646384f89b5066855ab6946af.r2.dev

ALLOWED_ORIGINS=https://erpclient.krishokai.xyz,http://localhost:5173

# Cookie settings
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax
```

## Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

# API Documentation

## Postman Collection

Import the Postman collection to explore and test all API endpoints:

**Postman Collection:** [postman_documentation.json](./postman_documentation.json)

### Base URL

```

```
