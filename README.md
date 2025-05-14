# DuoPlan

DuoPlan is a collaborative planner designed for couples, helping them stay in sync with shared calendars, notes, and real-time updates.

## Features

- **Shared Calendar**: Keep schedules in sync with real-time updates across devices
- **Integrated Notes**: Attach notes to events or keep standalone shared notes
- **Partner System**: Connect with your partner to share calendars and plans
- **Real-time Updates**: See changes instantly when your partner modifies events
- **Modern UI**: Clean, minimalist interface with dark mode support
- **Multiple Views**: Day, week, and month calendar views

## Tech Stack

- **Frontend**: Next.js (App Router), React
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Calendar**: React Big Calendar
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/duoplan.git
   cd duoplan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Connect to your project using the "Connect to Supabase" button
3. The database schema will be automatically created

## Project Structure

```
duoplan/
├── app/                   # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and features
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Features in Detail

### Authentication
- Email/password authentication
- Protected routes
- User profile management

### Calendar
- Shared calendar events
- Multiple view options
- Real-time updates
- Event details and notes

### Notes
- Shared notes system
- Rich text support
- Real-time collaboration
- Categorization

### Partner System
- Partner invitations
- Shared access management
- Real-time synchronization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Big Calendar](https://github.com/jquense/react-big-calendar)