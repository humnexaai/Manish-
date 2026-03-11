import Link from "next/link";
import { Brain, Code, FileText, Globe, GraduationCap, MessageSquare } from "lucide-react";
import { APP_NAME, APP_TAGLINE, PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const features = [
    { title: "AI Chat", description: "Smart multilingual assistant for daily tasks.", icon: MessageSquare },
    { title: "Documents", description: "Summaries, Q&A, and insights from files.", icon: FileText },
    { title: "Exam Prep", description: "Concepts, quizzes, and revision plans.", icon: GraduationCap },
    { title: "Code", description: "Generate, debug, and explain code faster.", icon: Code },
    { title: "Search", description: "Web-aware responses with latest context.", icon: Globe },
    { title: "Creative", description: "Ideas, writing, and brainstorming support.", icon: Brain },
  ];

  return (
    <main className="min-h-screen bg-brand-bg-light text-brand-text-light dark:bg-brand-bg-dark dark:text-brand-text-dark">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 text-center">
        <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-brand-border-light bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary dark:border-brand-border-dark">
          {APP_NAME} AI
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          India&apos;s First Hindi-First AI Platform
        </h1>
        <p className="mt-3 text-lg text-brand-text-secondary">{APP_TAGLINE}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup">
            <Button size="lg">Start Free</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              See Pricing
            </Button>
          </Link>
        </div>
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-brand-text-secondary sm:flex-row">
          <p className="font-semibold text-brand-text-light dark:text-brand-text-dark">{APP_NAME}</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-brand-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-brand-primary">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-brand-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-primary">
              Terms
            </Link>
          </div>
          <p>Made in India 🇮🇳</p>
        </div>
      </footer>
    </main>
  );
}
