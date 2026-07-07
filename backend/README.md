# Mini ERP System

A full-stack Enterprise Resource Planning (ERP) system built with modern web technologies. Features role-based access control, real-time notifications, and comprehensive business management tools.

---

# Live Demo

- **Frontend:** https://erpclient.krishokai.xyz
- **Backend API:** https://erp-server-krishokai.vercel.app

---

# Features

## Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-Based Access Control (RBAC) with granular permissions
- Protected routes and API endpoints
- Password hashing with bcrypt

## Dashboard

- Real-time business statistics and analytics
- Sales overview and metrics
- Product inventory status
- User activity tracking

## Product Management

- Create, read, update, and delete products
- Image upload with Cloudflare R2 storage
- Product categorization
- Search and pagination
- Stock management

## Category Management

- Organize products into categories
- CRUD operations for categories
- Category-based product filtering

## User Management

- User registration and profile management
- Role assignment (Admin, Manager, Employee)
- User status toggle (active/inactive)
- User listing with search and pagination

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
- **Forms:** React Hook Form v7 with Zod resolver for type-safe validation
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
- npm or yarn

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

# Create environment file
cp .env.example .env

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

# Database
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-erp?retryWrites=true&w=majority

# Authentication
BCRYPT_SALT_ROUNDS=12
ACCESS_TOKEN_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d

# Cloudflare R2 Storage
R2_ACCOUNT_ID=<your-account-id>
R2_BUCKET_NAME=<your-bucket-name>
R2_ACCESS_KEY_ID=<your-access-key>
R2_SECRET_ACCESS_KEY=<your-secret-key>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://<bucket-name>.r2.dev

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=https://your-backend-api-url.com
```

---

# API Documentation

## Postman Collection

Import the Postman collection to explore and test all API endpoints:

**Postman Collection:** [Mini_ERP_API_Collection.postman_collection.json](./Mini_ERP_API_Collection.postman_collection.json)

### Base URL

```
https://erp-server-krishokai.vercel.app/api/v1
```

### Authentication Endpoints

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Endpoints

| Method | Endpoint                   | Description        | Permission  |
| ------ | -------------------------- | ------------------ | ----------- |
| POST   | `/users`                   | Create user        | user.create |
| GET    | `/users`                   | Get all users      | user.read   |
| GET    | `/users/:id`               | Get user by ID     | user.read   |
| PUT    | `/users/:id`               | Update user        | user.update |
| PATCH  | `/users/:id/toggle-status` | Toggle user status | user.delete |

### Product Endpoints

| Method | Endpoint               | Description                 | Permission     |
| ------ | ---------------------- | --------------------------- | -------------- |
| POST   | `/products`            | Create product (with image) | product.create |
| GET    | `/products`            | Get all products            | product.read   |
| GET    | `/products/:id`        | Get product by ID           | product.read   |
| PUT    | `/products/:id`        | Update product (with image) | product.update |
| PATCH  | `/products/:id/delete` | Soft delete product         | product.delete |

### Category Endpoints

| Method | Endpoint          | Description        | Permission      |
| ------ | ----------------- | ------------------ | --------------- |
| POST   | `/categories`     | Create category    | category.create |
| GET    | `/categories`     | Get all categories | category.read   |
| GET    | `/categories/:id` | Get category by ID | category.read   |
| PUT    | `/categories/:id` | Update category    | category.update |

### Sale Endpoints

| Method | Endpoint | Description   | Permission  |
| ------ | -------- | ------------- | ----------- |
| POST   | `/sales` | Create sale   | sale.create |
| GET    | `/sales` | Get all sales | sale.read   |

### Dashboard Endpoints

| Method | Endpoint     | Description              | Permission     |
| ------ | ------------ | ------------------------ | -------------- |
| GET    | `/dashboard` | Get dashboard statistics | dashboard.read |

### Notification Endpoints

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/notifications`          | Get user notifications         |
| PATCH  | `/notifications/:id/read` | Mark notification as read      |
| PATCH  | `/notifications/read-all` | Mark all notifications as read |

---

# User Roles

## Admin

**Full system access with all permissions.**

- Manage all users (create, update, delete, toggle status)
- Manage roles and permissions
- Create and manage products with image upload
- Manage categories
- Create and view sales
- Access dashboard statistics
- View and manage notifications
- Configure system settings

## Manager

**Operational management with limited administrative access.**

- Create and manage products
- Manage categories
- Create and view sales
- Access dashboard statistics
- View notifications
- Manage employees (limited user management)

## Employee

**Basic operational access.**

- View products
- Create sales
- View dashboard (limited)
- View notifications

---

# Default Admin Credentials

**Note:** These are placeholder credentials. Change them immediately after first login.

```
Email: admin@minierp.com
Password: Admin@123
```

---

# Available Scripts

## Backend Scripts

```bash
npm run dev          # Start development server with hot reload (ts-node-dev)
npm run clean        # Clean build directory
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint:check   # Check code with ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run prettier:check  # Check code formatting
npm run prettier:fix    # Format code with Prettier
npm run lint:prettier   # Run both lint and prettier checks
npm run seed:jobs    # Seed database with initial data
```

## Frontend Scripts

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build locally
npm run lint         # Check code with ESLint
npm run format       # Format code with Prettier
```

---

# Production Build

## Backend

```bash
# Build the TypeScript project
npm run build

# This creates a dist/ folder with compiled JavaScript
# Start the production server
npm run start
```

## Frontend

```bash
# Build the React application
npm run build

# This creates a dist/ folder with optimized static files
# Deploy the dist/ folder to your hosting service
```

---

# Deployment

## Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL` = Your backend API URL
4. Deploy automatically on every push

## Backend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables (see Environment Variables section)
4. Vercel will automatically detect and deploy the Express app

## MongoDB (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to backend `.env` as `DATABASE_URL`
5. Configure network access (IP whitelist)
6. Create database user with appropriate permissions

## Cloudflare R2

1. Create a Cloudflare account
2. Navigate to R2 section
3. Create a new bucket
4. Generate API credentials (Access Key ID and Secret Access Key)
5. Configure CORS settings for your domain
6. Add R2 credentials to backend `.env`
7. Set up custom domain for public URL (optional)

---

# Key Features Implementation

## Authentication Flow

1. User logs in with email and password
2. Backend validates credentials and generates JWT tokens
3. Access token stored in localStorage
4. Refresh token used to get new access tokens when expired
5. Protected routes check for valid token before rendering

## Role-Based Access Control

1. Each user is assigned a role (Admin, Manager, Employee)
2. Permissions are defined for each role
3. Backend middleware checks permissions before allowing access
4. Frontend guards hide/show UI elements based on user role
5. API endpoints return 403 Forbidden if user lacks permission

## Form Validation

- React Hook Form used for all form handling (e.g., ProductForm)
- Zod schema validation integrated via `zodResolver`
- Type-safe form values with TypeScript inference
- Real-time error messages displayed to users
- Form state management with `register`, `handleSubmit`, `setValue`, `reset`
- Image file handling with preview before upload

## Image Upload

1. User selects image file in product form
2. Multer middleware handles multipart/form-data
3. Image uploaded to Cloudflare R2 storage
4. Public URL returned and stored in database
5. Image displayed using CDN URL for fast loading

## Real-time Notifications

1. Socket.io server running on backend
2. Client connects via Socket.io client
3. **Trigger:** When a new sale is created, automatic notification is generated
4. **Recipients:** Notifications are sent to Admin and Manager roles via Socket.io
5. Client receives and displays notifications in real-time
6. Notifications persisted in database for history
7. **Access Control:** Only Admin users can view the notifications page (protected by RoleBasedGuard)

---

# Development

## Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits recommended

## Architecture

- Modular architecture with feature-based organization
- Separation of concerns (controllers, services, models)
- Middleware for cross-cutting concerns
- Global error handling
- Consistent API response format

## Database Schema

- User model with role references
- Role and Permission models for RBAC
- Product model with image URL and category reference
- Category model for product organization
- Sale model with product and user references
- Notification model for real-time alerts

---

# Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# Author

**Alamin**

- GitHub: [@alamin00006](https://github.com/alamin00006)
- LinkedIn: [Alamin](https://www.linkedin.com/in/alamin00006/)

---

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Support

For support, email alamin@example.com or create an issue in the GitHub repository.

---

# Roadmap

- [ ] Add inventory management with low-stock alerts
- [ ] Implement barcode scanning for products
- [ ] Add advanced reporting and analytics
- [ ] Export data to PDF/Excel
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Bulk import/export products

---

# Acknowledgments

- [Express.js](https://expressjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) - Object storage
- [Socket.io](https://socket.io/) - Real-time communication

---

<div align="center">
  <p>Built with ❤️ by Alamin</p>
  <p>© 2024 Mini ERP System. All rights reserved.</p>
</div>
