import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // Aggiungi questa importazione

export const metadata: Metadata = {
  title: "Kommander ai",
  description: "Generated by create next app",
  icons: {
    icon: "/globe.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
              rel="stylesheet" 
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" 
              integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" 
              crossOrigin="anonymous" 
        />
         <link
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="flex-1 overflow-y-auto main-layout bg-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}