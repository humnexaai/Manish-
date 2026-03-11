import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-primary/20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
