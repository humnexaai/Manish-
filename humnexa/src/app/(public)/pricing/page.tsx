import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const comparisonRows = [
  { feature: "Daily Messages", free: "100", plus: "1000", pro: "Unlimited" },
  { feature: "AI Modes", free: "Basic", plus: "Advanced", pro: "All + Priority" },
  { feature: "Max Upload Size", free: "10 MB", plus: "25 MB", pro: "50 MB" },
  { feature: "Projects", free: "3", plus: "25", pro: "Unlimited" },
  { feature: "Support", free: "Community", plus: "Priority Email", pro: "Priority + SLA" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-brand-bg-light px-4 py-10 text-brand-text-light dark:bg-brand-bg-dark dark:text-brand-text-dark">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-3xl font-bold">Pricing Plans</h1>
        <p className="mt-2 text-center text-brand-text-secondary">Choose a plan that grows with your workflow.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={plan.id === "plus" ? "border-brand-primary ring-1 ring-brand-primary/40" : ""}
              header={
                <div>
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="mt-1 text-3xl font-bold">
                    {plan.price_monthly === 0 ? "Free" : `₹${plan.price_monthly}`}
                    <span className="ml-1 text-sm font-normal text-brand-text-secondary">/month</span>
                  </p>
                </div>
              }
              footer={
                <Link href="/signup">
                  <Button fullWidth variant={plan.id === "plus" ? "primary" : "outline"}>
                    Start {plan.name}
                  </Button>
                </Link>
              }
            >
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-brand-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-brand-border-light dark:border-brand-border-dark">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-card-light dark:bg-brand-card-dark">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-left font-semibold">Free</th>
                <th className="px-4 py-3 text-left font-semibold">Plus</th>
                <th className="px-4 py-3 text-left font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-t border-brand-border-light dark:border-brand-border-dark">
                  <td className="px-4 py-3 font-medium">{row.feature}</td>
                  <td className="px-4 py-3 text-brand-text-secondary">{row.free}</td>
                  <td className="px-4 py-3 text-brand-text-secondary">{row.plus}</td>
                  <td className="px-4 py-3 text-brand-text-secondary">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
