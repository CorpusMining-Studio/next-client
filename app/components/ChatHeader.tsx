"use client"
import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeTrigger } from "./ThemeComp"

export function ChatHeader() {
  return (
    <div className="sticky top-0 flex w-full justify-center bg-background">
      <SidebarTrigger className="flex-grow" />
      <ThemeTrigger className="flex-grow" />
    </div>
  )
}
