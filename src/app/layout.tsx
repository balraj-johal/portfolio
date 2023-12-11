import { Suspense, lazy } from "react";

import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/UI/RootBody";
import Main from "@/components/UI/Main";
import Providers from "@/components/Providers";

import "./globals.css";
import "@/theme/animation.css";
import "@/theme/spacing.css";
import "@/theme/colors.css";
import "@/theme/type.css";

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

const BackgroundNoSSR = dynamic(
  () => import("@/components/UI/Splashes/Background"),
  { ssr: false },
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
      <Analytics />
      <Providers>
        <RootBody>
          <Main>
            <Suspense>{children}</Suspense>
          </Main>
          <LazyCustomCursorWindow />
          <LazyTransitionSplash />
          <BackgroundNoSSR />
        </RootBody>
      </Providers>
    </html>
  );
}
