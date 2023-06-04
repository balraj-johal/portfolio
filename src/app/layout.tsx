import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";

import TransitionSplash from "@/components/UI/TransitionSplash";
import RootBody from "@/components/UI/RootBody";
import LoadingSplash from "@/components/UI/LoadingSplash";
import Providers from "@/components/Providers";
import GradientBG from "@/components/3D/GradientBG";

import "./globals.css";
import "@/theme/animation.css";
import "@/theme/colors.css";
import "@/theme/type.css";

export const metadata = {
  title: "Balraj Johal",
  description: ":)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense fallback={null}>
        <Providers>
          <RootBody>
            <TransitionSplash />
            <LoadingSplash />
            <GradientBG />
            {children}
          </RootBody>
          <Analytics />
        </Providers>
      </Suspense>
    </html>
  );
}
