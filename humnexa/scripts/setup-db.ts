/* eslint-disable no-console */
// Run with: npx tsx scripts/setup-db.ts

import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function splitSqlStatements(sql: string) {
  const statements: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let inDollar = false;
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const next2 = sql.slice(i, i + 2);

    if (!inSingle && !inDouble && next2 === "$$") {
      inDollar = !inDollar;
      current += next2;
      i += 2;
      continue;
    }

    if (!inDouble && !inDollar && char === "'") inSingle = !inSingle;
    if (!inSingle && !inDollar && char === '"') inDouble = !inDouble;

    if (char === ";" && !inSingle && !inDouble && !inDollar) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      i += 1;
      continue;
    }

    current += char;
    i += 1;
  }

  const rest = current.trim();
  if (rest) statements.push(rest);
  return statements;
}

async function callExecSql(sql: string) {
  const payloads = [{ sql }, { query: sql }];
  for (const payload of payloads) {
    const { error } = await supabase.rpc("exec_sql", payload as never);
    if (!error) return;
  }

  for (const payload of payloads) {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) return;
  }

  throw new Error("exec_sql RPC unavailable from this project. Use SQL Editor fallback.");
}

async function setupDatabase() {
  console.log("🚀 Setting up Humnexa database...");

  const schemaPathPrimary = path.join(process.cwd(), "scripts", "schema.sql");
  const schemaPathFallback = path.join(process.cwd(), "humnexa-db-schema.sql");

  let schemaSql = "";
  try {
    schemaSql = await readFile(schemaPathPrimary, "utf8");
    if (!schemaSql.trim()) throw new Error("scripts/schema.sql is empty");
    if (!/create\s+table/i.test(schemaSql)) {
      throw new Error("scripts/schema.sql does not contain schema DDL");
    }
    console.log("📄 Loaded schema from scripts/schema.sql");
  } catch {
    schemaSql = await readFile(schemaPathFallback, "utf8");
    console.log("📄 Loaded schema from humnexa-db-schema.sql");
  }

  const tableCount = (schemaSql.match(/create\s+table/gi) ?? []).length;
  console.log(`🧱 Detected ${tableCount} CREATE TABLE statements`);

  try {
    await callExecSql(schemaSql);
    console.log("✅ Database setup complete (single-shot execution).");
    return;
  } catch (singleError) {
    console.log(`⚠️ Single-shot exec failed: ${(singleError as Error).message}`);
  }

  const statements = splitSqlStatements(schemaSql);
  console.log(`🪓 Falling back to ${statements.length} statement-by-statement execution...`);

  let completed = 0;
  for (const statement of statements) {
    try {
      await callExecSql(statement);
      completed += 1;
    } catch (error) {
      console.error("❌ Failed statement:", statement.slice(0, 140));
      throw error;
    }
  }

  console.log(`✅ Database setup complete! (${completed}/${statements.length} statements)`);
}

setupDatabase().catch((error) => {
  console.error("❌ Database setup failed:", error instanceof Error ? error.message : error);
  console.error("Fallback: open scripts/schema.sql or humnexa-db-schema.sql in Supabase SQL Editor and run manually.");
  process.exit(1);
});
