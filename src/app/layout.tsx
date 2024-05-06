import { Suspense } from "react";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/UI/RootBody";
import Main from "@/components/UI/Main";
import Providers from "@/components/Providers";

import "@/theme/globals.css";
import "@/theme/spacing.scss";
import "@/theme/colors.css";
import "@/theme/type.scss";

export const metadata: Metadata = {
  title: "Portfolio | Balraj Johal",
  description: "Creative Developer | Based in London",
  keywords: [
    "dev",
    "developer",
    "web dev",
    "creative developer",
    "phantom studios",
    "phantom agency",
  ],
  openGraph: {
    images: [
      {
        url: "https://www.balraj.cool/assets/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        id="favicon-svg"
        rel="icon"
        type="image/svg+xml"
        href="/assets/images/favicon.svg"
      />
      <link
        id="favicon-sad-svg"
        rel="icon-not-used"
        type="image/svg+xml"
        href="/assets/images/favicon-sad.svg"
      />
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
