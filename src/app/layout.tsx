import { Suspense } from "react";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import RootBody from "@/components/RootBody";

import "@/theme/globals.scss";
import "@/theme/spacing.scss";
import "@/theme/colors.scss";
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
    "balraj singh johal",
    "professional",
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
  alternates: {
    canonical: "https://www.balraj.cool",
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
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
      <RootBody>
        <Suspense>{children}</Suspense>
        <Analytics />
      </RootBody>
    </html>
  );
}
