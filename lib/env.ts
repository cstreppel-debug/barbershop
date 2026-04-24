import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url("NEXT_PUBLIC_SUPABASE_URL=https://cupiqbqhxbhwloqcjljw.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1,  "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cGlxYnFoeGJod2xvcWNqbGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NzA2MDgsImV4cCI6MjA5MjU0NjYwOH0.OsJDPI3DpnsqhsMmEW1XFXxgA8jYVxBqjTVObVK7VuI"),
  RESEND_API_KEY:                z.string().min(1,  "RESEND_API_KEY=re_2WWiN8gK_KYAkA2oU9CD8AnbENMs6jPxd"),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  RESEND_API_KEY:                process.env.RESEND_API_KEY,
});

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const lines = Object.entries(errors)
    .map(([k, v]) => `  • ${k}: ${v?.join(", ")}`)
    .join("\n");
  throw new Error(`\n❌ Ontbrekende of ongeldige omgevingsvariabelen:\n${lines}\n`);
}

export const env = parsed.data;
