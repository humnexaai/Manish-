"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock3,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type MenuCategory = {
  title: string;
  description: string;
  icon: LucideIcon;
  accentFrom: string;
  accentTo: string;
};

type QualityPoint = {
  title: string;
  description: string;
  icon: LucideIcon;
};

// मेन्यू की चार मुख्य श्रेणियों का डेटा
const menuCategories: MenuCategory[] = [
  {
    title: "Fresh Sugarcane Juice",
    description: "ताज़े गन्ने से बना 100% नेचुरल जूस, बिना किसी कृत्रिम सिरप के।",
    icon: Leaf,
    accentFrom: "#22c55e",
    accentTo: "#84cc16",
  },
  {
    title: "Premium Coconut Water",
    description: "चुने हुए नारियल से ठंडा और इलेक्ट्रोलाइट-रिच हेल्दी ड्रिंक।",
    icon: Droplets,
    accentFrom: "#06b6d4",
    accentTo: "#38bdf8",
  },
  {
    title: "Artisanal Soda",
    description: "लेमन, जिंजर और मसाला नोट्स के साथ क्राफ्टेड फ्रेश सोडा।",
    icon: Sparkles,
    accentFrom: "#f97316",
    accentTo: "#facc15",
  },
  {
    title: "Seasonal Fruit Juices",
    description: "मौसम के हिसाब से फल चुनकर तैयार किए गए ताजगी भरे जूस।",
    icon: Truck,
    accentFrom: "#a855f7",
    accentTo: "#ec4899",
  },
];

// ब्रांड के हाइजीन और क्वालिटी वादे
const qualityPoints: QualityPoint[] = [
  {
    title: "Food-Grade Hygiene Protocol",
    description: "हर सर्विंग से पहले उपकरणों की सैनिटाइजेशन और ग्लव्स का उपयोग।",
    icon: ShieldCheck,
  },
  {
    title: "Pure & Natural Ingredients",
    description: "बिना आर्टिफिशियल कलर, बिना सिंथेटिक फ्लेवर और बिना अनचाहे एडिटिव्स।",
    icon: Leaf,
  },
  {
    title: "Fresh Mobile Cart Service",
    description: "Faridabad में ऑन-डिमांड मोबाइल कार्ट के साथ ताज़ा सर्विस।",
    icon: Truck,
  },
];

function PlaceholderImage({
  title,
  accentFrom,
  accentTo,
  Icon,
}: {
  title: string;
  accentFrom: string;
  accentTo: string;
  Icon: LucideIcon;
}) {
  return (
    <div
      role="img"
      aria-label={`${title} का प्रतिनिधि प्लेसहोल्डर चित्र`}
      className="relative h-44 w-full overflow-hidden rounded-xl border border-white/30"
    >
      {/* प्लेसहोल्डर इमेज के लिए सॉफ्ट ग्रेडिएंट बैकग्राउंड */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        }}
      />

      {/* दृश्य गहराई के लिए ओवरले पैटर्न */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 3px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* श्रेणी आइकन और नाम */}
      <div className="relative flex h-full flex-col items-center justify-center gap-2 text-white">
        <Icon className="h-10 w-10" aria-hidden />
        <span className="text-center text-sm font-semibold tracking-wide">
          {title}
        </span>
      </div>
    </div>
  );
}

export function BeverageLandingPage() {
  // यूज़र की reduced-motion सेटिंग का सम्मान करने के लिए
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.55, ease: "easeOut" as const },
      };

  // WhatsApp पूछताछ बटन के लिए प्रीफिल्ड संदेश
  const whatsappMessage = encodeURIComponent(
    "Namaste! Mujhe EAT DRINK and Be MERRY ke beverages ke baare mein details chahiye.",
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* कीबोर्ड यूज़र्स के लिए स्किप-लिंक */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-brand-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      {/* शीर्ष हेडर और इन-पेज नेविगेशन */}
      <header className="sticky top-0 z-40 border-b border-emerald-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <p className="text-sm font-extrabold tracking-wide text-emerald-700 dark:text-emerald-300">
            EAT DRINK and Be MERRY
          </p>
          <nav aria-label="Primary" className="flex items-center gap-3 text-sm sm:gap-6">
            <a
              href="#menu"
              className="rounded-md px-2 py-1 font-medium text-slate-700 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              Menu
            </a>
            <a
              href="#about"
              className="rounded-md px-2 py-1 font-medium text-slate-700 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              About
            </a>
            <a
              href="#contact"
              className="rounded-md bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* फुल-विड्थ हीरो सेक्शन */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-cyan-600 px-4 py-20 text-white sm:px-6 sm:py-28"
          aria-labelledby="hero-title"
        >
          <div className="absolute inset-0 opacity-25" aria-hidden>
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#ffffff_1px,transparent_1px)] bg-[length:22px_22px]" />
          </div>
          <motion.div
            className="relative mx-auto flex max-w-6xl flex-col items-start gap-6"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <span className="rounded-full border border-white/45 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Freshness on Wheels • Faridabad
            </span>
            <h1 id="hero-title" className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              The Real Taste of Freshness
            </h1>
            <p className="max-w-2xl text-base text-emerald-50 sm:text-lg">
              100% natural Sugarcane Juice और Refreshing Soda के साथ हर घूंट में शुद्ध स्वाद, स्वच्छता और असली
              ताजगी का भरोसा।
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explore Menu <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Book Cart Service
              </a>
            </div>
          </motion.div>
        </section>

        {/* इंटरैक्टिव मेन्यू ग्रिड सेक्शन */}
        <section id="menu" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="menu-title">
          <motion.div {...motionProps}>
            <h2 id="menu-title" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Beverage Menu
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">
              अलग-अलग पसंद के लिए crafted categories — हर कार्ड पर hover करते ही smooth visual interaction।
            </p>
          </motion.div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {menuCategories.map(({ title, description, icon: Icon, accentFrom, accentTo }, index) => (
              <motion.article
                key={title}
                {...motionProps}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.55,
                        delay: index * 0.08,
                        ease: "easeOut",
                      }
                }
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                className="group rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-emerald-600 dark:border-slate-800 dark:bg-slate-900"
              >
                <PlaceholderImage title={title} accentFrom={accentFrom} accentTo={accentTo} Icon={Icon} />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{description}</p>
                  <a
                    href="#contact"
                    className="mt-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    Order Inquiry <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ब्रांड क्वालिटी और हाइजीन जानकारी */}
        <section
          id="about"
          className="bg-white/80 px-4 py-16 dark:bg-slate-900/60 sm:px-6"
          aria-labelledby="about-title"
        >
          <motion.div {...motionProps} className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 id="about-title" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                About Our Mobile Cart Service
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-300">
                EAT DRINK and Be MERRY का उद्देश्य Faridabad में हर ग्राहक तक hygienic, pure और freshly prepared
                beverages पहुँचाना है। हमारी टीम mobile cart model पर काम करती है ताकि freshness और service speed दोनों
                बरकरार रहें।
              </p>
            </div>

            <div className="grid gap-4">
              {qualityPoints.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* संपर्क और लोकेशन सेक्शन */}
        <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="contact-title">
          <motion.div {...motionProps} className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 id="contact-title" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Contact &amp; Location
              </h2>
              <p className="mt-3 text-slate-700 dark:text-slate-300">
                Faridabad, Haryana में events, daily service और special beverage counters के लिए हमसे संपर्क करें।
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <MapPin className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Service Area</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Faridabad, Haryana, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <Clock3 className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Working Hours</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Daily: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp Inquiry
              </a>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Send an Inquiry</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                नीचे दी गई जानकारी भरें, हमारी टीम जल्दी संपर्क करेगी।
              </p>

              {/* एक्सेसिबल पूछताछ फॉर्म */}
              <form className="mt-5 space-y-4" aria-label="Beverage inquiry form" action="#" method="post">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Requirement Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="उदाहरण: 50 लोगों के लिए sugarcane juice counter चाहिए..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Submit Inquiry
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </main>

      {/* फुटर में ब्रांड और कॉपीराइट */}
      <footer className="border-t border-emerald-200 bg-white/80 px-4 py-8 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 text-sm text-slate-700 dark:text-slate-300 sm:flex-row sm:items-center">
          <p className="font-semibold">EAT DRINK and Be MERRY</p>
          <p>Faridabad, Haryana • 100% Natural Refreshments</p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
