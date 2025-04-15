# HeartSync

A shared calendar and chat application for couples to stay connected and organized.

## Features

- **Shared Calendar**: Create and manage events together
- **Real-time Chat**: Stay connected with instant messaging
- **Partner Connection**: Easy partner code system for quick setup
- **Responsive Design**: Works seamlessly on all devices
- **Secure Authentication**: Built with Supabase Auth

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/heartsync.git
   cd heartsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/supabase/schema.sql`
   - Enable the following Supabase features:
     - Authentication
     - Database
     - Realtime

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── calendar/          # Calendar feature
│   ├── chat/             # Chat feature
│   └── connect/          # Partner connection
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
│   └── supabase/         # Supabase setup and schema
└── styles/               # Global styles
```

## API Documentation

### Authentication

- **Sign Up**: `/auth/signup`
- **Login**: `/auth/login`
- **Logout**: Handled automatically by Supabase

### Calendar API

- **Create Event**: POST `/api/events`
- **Get Events**: GET `/api/events`
- **Update Event**: PUT `/api/events/:id`
- **Delete Event**: DELETE `/api/events/:id`

### Chat API

- **Send Message**: POST `/api/messages`
- **Get Messages**: GET `/api/messages`
- **Get Conversations**: GET `/api/conversations`

## Database Schema

### Users Table
```sql
id: uuid (primary key)
email: string
full_name: string
created_at: timestamp
```

### Pairs Table
```sql
id: uuid (primary key)
user1_id: uuid (foreign key)
user2_id: uuid (foreign key)
created_at: timestamp
```

### Events Table
```sql
id: uuid (primary key)
title: string
description: text
start_time: timestamp
end_time: timestamp
user_id: uuid (foreign key)
created_at: timestamp
```

### Messages Table
```sql
id: uuid (primary key)
content: text
sender_id: uuid (foreign key)
receiver_id: uuid (foreign key)
created_at: timestamp
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@heartsync.app or open an issue in the repository.
