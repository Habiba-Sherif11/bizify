import type { Metadata } from "next";
import { Inter, Tajawal, Cormorant_SC, Geist } from "next/font/google";
import "@/src/styles/globals.css";
import { cn } from "@/lib/utils";
import "@/styles/animations.css";
import { AnimationProvider } from "@/components/providers/AnimationProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-sc",
});

export const metadata: Metadata = {
  title: "Bizify - AI-Powered Platform for Startup Founders",
  description: "From idea to launch with an AI co-founder by your side. Bizify guides entrepreneurs through every step of building a startup with AI at every step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
              "h-full overflow-x-hidden",
              "antialiased",
              inter.variable,
              tajawal.variable,
              cormorantSC.variable
            , "font-sans", geist.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-hidden">
        <ReduxProvider>
          <ReactQueryProvider>
            <AnimationProvider>
              {children}
            </AnimationProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}