import type { Metadata } from "next";
import { BeverageLandingPage } from "@/components/landing/BeverageLandingPage";

// लोकल SEO के लिए पेज-लेवल मेटाडेटा कॉन्फ़िगरेशन
export const metadata: Metadata = {
  metadataBase: new URL("https://eatdrinkbemerry.in"),
  title: "EAT DRINK and Be MERRY | Fresh Sugarcane Juice & Soda in Faridabad",
  description:
    "EAT DRINK and Be MERRY: Faridabad, Haryana में 100% natural sugarcane juice, artisanal soda, premium coconut water और seasonal fruit juices के लिए trusted mobile cart service.",
  keywords: [
    "EAT DRINK and Be MERRY",
    "Sugarcane Juice Faridabad",
    "Fresh Soda Faridabad",
    "Coconut Water Faridabad",
    "Seasonal Fruit Juice Faridabad",
    "Beverage cart service Haryana",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EAT DRINK and Be MERRY | The Real Taste of Freshness",
    description:
      "Faridabad में hygienic mobile cart beverages: fresh sugarcane juice, premium coconut water, artisanal soda और seasonal fruit juices.",
    url: "/",
    siteName: "EAT DRINK and Be MERRY",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Fresh natural beverage selection by EAT DRINK and Be MERRY in Faridabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAT DRINK and Be MERRY | Fresh Beverages in Faridabad",
    description:
      "100% natural sugarcane juice, artisanal soda, coconut water, और seasonal fruit juices — अब Faridabad में।",
    images: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Faridabad, Haryana",
    "geo.position": "28.4089;77.3178",
    ICBM: "28.4089, 77.3178",
  },
};

export default function HomePage() {
  // लोकल बिज़नेस structured-data स्कीमा
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "EAT DRINK and Be MERRY",
    description:
      "Mobile beverage cart service in Faridabad offering natural sugarcane juice, artisanal soda, coconut water, and seasonal fruit juices.",
    areaServed: {
      "@type": "City",
      name: "Faridabad",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Faridabad",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.4089",
      longitude: "77.3178",
    },
    priceRange: "₹₹",
    servesCuisine: ["Beverages", "Fresh Juices", "Soda"],
  };

  return (
    <>
      {/* SEO के लिए JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <BeverageLandingPage />
    </>
  );
}
