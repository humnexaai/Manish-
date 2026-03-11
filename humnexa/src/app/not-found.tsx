import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg-light px-4 dark:bg-brand-bg-dark">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-2xl font-bold text-white">
          H
        </div>
        <h1 className="text-3xl font-bold text-brand-text-light dark:text-brand-text-dark">Page Not Found</h1>
        <p className="mt-2 text-sm text-brand-text-secondary">The page you are looking for does not exist.</p>
        <div className="mt-5">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
