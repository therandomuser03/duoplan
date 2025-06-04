import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText, Users, UserCheck, Shield, Database, AlertTriangle, RefreshCw, Mail, CalendarDays, ClipboardList } from "lucide-react";

export default function TermsPage() {
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
                <BreadcrumbLink className="text-purple-500 dark:text-purple-400 font-medium text-sm sm:text-base">Terms of Service</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-900/30 dark:bg-purple-950/50 rounded-2xl mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 dark:text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 dark:from-white dark:to-gray-300 bg-clip-text text-transparent px-2">
            Terms of Service
          </h1>
          <div className="inline-flex items-center gap-2 bg-purple-900/30 dark:bg-purple-950/50 text-purple-300 dark:text-purple-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Effective Date: June 04, 2025
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-neutral-800/90 dark:bg-black/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-neutral-700/50 dark:border-neutral-800/50 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            
            {/* Introduction */}
            <div className="bg-gradient-to-r from-purple-950/20 to-pink-950/20 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 sm:p-6 border border-purple-800/50 dark:border-purple-700/50">
              <p className="text-base sm:text-lg text-gray-400 dark:text-gray-300 leading-relaxed">
                Welcome to <span className="font-semibold text-purple-500 dark:text-purple-400">DuoPlan</span>. By accessing or using our web application (&quot;Service&quot;), 
                you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not 
                agree to these Terms, please do not use the Service.
              </p>
            </div>

            {/* Section 1 - Service Description */}
<div className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-900/30 dark:bg-amber-950/50 rounded-lg flex-shrink-0">
      <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400" />
    </div>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 dark:text-white">Description of Service</h2>
  </div>
  <div className="bg-amber-950/20 dark:bg-amber-950/30 rounded-lg p-4 sm:p-6 border border-amber-800/50 dark:border-amber-700/50">
    <div className="flex items-start gap-3">
      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400 mt-1 flex-shrink-0" />
      <p className="text-gray-400 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
        <span className="font-semibold text-amber-500 dark:text-amber-400">DuoPlan</span> is a minimalist, real-time shared planner designed for two people. 
        Users can collaborate through shared calendars, notes, and plans via a secure 
        and responsive interface.
      </p>
    </div>
  </div>
</div>


            {/* Key Terms Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              
              {/* Section 2 - Eligibility (NOW WITH BLUE/INDIGO THEME) */}
              <div className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 sm:p-6 border border-blue-800/50 dark:border-blue-700/50">
                <div className="flex items-center gap-3 mb-3">
                  {/* UserCheck icon now uses blue theme colors */}
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Eligibility</h2>
                </div>
                <p className="text-gray-400 dark:text-gray-300 text-sm leading-relaxed">
                  You must be at least {/* Span now uses blue theme for background/text */}
                  <span className="font-semibold bg-blue-900/50 dark:bg-blue-800/70 px-2 py-1 rounded text-blue-300 dark:text-blue-200">
                    13 years old
                  </span> to use DuoPlan. By using the Service, you 
                  represent that you meet this requirement.
                </p>
              </div>

              {/* Section 3 - Account Registration (NOW WITH GREEN/EMERALD THEME) */}
              <div className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 sm:p-6 border border-green-800/50 dark:border-green-700/50">
                <div className="flex items-center gap-3 mb-3">
                  {/* Users icon now uses green theme colors */}
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Account Registration</h2>
                </div>
                <p className="text-gray-400 dark:text-gray-300 text-sm leading-relaxed">
                  Accounts are created and authenticated using {/* Span now uses green theme for text */}
                  <span className="font-semibold text-green-500 dark:text-green-400">
                    Supabase Auth
                  </span>. You are responsible 
                  for maintaining the security of your credentials.
                </p>
              </div>

            </div>

            {/* Section 4 - Acceptable Use */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-orange-900/30 dark:bg-orange-950/50 rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 dark:text-white">Acceptable Use</h2>
              </div>
              <div className="bg-orange-950/20 dark:bg-orange-950/30 rounded-lg p-4 sm:p-6 border border-orange-800/50 dark:border-orange-700/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-3 text-sm sm:text-base">
                      You agree not to misuse the Service. This includes, but is not limited to:
                    </p>
                    <div className="grid gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-500 dark:text-gray-400">Interfering with other users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-500 dark:text-gray-400">Uploading malicious content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-500 dark:text-gray-400">Attempting to access unauthorized areas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              
              {/* Section 5 - Data & Privacy */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Data & Privacy</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  We collect and process your data as described in our 
                  <a href="/privacy" className="ml-1 text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-dotted transition-colors">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              {/* Section 6 - Termination */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Termination</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  We reserve the right to suspend or terminate your access to the Service if 
                  you violate these Terms.
                </p>
              </div>

              {/* Section 7 - Changes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Changes to Terms</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  We may update these Terms from time to time. Changes will be posted on this 
                  page with an updated effective date.
                </p>
              </div>

              {/* Section 8 - Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 dark:text-gray-100">Contact</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  If you have any questions, please 
                  <a href="https://linktr.ee/therandomuser03" className="ml-1 text-green-500 hover:text-green-400 dark:text-green-400 dark:hover:text-green-300 font-medium underline decoration-dotted transition-colors">
                    contact us
                  </a>.
                </p>
              </div>

            </div>

            {/* Agreement Notice */}
            <div className="bg-gradient-to-r from-purple-950/20 via-pink-950/20 to-purple-950/20 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-purple-950/30 rounded-xl p-4 sm:p-6 border border-purple-800/50 dark:border-purple-700/50">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-purple-900/50 dark:bg-purple-800/70 rounded-full flex-shrink-0">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 dark:text-gray-100 mb-1 text-sm sm:text-base">Agreement</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    By using DuoPlan, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}