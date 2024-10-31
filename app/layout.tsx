import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-[100dvh]">
        <div className="relative flex h-full w-full overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <div className="relative flex flex-col h-full w-full overflow-hidden">
              {children}
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
