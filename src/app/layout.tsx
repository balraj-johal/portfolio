import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";

import TransitionSplash from "@/components/UI/TransitionSplash";
import RootBody from "@/components/UI/RootBody";
import LoadingSplash from "@/components/UI/LoadingSplash";
import CustomCursorWindow from "@/components/UI/CustomCursorWindow";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <RootBody>
          <Suspense>{children}</Suspense>
          <CustomCursorWindow />
          <TransitionSplash />
          <LoadingSplash />
        </RootBody>
        <Analytics />
      </Providers>
    </html>
  );
}
