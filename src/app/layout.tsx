import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";

import TransitionSplash from "@/components/UI/Splashes/TransitionSplash";
import LoadingSplash from "@/components/UI/Splashes/LoadingSplash";
import RootBody from "@/components/UI/RootBody";
import Main from "@/components/UI/Main";
import Header from "@/components/UI/Header";
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
          <Main>
            <Header />

            <Suspense>{children}</Suspense>
          </Main>
          <CustomCursorWindow />
          <TransitionSplash />
          <LoadingSplash />
          <Analytics />
        </RootBody>
      </Providers>
    </html>
  );
}
