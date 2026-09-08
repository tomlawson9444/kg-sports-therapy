import type { Metadata } from "next";
import { Archivo_Black, Playfair_Display, Work_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  style: ["italic"],
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KG Sports Therapy",
  description:
    "KG Sports Therapy — sports massage, injury assessment, and rehabilitation. Move. Recover. Repeat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivoBlack.variable} ${playfairDisplay.variable} ${workSans.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-cream font-body text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
