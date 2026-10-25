import type { Metadata, Viewport } from "next";
import { Galada, Hind_Siliguri, Rozha_One } from "next/font/google";
import "./globals.css";

const galada = Galada({ variable: "--font-galada", weight: "400", subsets: ["bengali", "latin"] });
const rozha = Rozha_One({ variable: "--font-rozha", weight: "400", subsets: ["latin"] });
const hind = Hind_Siliguri({ variable: "--font-hind", weight: ["300", "400", "500", "600"], subsets: ["bengali", "latin"] });

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(site ? `https://${site}` : "http://localhost:3000"),
  title: "Sumona & Anik | শুভ বিবাহ",
  description: "Sumona Chowdhury and Anik Datta are getting married in Netrokona. Ride along with the barjatri, see the Shubho Drishti, and float a wish.",
};

export const viewport: Viewport = {
  themeColor: "#A3132B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${galada.variable} ${rozha.variable} ${hind.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
