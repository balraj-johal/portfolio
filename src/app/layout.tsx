import GradientBG from "@/components/3D/GradientBG";
import RootBody from "@/components/UI/RootBody";
import { GradientConfigProvider } from "@/contexts/gradient";
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
      <GradientConfigProvider>
        <RootBody>
          <GradientBG />
          {children}
        </RootBody>
      </GradientConfigProvider>
    </html>
  );
}
