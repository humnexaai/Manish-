import Link from "next/link";
import { Brain, Code, FileText, Globe, GraduationCap, MessageSquare, Sparkles, Zap } from "lucide-react";
import { APP_NAME, PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const features = [
    { title: "AI Chat", description: "Chat in Hindi, English, or any language. 8 AI modes for every need.", icon: MessageSquare },
    { title: "Documents", description: "GST invoices, RTI applications, legal notices — generated in seconds.", icon: FileText },
    { title: "Exam Prep", description: "UPSC, SSC, JEE prep with AI tutor, quizzes, and study plans.", icon: GraduationCap },
    { title: "Code", description: "Write, debug, and optimize code in 20+ programming languages.", icon: Code },
    { title: "Research", description: "Deep research with AI — get comprehensive analysis on any topic.", icon: Globe },
    { title: "Creative", description: "Coming Soon — Image, video, and audio generation.", icon: Brain },
  ];

  const steps = [
    { title: "Sign up in 10 seconds", icon: Zap },
    { title: "Tell Humnexa what you need in Hindi or English", icon: MessageSquare },
    { title: "Get instant results — documents, answers, code, study material", icon: Sparkles },
  ];

  return (
    <main className="min-h-screen bg-brand-bg-light text-brand-text-light dark:bg-brand-bg-dark dark:text-brand-text-dark">
      <header className="sticky top-0 z-20 border-b border-brand-border-light bg-white/90 backdrop-blur dark:border-brand-border-dark dark:bg-brand-bg-dark/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary font-bold text-white">H</span>
            <span className="font-semibold">{APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-brand-text-secondary md:flex">
            <a href="#features" className="hover:text-brand-primary">Features</a>
            <a href="#pricing" className="hover:text-brand-primary">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 text-center">
        <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-brand-border-light bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary dark:border-brand-border-dark">
          🇮🇳 Made in India | Powered by Own AI
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          India&apos;s First Hindi-First AI Platform
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-brand-text-secondary">
          One chat interface for documents, code, exam prep, and everything you need. Powered by our own AI — no foreign dependency.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup"><Button size="lg">Start Free →</Button></Link>
          <Link href="/pricing"><Button variant="outline" size="lg">See Pricing</Button></Link>
        </div>
        <p className="mt-3 text-xs text-brand-text-secondary">
          No credit card required • Free forever plan • Hindi-first AI
        </p>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-center text-2xl font-semibold">Features</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hover>
                <div className="mb-2 inline-flex rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-brand-text-secondary">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-center text-2xl font-semibold">How It Works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-1 text-xs font-semibold text-brand-primary">Step {idx + 1}</p>
                <p className="text-sm text-brand-text-secondary">{step.title}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-center text-2xl font-semibold">Pricing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={plan.id === "plus" ? "border-brand-primary ring-1 ring-brand-primary/40" : ""}
              header={
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold">
                    {plan.price_monthly === 0 ? "Free" : `₹${plan.price_monthly}`}
                    <span className="text-sm font-normal text-brand-text-secondary">/month</span>
                  </p>
                </div>
              }
              footer={
                <Link href="/signup">
                  <Button fullWidth variant={plan.id === "plus" ? "primary" : "outline"}>
                    Get Started
                  </Button>
                </Link>
              }
            >
              <ul className="space-y-2 text-sm text-brand-text-secondary">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-border-light px-4 py-8 dark:border-brand-border-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-brand-text-secondary md:flex-row">
          <div>
            <p className="font-semibold text-brand-text-light dark:text-brand-text-dark">{APP_NAME} AI</p>
            <p>PLATINUMGOLD Partnership Firm</p>
            <p>© 2026 Humnexa AI. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-brand-primary">About</Link>
            <Link href="/contact" className="hover:text-brand-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-primary">Terms</Link>
            <Link href="/blog" className="hover:text-brand-primary">Blog</Link>
          </div>
          <p className="rounded-full bg-brand-primary/10 px-3 py-1 font-medium text-brand-primary">Made in India 🇮🇳</p>
        </div>
      </footer>
    </main>
  );
}
