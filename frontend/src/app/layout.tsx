import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GENESIS | AWS Student Community Day Cameroon 2026",
  description: "Igniting Cameroon's Cloud Journey – The First Student Community Day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${plusJakarta.variable} ${firaCode.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--panel)",
              color: "var(--text-1)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
