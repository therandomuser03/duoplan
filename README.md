
# DuoPlan

**DuoPlan** is a minimalist, real-time shared planner designed for two people. Collaborate on schedules, notes, and plans — all in one intuitive interface.

---

## ✨ Features

- 🗓 **Shared Calendar** — Add and sync events with your partner
- 📝 **Collaborative Notes** — Attach rich notes to events or create stand-alone entries
- 👥 **Partner Spaces** — Securely connect with a partner for seamless collaboration
- 🔄 **Real-Time Updates** — Instantly reflect changes across devices
- 🌗 **Modern UI** — Clean, responsive design with dark mode
- 🔐 **Authentication** — Powered entirely by [Supabase Auth](https://supabase.com/auth)

---

## 🧱 Tech Stack

| Layer         | Tech                      |
|---------------|---------------------------|
| Framework     | [Next.js](https://nextjs.org/) (App Router) |
| Styling       | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com) |
| Backend & DB  | [Supabase](https://supabase.com/) (Postgres + RLS) |
| Auth          | Supabase Auth             |
| State         | React Hooks               |
| Charts & UI   | Lucide, Framer Motion, Recharts |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js v18 or higher
- Supabase account
- Git & your favorite package manager (npm or pnpm)

### 2. Clone the Repo

```bash
git clone https://github.com/yourusername/duoplan.git
cd duoplan
````

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # only used server-side
```

### 5. Start the Dev Server

```bash
npm run dev
```

---

## 🧪 Database Setup

1. Create a new Supabase project
2. Copy and run the SQL from `database/schema.sql` in the Supabase SQL editor
3. Enable **Row-Level Security (RLS)** on all tables
4. Verify policies match your needs (already included in `schema.sql`)

---

## 🗂 Project Structure

```
duoplan/
├── app/                # App Router pages (Next.js)
│   ├── dashboard/      # Main dashboard (auth required)
│   ├── login/          # Supabase login page
│   ├── api/            # Server-side endpoints
│   └── layout.tsx      # Root layout with providers
├── components/         # Reusable UI components
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

```
