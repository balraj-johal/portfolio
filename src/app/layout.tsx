/* eslint-disable prettier/prettier */
import { Suspense, lazy } from "react";

import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/UI/RootBody";
import PreloaderManager from "@/components/UI/Preloader/Manager";
import Preloader from "@/components/UI/Preloader";
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
  () => import("@/components/UI/Splashes/TransitionSplash")
);

const LazyCustomCursorWindow = lazy(
  () => import("@/components/UI/CustomCursorWindow")
);

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" style={{ background: "#000" }}>
      <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
      <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      <Providers>
        <RootBody>
          <Main>
            <Suspense>{children}</Suspense>
          </Main>
          <LazyCustomCursorWindow />
          <LazyTransitionSplash />
        </RootBody>
        <Analytics />
      </Providers>
    </html>
  );
}
