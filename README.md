# Meal Management System

A full-stack web application using the MVC architecture for managing flatmate meal tracking and bazar expenses.

## Project Structure

- `backend/`
  - `server.js` — Express server entry point.
  - `config/db.js` — MongoDB connection setup.
  - `models/` — Mongoose models: `User`, `Meal`, `Bazar`.
  - `controllers/` — Business logic for auth, meals, bazar, and dashboard.
  - `routes/` — API endpoints for auth, meals, bazar, and dashboard.
  - `middleware/` — Auth protection and error handling.
  - `.env.example` — Example environment variables.

- `frontend/`
  - `package.json` — Vite + React + Tailwind setup.
  - `index.html` — App root.
  - `src/` — React app.
    - `App.jsx` — Main navigation and page selection.
    - `context/AuthContext.jsx` — Authentication state and token storage.
    - `api.js` — HTTP helpers for backend API.
    - `components/` — Login, signup, dashboard, meal table, summary cards, bazar form.
    - `styles/index.css` — Tailwind CSS utilities.

## Technologies

- Frontend: React, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB, Mongoose
- Architecture: MVC
- Auth: JWT-based login/signup

## How it works

- Users sign up or log in.
- Each user has meal records per date with lunch and dinner values.
- Admin users can add bazar items and edit all expenses.
- Dashboard calculates total meals, total bazar cost, meal rate, and per-user cost.
- Meal table shows a spreadsheet-style view across dates and users.

## Run locally

### Root workspace install and run

From the project root:

```bash
npm run bootstrap
npm run dev
```

This installs both `backend` and `frontend` dependencies and starts both servers together.

### Or start each app separately

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create `backend/.env` from `.env.example` and set your MongoDB connection.

3. (Optional) Seed sample users and meals:

```bash
npm run seed
```

4. Start backend server:

```bash
npm run dev
```

5. In a second terminal, start frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

5. Start frontend app:

```bash
npm run dev
```

6. Open the URL provided by Vite (usually `http://localhost:5173`).

## Notes

- The backend follows MVC: models define data, controllers implement logic, and routes expose REST endpoints.
- Users can only update their own meals.
- Admin-only routes protect bazar creation and user listing.
- The frontend shows a dynamic dashboard with meals and summary cards.
