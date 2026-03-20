"use client";

import Image from "next/image";
import { type FormEvent, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock3,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type Language = "en" | "hi";

type MenuCategory = {
  title: Record<Language, string>;
  description: Record<Language, string>;
  imageAlt: Record<Language, string>;
  imageUrl: string;
  icon: LucideIcon;
};

type QualityPoint = {
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: LucideIcon;
};

type InquiryForm = {
  name: string;
  phone: string;
  message: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// मेन्यू की चार मुख्य श्रेणियों का डेटा
const menuCategories: MenuCategory[] = [
  {
    title: {
      en: "Fresh Sugarcane Juice",
      hi: "Fresh Sugarcane Juice",
    },
    description: {
      en: "100% natural juice pressed live from fresh sugarcane with no artificial syrups.",
      hi: "ताज़े गन्ने से बना 100% नेचुरल जूस, बिना किसी कृत्रिम सिरप के।",
    },
    imageAlt: {
      en: "Freshly pressed sugarcane juice served with ice",
      hi: "बर्फ के साथ परोसा गया ताज़ा गन्ने का रस",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
    icon: Leaf,
  },
  {
    title: {
      en: "Premium Coconut Water",
      hi: "Premium Coconut Water",
    },
    description: {
      en: "Naturally chilled coconut water with mineral-rich hydration and clean taste.",
      hi: "चुने हुए नारियल से ठंडा और इलेक्ट्रोलाइट-रिच हेल्दी ड्रिंक।",
    },
    imageAlt: {
      en: "Tender coconuts prepared for fresh coconut water",
      hi: "ताज़े नारियल जिनसे प्रीमियम नारियल पानी सर्व किया जाता है",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1626514588608-fc5c0e8e6fb7?auto=format&fit=crop&w=1200&q=80",
    icon: Droplets,
  },
  {
    title: {
      en: "Artisanal Soda",
      hi: "Artisanal Soda",
    },
    description: {
      en: "Fresh crafted soda blends with lemon, ginger, and signature masala notes.",
      hi: "लेमन, जिंजर और मसाला नोट्स के साथ क्राफ्टेड फ्रेश सोडा।",
    },
    imageAlt: {
      en: "Sparkling artisanal soda with lemon garnish",
      hi: "लेमन गार्निश के साथ स्पार्कलिंग आर्टिसनल सोडा",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    icon: Sparkles,
  },
  {
    title: {
      en: "Seasonal Fruit Juices",
      hi: "Seasonal Fruit Juices",
    },
    description: {
      en: "Handpicked seasonal fruit juices made fresh for bright flavor and nutrition.",
      hi: "मौसम के हिसाब से फल चुनकर तैयार किए गए ताजगी भरे जूस।",
    },
    imageAlt: {
      en: "Colorful seasonal fruit juices in fresh glasses",
      hi: "रंग-बिरंगे सीजनल फलों के जूस",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80",
    icon: Truck,
  },
];

// ब्रांड के हाइजीन और क्वालिटी वादे
const qualityPoints: QualityPoint[] = [
  {
    title: {
      en: "Food-Grade Hygiene Protocol",
      hi: "Food-Grade Hygiene Protocol",
    },
    description: {
      en: "Every serving station is sanitized and handled with gloves before use.",
      hi: "हर सर्विंग से पहले उपकरणों की सैनिटाइजेशन और ग्लव्स का उपयोग।",
    },
    icon: ShieldCheck,
  },
  {
    title: {
      en: "Pure & Natural Ingredients",
      hi: "Pure & Natural Ingredients",
    },
    description: {
      en: "No artificial colors, no synthetic flavors, and no unnecessary additives.",
      hi: "बिना आर्टिफिशियल कलर, बिना सिंथेटिक फ्लेवर और बिना अनचाहे एडिटिव्स।",
    },
    icon: Leaf,
  },
  {
    title: {
      en: "Fresh Mobile Cart Service",
      hi: "Fresh Mobile Cart Service",
    },
    description: {
      en: "On-demand mobile cart setup across Faridabad for events and regular service.",
      hi: "Faridabad में ऑन-डिमांड मोबाइल कार्ट के साथ ताज़ा सर्विस।",
    },
    icon: Truck,
  },
];

// द्विभाषी UI कंटेंट (Hindi/English)
const uiContent = {
  en: {
    skipToMain: "Skip to main content",
    nav: {
      menu: "Menu",
      about: "About",
      contact: "Contact",
      toggleLabel: "भाषा हिंदी में बदलें",
      toggleButton: "हिं",
    },
    hero: {
      badge: "Freshness on Wheels • Faridabad",
      title: "The Real Taste of Freshness",
      subtitle:
        "Experience 100% natural Sugarcane Juice and Refreshing Soda crafted fresh for every sip.",
      menuCta: "Explore Menu",
      bookingCta: "Book Cart Service",
    },
    menu: {
      title: "Interactive Beverage Menu",
      description:
        "A visually rich grid of handcrafted beverages with premium imagery and smooth interactions.",
      inquiryCta: "Order Inquiry",
    },
    about: {
      title: "About Our Mobile Cart Service",
      description:
        "EAT DRINK and Be MERRY brings hygienic, fresh and pure beverages to your neighborhood and events with a dependable mobile cart model across Faridabad.",
    },
    contact: {
      title: "Contact & Location",
      description:
        "Reach us for events, daily service, and beverage counters in Faridabad, Haryana.",
      areaLabel: "Service Area",
      areaValue: "Faridabad, Haryana, India",
      hoursLabel: "Working Hours",
      hoursValue: "Daily: 10:00 AM - 10:00 PM",
      mapTitle: "Map Location",
      mapFrameTitle: "Map showing Faridabad Haryana",
      callCta: "Call Now",
      whatsappCta: "WhatsApp Inquiry",
      whatsappPrefill:
        "Namaste! I want details about EAT DRINK and Be MERRY beverages and mobile cart booking.",
    },
    form: {
      title: "Send an Inquiry",
      description: "Share your requirement and our team will get in touch quickly.",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      messageLabel: "Requirement Details",
      messagePlaceholder:
        "Example: Need a sugarcane juice and soda counter for 50 guests...",
      submitIdle: "Submit Inquiry",
      submitLoading: "Submitting...",
      success: "Your inquiry has been submitted successfully.",
      error: "Unable to submit right now. Please use call or WhatsApp.",
    },
    footer: {
      middle: "Faridabad, Haryana • 100% Natural Refreshments",
      right: "All rights reserved.",
    },
  },
  hi: {
    skipToMain: "मुख्य सामग्री पर जाएँ",
    nav: {
      menu: "मेन्यू",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      toggleLabel: "Switch language to English",
      toggleButton: "EN",
    },
    hero: {
      badge: "Freshness on Wheels • Faridabad",
      title: "The Real Taste of Freshness",
      subtitle:
        "100% natural Sugarcane Juice और Refreshing Soda के साथ हर घूंट में शुद्ध स्वाद और ताजगी का भरोसा।",
      menuCta: "मेन्यू देखें",
      bookingCta: "कार्ट बुक करें",
    },
    menu: {
      title: "Interactive Beverage Menu",
      description: "विज़ुअली प्रीमियम कार्ड्स में हमारे special beverages को explore करें।",
      inquiryCta: "ऑर्डर पूछताछ",
    },
    about: {
      title: "About Our Mobile Cart Service",
      description:
        "EAT DRINK and Be MERRY का उद्देश्य Faridabad में hygienic, pure और freshly prepared beverages पहुँचाना है। हमारा mobile cart model freshness और service speed दोनों बनाए रखता है।",
    },
    contact: {
      title: "Contact & Location",
      description:
        "Faridabad, Haryana में events, daily service और special beverage counters के लिए हमसे संपर्क करें।",
      areaLabel: "सेवा क्षेत्र",
      areaValue: "Faridabad, Haryana, India",
      hoursLabel: "कार्य समय",
      hoursValue: "रोज़ाना: 10:00 AM - 10:00 PM",
      mapTitle: "मैप लोकेशन",
      mapFrameTitle: "Faridabad Haryana का मैप",
      callCta: "अभी कॉल करें",
      whatsappCta: "WhatsApp पूछताछ",
      whatsappPrefill:
        "नमस्ते! मुझे EAT DRINK and Be MERRY के beverages और mobile cart booking की जानकारी चाहिए।",
    },
    form: {
      title: "पूछताछ भेजें",
      description: "अपनी आवश्यकता भरें, हमारी टीम जल्द संपर्क करेगी।",
      nameLabel: "पूरा नाम",
      phoneLabel: "फोन नंबर",
      messageLabel: "आवश्यकता विवरण",
      messagePlaceholder: "उदाहरण: 50 लोगों के लिए sugarcane juice counter चाहिए...",
      submitIdle: "पूछताछ सबमिट करें",
      submitLoading: "भेजा जा रहा है...",
      success: "आपकी पूछताछ सफलतापूर्वक भेज दी गई है।",
      error: "अभी पूछताछ नहीं भेजी जा सकी। कृपया कॉल या WhatsApp करें।",
    },
    footer: {
      middle: "Faridabad, Haryana • 100% Natural Refreshments",
      right: "सर्वाधिकार सुरक्षित।",
    },
  },
} as const;

function MenuImage({
  imageUrl,
  imageAlt,
  categoryTitle,
  Icon,
}: {
  imageUrl: string;
  imageAlt: string;
  categoryTitle: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-emerald-200 dark:border-slate-700">
      {/* कार्ड के लिए असली beverage फोटो */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* टेक्स्ट readability के लिए डार्क ग्रेडिएंट ओवरले */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/25 to-transparent" />
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        <span>{categoryTitle}</span>
      </div>
    </div>
  );
}

export function BeverageLandingPage() {
  // भाषा स्विचिंग के लिए state
  const [language, setLanguage] = useState<Language>("hi");

  // inquiry form के controlled inputs
  const [formData, setFormData] = useState<InquiryForm>({
    name: "",
    phone: "",
    message: "",
  });

  // submit lifecycle और feedback message state
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitFeedback, setSubmitFeedback] = useState("");

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

  // चुनी हुई भाषा के अनुसार live content प्राप्त करना
  const currentContent = uiContent[language];
  const phoneNumber = "+919876543210";

  // WhatsApp CTA के लिए भाषा-आधारित prefilled message तैयार करना
  const whatsappLink = useMemo(() => {
    const encodedMessage = encodeURIComponent(currentContent.contact.whatsappPrefill);
    return `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodedMessage}`;
  }, [currentContent.contact.whatsappPrefill]);

  // form में typed value update करने के लिए generic handler
  const handleFieldChange = (field: keyof InquiryForm, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (submitStatus === "success" || submitStatus === "error") {
      setSubmitStatus("idle");
      setSubmitFeedback("");
    }
  };

  // backend API के माध्यम से inquiry submit करने का handler
  const handleSubmitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("submitting");
    setSubmitFeedback("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Inquiry submission failed.");
      }

      setSubmitStatus("success");
      setSubmitFeedback(currentContent.form.success);
      setFormData({
        name: "",
        phone: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
      setSubmitFeedback(currentContent.form.error);
    }
  };

  return (
    <div lang={language} className="min-h-screen bg-emerald-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* कीबोर्ड यूज़र्स के लिए स्किप-लिंक */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-brand-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {currentContent.skipToMain}
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
              {currentContent.nav.menu}
            </a>
            <a
              href="#about"
              className="rounded-md px-2 py-1 font-medium text-slate-700 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300"
            >
              {currentContent.nav.about}
            </a>
            <a
              href="#contact"
              className="rounded-md bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {currentContent.nav.contact}
            </a>
            {/* हिंदी/अंग्रेजी टॉगल बटन */}
            <button
              type="button"
              onClick={() => setLanguage((previous) => (previous === "hi" ? "en" : "hi"))}
              aria-label={currentContent.nav.toggleLabel}
              className="rounded-md border border-emerald-300 px-2 py-1 font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              {currentContent.nav.toggleButton}
            </button>
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
              {currentContent.hero.badge}
            </span>
            <h1 id="hero-title" className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {currentContent.hero.title}
            </h1>
            <p className="max-w-2xl text-base text-emerald-50 sm:text-lg">
              {currentContent.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {currentContent.hero.menuCta} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {currentContent.hero.bookingCta}
              </a>
            </div>
          </motion.div>
        </section>

        {/* इंटरैक्टिव मेन्यू ग्रिड सेक्शन */}
        <section id="menu" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="menu-title">
          <motion.div {...motionProps}>
            <h2 id="menu-title" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentContent.menu.title}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">
              {currentContent.menu.description}
            </p>
          </motion.div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {menuCategories.map(({ title, description, imageAlt, imageUrl, icon: Icon }, index) => (
              <motion.article
                key={title.en}
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
                <MenuImage
                  imageUrl={imageUrl}
                  imageAlt={imageAlt[language]}
                  categoryTitle={title[language]}
                  Icon={Icon}
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title[language]}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{description[language]}</p>
                  <a
                    href="#contact"
                    className="mt-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    {currentContent.menu.inquiryCta} <ArrowRight className="h-4 w-4" aria-hidden />
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
                {currentContent.about.title}
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-300">
                {currentContent.about.description}
              </p>
            </div>

            <div className="grid gap-4">
              {qualityPoints.map(({ title, description, icon: Icon }) => (
                <article
                  key={title.en}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{title[language]}</h3>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{description[language]}</p>
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
                {currentContent.contact.title}
              </h2>
              <p className="mt-3 text-slate-700 dark:text-slate-300">
                {currentContent.contact.description}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <MapPin className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{currentContent.contact.areaLabel}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{currentContent.contact.areaValue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <Clock3 className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{currentContent.contact.hoursLabel}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{currentContent.contact.hoursValue}</p>
                  </div>
                </div>
              </div>

              {/* कॉल और WhatsApp दोनों quick संपर्क विकल्प */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <PhoneCall className="h-4 w-4" aria-hidden />
                  {currentContent.contact.callCta}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {currentContent.contact.whatsappCta}
                </a>
              </div>

              {/* एम्बेडेड मैप से उपयोगकर्ता को लोकेशन विजुअली समझाना */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{currentContent.contact.mapTitle}</p>
                <div className="overflow-hidden rounded-xl border border-emerald-100 dark:border-slate-800">
                  <iframe
                    title={currentContent.contact.mapFrameTitle}
                    src="https://www.google.com/maps?q=Faridabad%2C%20Haryana&output=embed"
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{currentContent.form.title}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {currentContent.form.description}
              </p>

              {/* एक्सेसिबल और backend-connected पूछताछ फॉर्म */}
              <form className="mt-5 space-y-4" aria-label="Beverage inquiry form" onSubmit={handleSubmitInquiry}>
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    {currentContent.form.nameLabel}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(event) => handleFieldChange("name", event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    {currentContent.form.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    {currentContent.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(event) => handleFieldChange("message", event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder={currentContent.form.messagePlaceholder}
                  />
                </div>

                {/* aria-live region में form submission feedback दिखाना */}
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-sm ${
                    submitStatus === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {submitFeedback}
                </p>

                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {submitStatus === "submitting" ? currentContent.form.submitLoading : currentContent.form.submitIdle}
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
          <p>{currentContent.footer.middle}</p>
          <p>
            © {new Date().getFullYear()} {currentContent.footer.right}
          </p>
        </div>
      </footer>
    </div>
  );
}
