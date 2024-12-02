"use client"
import React, { useState, useEffect } from "react"
import { marked } from "marked"
import { SearchService } from "@/app/api"
import { type Message } from "@/types/global"
import { ChatHeader } from "@/app/components/ChatHeader"
import {
  CircleUserRound,
  MessageSquareQuote,
  ThumbsUp,
  ThumbsDown,
  FlagTriangleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home({ params }: { params: { id: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Fetch chat history from server
    ;(async () => {
      const { data, error } = await SearchService.searchChat(
        "usertest",
        params.id
      )
      if (error) {
        setError(error)
        return
      }
      setModel(data.chat_type)
      setMessages(
        data.history.map((msg: { role: string; text: string }) => ({
          role: msg.role,
          text: msg.text,
        }))
      )
    })()
  })

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {error ? <p className="text-red-500">{error}</p> : <></>}
      <div className="relative mt-3 flex-1 overflow-y-scroll overflow-x-clip">
        <ChatHeader />
        <div className="flex items-center space-x-2 p-3 w-full justify-end">
          <p>This is a copy of conversation shared by anonymous user</p>
          <Button onClick={() => {}} size="icon">
            <ThumbsUp />
          </Button>
          <Button onClick={() => {}} size="icon">
            <ThumbsDown />
          </Button>
          <Button onClick={() => {}} size="icon">
            <FlagTriangleRight />
          </Button>
        </div>
        <p>Model: {model}</p>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded ${message.role === "user" ? "" : "bg-chat-assistant"}`}
          >
            <strong className="mr-1">
              {message.role === "user" ? (
                <CircleUserRound className="h-6 w-6 text-blue-500" />
              ) : (
                <MessageSquareQuote className="h-6 w-6 text-green-600" />
              )}
            </strong>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked(message.text) }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
