/* eslint-disable no-console */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GROQ_API_KEY",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APP_NAME",
];

const optional = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RESEND_API_KEY"];

let allGood = true;

console.log("🔍 Checking environment variables...\n");

for (const key of required) {
  const value = process.env[key];
  if (!value || value.includes("your_")) {
    console.log(`❌ MISSING: ${key}`);
    allGood = false;
  } else {
    console.log(`✅ SET: ${key} = ${value.substring(0, 20)}...`);
  }
}

console.log("\n📋 Optional:");
for (const key of optional) {
  const value = process.env[key];
  if (!value || value.includes("your_")) {
    console.log(`⚠️  NOT SET: ${key} (needed later)`);
  } else {
    console.log(`✅ SET: ${key}`);
  }
}

if (allGood) {
  console.log("\n✅ All required variables are set! Ready to go.");
} else {
  console.log("\n❌ Some required variables are missing. Please set them in .env.local");
  process.exit(1);
}
