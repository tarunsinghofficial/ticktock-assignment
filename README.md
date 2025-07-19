# Ticktock – Timesheet Management App

A simple SaaS-style Timesheet Management application built with Next.js 15, TypeScript, and TailwindCSS.

## Features

- **Login**: Dummy authentication with email & password (session-based).
- **Dashboard**: View your timesheets in a table (Week #, Date, Status, Actions).
- **Timesheet Detail**: View and add daily tasks for each week.
- **Responsive UI**: Clean, modern, and mobile-friendly.
- **Form Validation**: Alerts for missing required fields.
- **Internal API Routes**: All data is served via Next.js API routes.

## API Routes

All API endpoints are implemented as internal Next.js API routes under `/src/app/api`:

- **`/api/users`**

  - `POST`: Dummy login (returns user and token if credentials are valid)
  - `GET`: Returns all mock users (for demo/testing)

- **`/api/weekly-timesheets`**

  - `GET`: Returns a list of timesheet summaries for the dashboard (filterable by userId/status)
  - `POST`: Create a new timesheet (mock, for extensibility)

- **`/api/detailed-weekly-timesheets`**
  - `GET`: Returns detailed timesheet data for a given week (filterable by timesheetId/userId)
  - `POST`: Create a new detailed timesheet (mock, for extensibility)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

3. **Open in your browser**
   ```
   http://localhost:3000
   ```

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

## Project Structure

- `/src/app` – Main app pages and components
- `/src/utils` – Authentication utilities
- `/src/app/api` – Internal API routes (mock data)

## Assumptions & Notes

- **Authentication** is dummy (no real backend, password is always `"password123"`). (**Example**: Use email as `charlie@example.com` and password as `password123`
- **Session** is stored in `sessionStorage`.
- **API** is fully mocked via Next.js API routes.
- **Add/Edit** for timesheet entries is client-side only (not persisted).
- **No next-auth**: Custom auth logic is used (next-auth is a bonus).
- **No tests**: Testing is optional for this assignment.

## Time Spent

- ~4-6 hours (including UI, API, and polish)

---

**Thank you for reviewing!**
