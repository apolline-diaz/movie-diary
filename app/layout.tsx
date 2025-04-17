import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { getCanonicalUrl } from "@/utils/index";
import TopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "Movie Diary",
  description:
    "Le site de référence des films LGBTQIA+ : découvrez l'histoire du cinéma et des représentations queer avec Movie Diary .",
  openGraph: {
    images: [`/assets/diary.svg`],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-red-100 min-h-screen text-white flex flex-col`}
      >
        <TopLoader
          color="#c42d50" // Rose foncé tirant vers le rouge
          initialPosition={0.08} // Position de départ
          crawlSpeed={200} // Vitesse de progression
          height={4} // Épaisseur de la barre
          easing="ease"
          speed={500}
        />

        <div className="">
          <Header />
        </div>
        <main className="bg-rose-100">{children}</main>
        <div className="mt-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
