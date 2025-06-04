# DuoPlan

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**DuoPlan** is a minimalist, real-time shared planner designed for two people. Collaborate on schedules, notes, and plans — all in one intuitive interface.

![DuoPlan Preview](public/preview.png)

## ✨ Features

### Core Features
- 🗓 **Shared Calendar** — Add and sync events with your partner
  - Create, edit, and delete events
  - Set reminders and notifications
  - Color-code events by category
  - View events in daily, weekly, or monthly format

- 📝 **Collaborative Notes** — Attach rich notes to events or create stand-alone entries
  - Rich text formatting
  - Attach images and files
  - Real-time collaborative editing
  - Version history

- 👥 **Partner Spaces** — Securely connect with a partner for seamless collaboration
  - One-to-one partner connection
  - Customizable partner settings
  - Privacy controls
  - Activity logs

- 🔄 **Real-Time Updates** — Instantly reflect changes across devices
  - WebSocket-based real-time sync
  - Offline support with local caching
  - Conflict resolution
  - Cross-device synchronization

### User Experience
- 🌗 **Modern UI** — Clean, responsive design with dark mode
  - Intuitive navigation
  - Mobile-first design
  - Keyboard shortcuts
  - Accessibility features

- 🔐 **Authentication** — Powered entirely by [Supabase Auth](https://supabase.com/auth)
  - Email/password authentication
  - Social login options
  - Two-factor authentication
  - Session management

## 🧱 Tech Stack

| Layer         | Tech                      | Purpose                                    |
|---------------|---------------------------|--------------------------------------------|
| Framework     | [Next.js](https://nextjs.org/) (App Router) | Server-side rendering, routing, and API routes |
| Styling       | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com) | Utility-first CSS and component library |
| Backend & DB  | [Supabase](https://supabase.com/) (Postgres + RLS) | Database, real-time subscriptions, and storage |
| Auth          | Supabase Auth             | User authentication and authorization      |
| State         | React Hooks               | Client-side state management               |
| Charts & UI   | Lucide, Framer Motion, shadcn/UI, Magic UI | Icons, animations, and data visualization |

## 🚀 Getting Started

### 1. Prerequisites

- Node.js v18 or higher
- Supabase account
- Git & your favorite package manager (npm or pnpm)
- Basic knowledge of React and TypeScript

### 2. Clone the Repo

```bash
git clone https://github.com/therandomuser03/duoplan.git
cd duoplan
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # only used server-side
(for other keys check the `.env.example` file)
# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 5. Start the Dev Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## 🧪 Database Setup

1. Create a new Supabase project
2. Copy and run the SQL from `database/schema.sql` in the Supabase SQL editor
3. Enable **Row-Level Security (RLS)** on all tables
4. Verify policies match your needs (already included in `schema.sql`)

### Database Schema Overview

```sql
-- Key tables
users
  - id (uuid)
  - email (text)
  - created_at (timestamp)

partnerships
  - id (uuid)
  - user1_id (uuid)
  - user2_id (uuid)
  - status (text)

events
  - id (uuid)
  - partnership_id (uuid)
  - title (text)
  - description (text)
  - start_time (timestamp)
  - end_time (timestamp)
```

## 🗂 Project Structure

```
duoplan/
├── app/                # App Router pages (Next.js)
│   ├── dashboard/      # Main dashboard (auth required)
│   ├── login/          # Supabase login page
│   ├── api/            # Server-side endpoints
│   └── layout.tsx      # Root layout with providers
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   ├── forms/         # Form components
│   └── features/      # Feature-specific components
├── lib/                # Supabase clients, utils
├── hooks/              # Custom React hooks
├── database/           # SQL schema & DB types
├── styles/             # Global styles
└── public/             # Static files (images, icons)
```

---

## 🔐 Authentication

This project uses **Supabase Auth** with `@supabase/auth-helpers-nextjs`.

To protect routes:

* Use `createServerComponentClient()` in server components
* Use `useSession()` or `useUser()` on the client

---

## 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 📬 Acknowledgments

* [Supabase](https://supabase.com/)
* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Lucide](https://lucide.dev/)

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure your Supabase environment variables are correctly set
   - Check if your Supabase project is active and running
   - Verify that email confirmations are properly configured

2. **Real-time Updates Not Working**
   - Check your WebSocket connection status
   - Verify that you're using the latest version of the app
   - Ensure your browser supports WebSocket connections

3. **Database Connection Issues**
   - Verify your database credentials
   - Check if your IP is whitelisted in Supabase
   - Ensure RLS policies are properly configured

### Getting Help

- Open an issue on GitHub
- Check the [Supabase documentation](https://supabase.com/docs)
- Join our [Discord community](https://discord.gg/duoplan)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

```
