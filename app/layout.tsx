import type { Metadata } from "next"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { ThemeProvider } from "./components/providers/ThemeProvider"
import { SidebarReloader } from "./components/providers/SidebarReloader"

export const metadata: Metadata = {
  title: "Lawshield.ai",
  description: "Free & Open Source Analytics for Traffic Accident Handling",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-[100dvh]">
        <ThemeProvider>
          <div className="relative flex h-full w-full overflow-hidden">
            <SidebarReloader>
              <SidebarProvider>
                <AppSidebar />
                <div className="relative flex flex-col h-full w-full overflow-hidden">
                  {children}
                </div>
              </SidebarProvider>
            </SidebarReloader>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
