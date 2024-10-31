'use client'
import React from 'react'
import { ThemeProvider } from 'next-themes'

interface Props {
  children: React.ReactNode
}

function Provider(props: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {props.children}
    </ThemeProvider>
  )
}

export { Provider as ThemeProvider }
