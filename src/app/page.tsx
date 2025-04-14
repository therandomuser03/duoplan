export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex flex-col items-center gap-12 max-w-7xl mx-auto w-full py-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#ff71be] to-[#ff4d4d] bg-clip-text text-transparent">
            Your Relationship Command Center
            <span className="block text-xl sm:text-2xl font-normal mt-4 text-foreground">
              Designed for couples building life together
            </span>
          </h1>
        </section>

        {/* Features Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="bg-card p-8 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">📅 Shared Life Calendar</h2>
            </div>
            <p className="text-muted-foreground">Sync date nights, anniversaries, and household responsibilities in one view</p>
          </div>
          
          <div className="bg-card p-8 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">🎭 Date Night Planner</h2>
            </div>
            <p className="text-muted-foreground">Plan and organize memorable date nights with suggestions and reminders</p>
          </div>

          <div className="bg-card p-8 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">💬 Private Messaging</h2>
            </div>
            <p className="text-muted-foreground">Secure real-time chat with message reactions and event creation</p>
          </div>

          <div className="bg-card p-8 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">🔒 Sync Securely</h2>
            </div>
            <p className="text-muted-foreground">End-to-end encrypted sync of important dates and shared memories</p>
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="flex gap-4 flex-col sm:flex-row">
          <a
            className="rounded-full bg-foreground text-background px-8 py-3 font-medium hover:opacity-90 transition-opacity"
            href="/login"
          >
            Start Free Trial
          </a>
          <a
            className="rounded-full border border-foreground/10 px-8 py-3 font-medium hover:bg-foreground/5 transition-colors"
            href="/pairing"
          >
            Connect Accounts
          </a>
        </section>
      </main>

      <footer className="flex gap-8 items-center justify-center py-6 border-t">
        <a className="hover:text-primary transition-colors" href="/calendar">
          Our Calendar
        </a>
        <a className="hover:text-primary transition-colors" href="/chat">
          Shared Chat
        </a>
        <a className="hover:text-primary transition-colors" href="/memories">
          Memories
        </a>
      </footer>
    </div>
  );
}
