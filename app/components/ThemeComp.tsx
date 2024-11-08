"use client"
import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeCompProps = {
  children: React.ReactNode
  theme: string
}

export function ThemeComp(props: ThemeCompProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (resolvedTheme === props.theme) {
    return <>{props.children}</>
  }

  return null
}

export const ThemeTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const sysPrefersDarkMode = () => {
    if (typeof window !== "undefined")
      return window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (theme === "dark" || theme === "light") {
    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark")
        }}
        {...props}
      >
        {theme === "dark" ? <Moon /> : <Sun />}
        <span className="sr-only">Toggle Theme</span>
      </Button>
    )
  }

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={() => {
        setTheme(sysPrefersDarkMode() ? "dark" : "light")
      }}
      {...props}
    >
      {sysPrefersDarkMode() ? <Moon /> : <Sun />}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
})
ThemeTrigger.displayName = "ThemeTrigger"
