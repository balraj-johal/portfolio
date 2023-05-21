import GradientBG from "@/components/3D/GradientBG";
import Providers from "@/components/Providers";
import RootBody from "@/components/UI/RootBody";

import "./globals.css";

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
          <GradientBG />
          {children}
        </RootBody>
      </Providers>
    </html>
  );
}
