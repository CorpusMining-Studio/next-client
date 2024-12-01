import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + ms);
}

export function uuid() {
  return Math.random().toString(36).substring(2)
}
