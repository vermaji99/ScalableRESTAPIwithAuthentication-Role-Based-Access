# Task Manager API & Glassmorphism UI (MongoDB Refactor)

This project is a high-performance Node.js Express backend and React frontend, refactored from PostgreSQL/Prisma to MongoDB/Mongoose. It features a modern, responsive Glassmorphism UI.

## 🚀 How to Test the Project

To see the role-based differences in the dashboard, please use the following seeded credentials:

### 1. Admin Login (Full Access)
- **Email**: `admin@example.com`
- **Password**: `password123`
- **What to expect**: 
  - You will see the **Admin Console**.
  - Access to two columns: **System Tasks** (all tasks in the DB) and **System Users** (list of all users).
  - Ability to delete any task or any user from the system.

### 2. Regular User Login (Personal Access)
- **Email**: `user1@example.com`
- **Password**: `password123`
- **What to expect**:
  - You will see the **User Dashboard**.
  - Simplified view showing only your own tasks.
  - No access to the user management list.

---

## 🛠️ Features
- **Modern UI**: Full Glassmorphism theme with responsive design.
- **Authentication**: JWT-based login and registration with password hashing (bcrypt).
- **Role-Based Access**: Strict separation between `Admin` and `User` roles at both API and UI levels.
- **Task Management**: Full CRUD for tasks (Title, Description, Owner).
- **User Management**: Admin-only ability to manage system users.
- **Scalable Architecture**: Modular service-based structure with MongoDB/Mongoose.
- **API Docs**: Fully documented via Swagger.

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   # Root (Backend)
   npm install
   
   # Frontend
   cd apps/web
   npm install
   cd ../..
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory (see `.env.example`):
   ```env
   PORT=4002
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_ACCESS_SECRET=your_secret_key
   ```

3. **Seed Database** (Highly Recommended for Testing):
   ```bash
   npm run seed
   ```

4. **Run the Project**:
   ```bash
   # Start Backend (on port 4002)
   npm run dev
   
   # Start Frontend (on port 5173)
   cd apps/web
   npm run dev
   ```

## 🔗 Project Links
- **Frontend UI**: [http://localhost:5173/](http://localhost:5173/)
- **API Documentation**: [http://localhost:4002/api-docs](http://localhost:4002/api-docs)

## 📁 Folder Structure
- `src/controllers`: Request handlers
- `src/models`: Mongoose models and validation schemas
- `src/services`: Core business logic
- `apps/web`: React frontend with Glassmorphism UI
- `src/utils/seed.js`: Database seeding script for easy evaluation
