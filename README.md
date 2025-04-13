# HeartSync

![HeartSync Logo](https://img.shields.io/badge/HeartSync-Connecting%20Couples-ff69b4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

HeartSync is a shared planner and real-time chat application designed specifically for couples. It enables partners to manage their schedules, view each other's events, and communicate seamlessly—all in one place.

## ✨ Features

### 📅 Shared Calendar & Daily Planner
- Create, edit, and delete events with intuitive controls
- Toggle event visibility (private or shared with your partner)
- View your schedule in monthly, weekly, or daily layouts
- Set reminders and recurring events

### 💬 Real-time Chat
- Exchange messages instantly using Socket.IO
- Access complete chat history with search functionality
- Share images and attachments
- React to messages with emojis

### 🔒 User Authentication
- Secure account creation and login via NextAuth.js
- Partner pairing system with verification
- Privacy controls for shared content

### 🎨 Modern UI/UX
- Clean, responsive design built with Tailwind CSS and shadcn/ui
- Dark mode and customizable themes
- Smooth transitions and animations via Magic UI and Framer Motion

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Magic UI
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO

### Infrastructure
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0 or later)
- [npm](https://www.npmjs.com/) (v8.0 or later) or [Yarn](https://yarnpkg.com/)
- PostgreSQL database

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/therandomuser03/heartsync.git
   cd heartsync
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the project root with the following:

   ```env
   # Database
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/heartsync

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key

   # Optional: OAuth providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Initialize the database:**

   ```bash
   npx prisma db push
   # or
   yarn prisma db push
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

### Account Setup
1. Create an account or sign in
2. Link with your partner using their email or a unique invitation code
3. Confirm the connection to establish your shared space

### Calendar Management
- Switch between different calendar views using the view selector
- Click on any day to add a new event or view existing ones
- Toggle the visibility filter to see your events, your partner's events, or both

### Chat Features
- Access the chat interface through the messaging icon
- Send messages, emojis, and attachments
- View read receipts and typing indicators

## 🤝 Contributing

We welcome contributions to HeartSync! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **GitHub Issues**: For bug reports and feature requests
- **Email**: [anubhabpal1@gmail.com](mailto:anubhabpal1@gmail.com)
- **Twitter**: [@TheRandomUser03](https://twitter.com/TheRandomUser03)

---

Made with ❤️ for couples who share more than just love
