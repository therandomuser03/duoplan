import { Globe } from "@/components/magicui/globe";
import Link from "next/link";

export default function Error() {
  return (
    <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-white dark:bg-neutral-950 transition-colors">
      <div className="relative text-center items-center pt-16 z-10">
        {/* Position the globe in the background with a lower z-index */}
        <Globe className="absolute inset-0 z-[-1] filter dark:invert" />

        <p className="text-base font-semibold text-neutral-500 dark:text-neutral-300 pb-26">Error 404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-neutral-800 dark:text-neutral-200 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-600 dark:text-gray-400 sm:text-xl/8">
          Sorry, something went wrong. We couldn&apos;t find what you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/"
            className="rounded-md bg-transparent border border-neutral-300 dark:border-neutral-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-800 dark:text-white shadow-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back Home
          </Link>
        </div>
      </div>
    </main>
  );
}