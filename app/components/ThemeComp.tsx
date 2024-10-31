'use client'
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

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

export function ThemeIcon({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const sysPrefersDarkMode = () => {
    if (typeof window !== 'undefined')
      return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (theme == 'dark') {
    return (
      <button onClick={() => setTheme('light')}>
        <Moon className={className} />
      </button>
    )
  }

  if (theme == 'light') {
    return (
      <button onClick={() => setTheme('dark')}>
        <Sun className={className} />
      </button>
    )
  }

  // System default theme
  if (sysPrefersDarkMode()) {
    return (
      <button onClick={() => setTheme('light')}>
        <Moon className={className} />
      </button>
    )
  }
  return (
    <button onClick={() => setTheme('dark')}>
      <Sun className={className} />
    </button>
  )
}
