"use client"
import React, { useEffect } from "react"
import { cn } from "@/lib/utils"

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string
    value: string
    onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void
  }

/**
 * Textarea component, with auto resizing given the min-height and max-height.
 * Default to min-height 80px, and max-height 224px.
 */
export const Textarea = ({
  className,
  value,
  onInput,
  ...props
}: TextareaProps) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)

  const resizeTextArea = () => {
    if (!textAreaRef.current) {
      return
    }

    textAreaRef.current.style.height = "auto" // will not work without this!
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  useEffect(() => {
    resizeTextArea()
    window.addEventListener("resize", resizeTextArea)
  }, [])

  return (
    <textarea
      value={value}
      onInput={(e) => {
        onInput(e)
        resizeTextArea()
      }}
      ref={textAreaRef}
      placeholder="Type your message here..."
      className={cn(
        "m-2 p-1 w-full resize-none min-h-[20px] max-h-[45px] text-lg rounded-md",
        "border-2 border-gray-300 focus:outline-none items-center",
        className
      )}
      {...props}
    />
  )
}
