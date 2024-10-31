"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function ChatHeader() {
  return (
    <SidebarTrigger className="sticky top-0 w-full bg-background rounded-b" />
  );
}
