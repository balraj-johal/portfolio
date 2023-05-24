import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/UI/RootBody";
import TransitionSplash from "@/components/UI/TransitionSplash";
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
      <Providers>
        <RootBody>
          <TransitionSplash />
          <GradientBG />
          {children}
        </RootBody>
        <Analytics />
      </Providers>
    </html>
  );
}
