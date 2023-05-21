import GradientBG from "@/components/3D/GradientBG";
import Providers from "@/components/Providers";
import RootBody from "@/components/UI/RootBody";
import LoadingSplash from "@/components/UI/LoadingSplash";

import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import "@/theme/type.css";
import Main from "@/components/UI/Main";

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
          <Main>{children}</Main>
        </RootBody>
        <Analytics />
      </Providers>
    </html>
  );
}
