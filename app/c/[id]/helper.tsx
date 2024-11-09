import React from "react"
import { type Message } from "@/types/global"

type CompletionData = {
  chat_type: string
  history: {
    id: number
    role: string
    text: string
  }[]
}

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL

// Send request to main server
export async function completeChat(data: CompletionData) {
  const response = await fetch(`${MAIN_SERVER_URL}/chat-test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(data),
  })
  return response
}

export async function updateChat(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  response: Response,
  newId: number
) {
  let assistantMessage = ""
  if (response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let result
    while (!(result = await reader.read()).done) {
      const chunk = decoder.decode(result.value, { stream: true })
      assistantMessage += chunk
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { id: newId, role: "assistant", text: assistantMessage },
      ])
    }
    return assistantMessage
  }
}