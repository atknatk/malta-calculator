export const SIZE = {
  width: 1200,
  height: 630,
};

export const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const interMedium = fetch(
  new URL("../../../../public/fonts/c9a5bc6a7c948fb0-s.p.woff2", import.meta.url),
).then((res) => res.arrayBuffer());

export const interRegular = fetch(
  new URL("../../../../public/fonts/c9a5bc6a7c948fb0-s.p.woff2", import.meta.url),
).then((res) => res.arrayBuffer());

export const interLight = fetch(
  new URL("../../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export const calSemiBold = fetch(
  new URL("../../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());
