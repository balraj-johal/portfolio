import { Suspense } from "react";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/UI/RootBody";
import Main from "@/components/UI/Main";
import Providers from "@/components/Providers";

import "@/theme/globals.css";
import "@/theme/spacing.css";
import "@/theme/colors.css";
import "@/theme/type.css";

export const metadata: Metadata = {
  title: "Balraj Johal",
  description: ":)",
  keywords: ["dev", "developer", "web dev", "creative developer"],
};

// const LazyTransitionSplash = lazy(
//   () => import("@/components/UI/Splashes/TransitionSplash")
// );

// const LazyCustomCursorWindow = lazy(
//   () => import("@/components/UI/CustomCursorWindow")
// );

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
          <Analytics />
        </RootBody>
      </Providers>
    </html>
  );
}
