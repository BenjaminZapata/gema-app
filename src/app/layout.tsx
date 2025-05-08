import "./globals.css";
import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import { ThemeRegistry } from "@/components/commons/ThemeProvider";
import { PageLayout } from "@/components/commons/PageLayout";
import { Providers } from "@/redux/Providers";
import { DateProvider } from "@/components/commons/DateProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Libreria Gema",
  description: "Aplicación de gestión para Libreria Gema",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DateProvider>
      <Providers>
        <html lang="en" className={roboto.variable}>
          <body>
            <main>
              <ThemeRegistry>
                <PageLayout>{children}</PageLayout>
              </ThemeRegistry>
            </main>
          </body>
        </html>
        <Toaster richColors position="bottom-right" expand />
      </Providers>
    </DateProvider>
  );
}
