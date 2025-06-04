import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Shield, Lock, Eye, Database, Users, Mail, Cookie, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb */}
        <div className="bg-neutral-800/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-700/50 dark:border-neutral-800/50">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm sm:text-base text-gray-300" href="/">
                  Go back
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-500 dark:text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-blue-500 dark:text-blue-400 font-medium text-sm sm:text-base">Privacy Policy</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-900/30 dark:bg-blue-950/50 rounded-2xl mb-3 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 dark:from-white dark:to-gray-300 bg-clip-text text-transparent px-2">
            Privacy Policy
          </h1>
          <div className="inline-flex items-center gap-2 bg-green-900/30 dark:bg-green-950/50 text-green-300 dark:text-green-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Effective Date: May 26, 2025
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-neutral-800/90 dark:bg-black/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-neutral-700/50 dark:border-neutral-800/50 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 sm:p-6 border border-blue-800/50 dark:border-blue-700/50">
              <p className="text-base sm:text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                This Privacy Policy explains how <span className="font-semibold text-blue-500 dark:text-blue-400">DuoPlan</span> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, 
                and protects your personal information with the highest standards of security and transparency.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-900/30 dark:bg-emerald-950/50 rounded-lg flex-shrink-0">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 dark:text-white">Information We Collect</h2>
              </div>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-neutral-700/50 dark:bg-neutral-900/70 rounded-lg p-3 sm:p-4 border border-neutral-600 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-100 dark:text-gray-100 text-sm sm:text-base">Account Info</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email address and basic authentication data via Supabase Auth.</p>
                </div>
                <div className="bg-neutral-700/50 dark:bg-neutral-900/70 rounded-lg p-3 sm:p-4 border border-neutral-600 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-100 dark:text-gray-100 text-sm sm:text-base">Usage Data</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Actions taken within the planner (e.g., events, tasks).</p>
                </div>
                <div className="bg-neutral-700/50 dark:bg-neutral-900/70 rounded-lg p-3 sm:p-4 border border-neutral-600 dark:border-neutral-700 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-100 dark:text-gray-100 text-sm sm:text-base">Device Data</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Browser type, IP address, and cookies (if analytics tools are used).</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-900/30 dark:bg-blue-950/50 rounded-lg flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 dark:text-white">How We Use Your Data</h2>
              </div>
              <div className="bg-blue-950/20 dark:bg-blue-950/30 rounded-lg p-4 sm:p-6 border border-blue-800/50 dark:border-blue-700/50">
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  Your data is used to provide and improve the service, authenticate users, and 
                  ensure real-time syncing across devices. <span className="font-semibold text-blue-500 dark:text-blue-400">We do not sell your data.</span>
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-900/30 dark:bg-green-950/50 rounded-lg flex-shrink-0">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 dark:text-white">Data Storage</h2>
              </div>
              <div className="bg-green-950/20 dark:bg-green-950/30 rounded-lg p-4 sm:p-6 border border-green-800/50 dark:border-green-700/50">
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  All data is stored securely in Supabase (PostgreSQL). Row-Level Security (RLS) 
                  is used to ensure only your partner and you can access your shared content.
                </p>
              </div>
            </div>

            {/* Remaining sections in a more compact layout */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              
              {/* Section 4 */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  Third-Party Services
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  We use Supabase for authentication and database services. We may use other 
                  analytics or performance tools in the future, which will be disclosed here.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  Your Rights
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  You have the right to request deletion of your account and data. Please
                  <a href="https://linktr.ee/therandomuser03" className="ml-1 text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted transition-colors">
                    contact us
                  </a>.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                  Cookies
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  DuoPlan may use cookies for authentication and session persistence.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  Changes to This Policy
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  We may update this policy occasionally. Changes will be posted on this page with the updated date.
                </p>
              </div>

            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 dark:from-neutral-900/70 dark:to-neutral-800/70 rounded-xl p-4 sm:p-6 border border-neutral-700 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-white">Contact Us</h2>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm sm:text-base">
                Questions or concerns? Please 
                <a href="https://linktr.ee/therandomuser03" className="ml-1 text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline decoration-dotted transition-colors">
                  contact us
                </a>.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}

      </div>
      <Footer />
    </div>
  );
}