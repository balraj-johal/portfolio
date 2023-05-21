import GradientBG from "@/components/3D/GradientBG";
import Providers from "@/components/Providers";
import RootBody from "@/components/UI/RootBody";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import "@/theme/type.css";
import LoadingSplash from "@/components/UI/LoadingSplash";

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
          <LoadingSplash />
          <GradientBG />
          {children}
        </RootBody>
        <Analytics />
      </Providers>
    </html>
  );
}
