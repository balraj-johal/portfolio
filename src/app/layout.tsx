import { Suspense, lazy } from "react";

import { Analytics } from "@vercel/analytics/react";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import RootBody from "@/components/UI/RootBody";
import Main from "@/components/UI/Main";
import Providers from "@/components/Providers";

import "./globals.css";
import "@/theme/animation.css";
import "@/theme/spacing.css";
import "@/theme/colors.css";
import "@/theme/type.css";

storyblokInit({
  accessToken: process.env.STORYBLOK_TOKEN,
  use: [apiPlugin],
});

export const metadata = {
  title: "Balraj Johal",
  description: ":)",
};

const LazyTransitionSplash = lazy(
  () => import("@/components/UI/Splashes/TransitionSplash"),
);

const LazyCustomCursorWindow = lazy(
  () => import("@/components/UI/CustomCursorWindow"),
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
      <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      <Providers>
        <RootBody>
          <Main>
            <Suspense>{children}</Suspense>
          </Main>
          <LazyCustomCursorWindow />
          <LazyTransitionSplash />
          <Analytics />
        </RootBody>
      </Providers>
    </html>
  );
}
