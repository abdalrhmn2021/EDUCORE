# EduCore — University Management System

🔗 **Live demo:** [educore-wine.vercel.app](https://educore-wine.vercel.app)

A full-stack university management system with role-based dashboards for admins, professors, and students — course management, enrollment, grading, campus events, and notifications.

> Built as part of a mentorship-guided learning path (developed alongside an online mentor), then independently debugged, refactored, and deployed.

## Features

- **Authentication** — JWT-based sessions (`jose`, Edge-compatible) with httpOnly cookies, role-based access control enforced via Next.js middleware
- **Admin dashboard** — user management, platform-wide stats
- **Professor dashboard** — create courses, add course materials, view enrolled students, grade students
- **Student dashboard** — browse and enroll in courses, view grades and materials
- **Campus life** — university events feed
- **Notifications** — per-user notification system

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [jose](https://github.com/panva/jose) for JWT (Edge Runtime compatible)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev) for validation
- [React Hook Form](https://react-hook-form.com)
- Deployed on [Vercel](https://vercel.com)

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

Note: the UI is fully in Arabic (RTL).
