/**
 * This file exists only to avoid a Next.js "duplicate route" build error
 * (app/page.tsx and app/(booking)/page.tsx both map to /).
 *
 * The real homepage lives in app/(booking)/page.tsx — delete THIS file
 * once you're comfortable that the route group correctly handles /.
 */
export { default } from "./(booking)/page";
