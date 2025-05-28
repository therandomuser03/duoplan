export default function PrivacyPage() {
  return (
    <div className="prose mx-auto p-6">
      <h1>Privacy Policy</h1>
      <p>Effective Date: May 26, 2025</p>

      <p>This Privacy Policy explains how DuoPlan (&quotwe&quot, &quotour&quot, &quotus&quot) collects, uses, and protects your personal information.</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account Info:</strong> Email address and basic authentication data via Supabase Auth.</li>
        <li><strong>Usage Data:</strong> Actions taken within the planner (e.g., events, notes).</li>
        <li><strong>Device Data:</strong> Browser type, IP address, and cookies (if analytics tools are used).</li>
      </ul>

      <h2>2. How We Use Your Data</h2>
      <p>Your data is used to provide and improve the service, authenticate users, and ensure real-time syncing across devices. We do not sell your data.</p>

      <h2>3. Data Storage</h2>
      <p>All data is stored securely in Supabase (PostgreSQL). Row-Level Security (RLS) is used to ensure only your partner and you can access your shared content.</p>

      <h2>4. Third-Party Services</h2>
      <p>We use Supabase for authentication and database services. We may use other analytics or performance tools in the future, which will be disclosed here.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to request deletion of your account and data. Please email support@duoplan.app (or your actual support address).</p>

      <h2>6. Cookies</h2>
      <p>DuoPlan may use cookies for authentication and session persistence.</p>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this policy occasionally. Changes will be posted on this page with the updated date.</p>

      <h2>8. Contact</h2>
      <p>Questions or concerns? Email us at support@duoplan.app.</p>
    </div>
  );
}
