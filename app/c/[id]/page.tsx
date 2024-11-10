"use client"
import React, { useState, useEffect } from "react"
import { type Message, type NewChatMeta } from "@/types/global"
import { marked } from "marked"
import { ChatHeader } from "../../components/ChatHeader"
import {
  useSidebarReloader,
  ReloadState,
} from "@/app/components/providers/SidebarReloader"
import { Textarea } from "@/app/components/Textarea"
import { sleep } from "@/lib/utils"
import { SearchService, UploadService } from "@/app/api"
import { completeChat, updateChat } from "./helper"

const env = process.env.NODE_ENV

export default function Home({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState("")
  const [prompt, setPrompt] = useState("")
  const { setReload } = useSidebarReloader()

  useEffect(() => {
    if (env === "development") {
      // Dev mode load useEffect twice
      if (sessionStorage.getItem("newchat_processed") === "true") {
        sessionStorage.removeItem("newchat_processed")
        return
      }
    }

    // Get new chat data from sessionStorage
    const newChatStorage = sessionStorage.getItem("newchat")
    const newChatData: NewChatMeta =
      newChatStorage !== null ? JSON.parse(newChatStorage) : null

    const loadNewChat = () => {
      console.log("Loading new chat data from sessionStorage")
      setModel(newChatData.model)
      setMessages([
        { id: 0, role: "user", text: newChatData.prompt },
        { id: 1, role: "assistant", text: "Loading..." },
      ])
      sessionStorage.removeItem("newchat")
      ;(async () => {
        const response = await completeChat({
          chat_type: newChatData.model,
          history: [{ id: 0, role: "user", text: newChatData.prompt }],
        })
        if (!response.ok) {
          setError("Failed to fetch user data")
          return
        }
        const botRes = await updateChat(setMessages, response, 1)
        const { error } = await UploadService.uploadChat(
          JSON.stringify({
            user_id: "usertest",
            chat_id: params.id,
            chat_type: newChatData.model,
            history: [
              { id: 0, role: "user", text: newChatData.prompt },
              { id: 1, role: "assistant", text: botRes },
            ],
          })
        )
        if (error) {
          setError(error)
          return
        }
        console.log("Chat data uploaded successfully")
        sleep(1000)
        setReload(ReloadState.RELOAD)
        console.log("Sidebar reload triggered")
      })()
    }

    const loadFromRemote = () => {
      console.log("Loading chat history from remote")
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
    }

    if (newChatStorage !== null && messages.length === 0) {
      loadNewChat()
      if (env === "development")
        sessionStorage.setItem("newchat_processed", "true")
    } else {
      if (messages.length !== 0) return
      loadFromRemote()
    }
    return
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newId = messages.length
    const userMessage: Message = { id: newId, role: "user", text: prompt }
    setMessages((prev) => [...prev, userMessage])
    setPrompt("")

    // Prepare data for API request
    const data = {
      chat_type: "交通",
      history: [...messages, userMessage].map((msg, idx) => ({
        id: idx,
        role: msg.role,
        text: msg.text,
      })),
    }

    setMessages((prev) => [
      ...prev,
      { id: newId + 1, role: "assistant", text: "Loading..." },
    ])

    const response = await completeChat(data)
    const botResponse = await updateChat(setMessages, response, newId + 1)
    ;(async () => {
      const { error } = await UploadService.uploadChat(
        JSON.stringify({
          user_id: "usertest",
          chat_id: params.id,
          history: [
            userMessage,
            { id: newId + 1, role: "assistant", text: botResponse },
          ],
        })
      )
      if (error) {
        setError(error)
        return
      }
      console.log("Chat data uploaded successfully")
    })()
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {error ? <p className="text-red-500">{error}</p> : <></>}
      <div className="relative mt-3 flex-1 overflow-y-scroll overflow-x-clip">
        <ChatHeader />
        <p>Model: {model}</p>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded ${message.role === "user" ? "bg-chat-user" : "bg-chat-assistant"}`}
          >
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked(message.text) }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 px-3">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-4 flex items-center"
        >
          <Textarea
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
