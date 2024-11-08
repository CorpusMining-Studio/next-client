"use client"
import React, { useState, useContext, createContext } from "react"

export enum ReloadState {
  RELOADING = "RELOADING",
  RELOADED = "RELOADED",
  RELOAD = "RELOAD",
}

type SidebarReloaderContextType = {
  reload: ReloadState
  setReload: React.Dispatch<React.SetStateAction<ReloadState>>
}

const SidebarReloaderContext = createContext<SidebarReloaderContextType | null>(
  null
)

export function useSidebarReloader() {
  const context = useContext(SidebarReloaderContext)
  if (!context) {
    throw new Error(
      "useSidebarReloader must be used within a SidebarReloaderProvider"
    )
  }
  return context
}

export function SidebarReloader({ children }: { children: React.ReactNode }) {
  const [reload, setReload] = useState<ReloadState>(ReloadState.RELOADED)

  return (
    <SidebarReloaderContext.Provider value={{ reload, setReload }}>
      {children}
    </SidebarReloaderContext.Provider>
  )
}
