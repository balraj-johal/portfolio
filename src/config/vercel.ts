const DEPLOYED_URL =
  process.env.NEXT_PUBLIC_URL ??
  process.env.VERCEL_ENV ??
  process.env.NEXT_PUBLIC_VERCEL_URL;

export const FULL_DEPLOYED_URL = DEPLOYED_URL
  ? `https://${DEPLOYED_URL}`
  : "http://localhost:3000";
