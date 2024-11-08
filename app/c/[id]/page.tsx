"use client"
import React, { useState, useEffect } from "react"
import { type Message, type NewChatMeta } from "@/types/global"
import { marked } from "marked"
import { ChatHeader } from "../../components/ChatHeader"

type CompletionData = {
  chat_type: string
  history: {
    id: number
    role: string
    text: string
  }[]
}

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL
const ES_URL = process.env.NEXT_PUBLIC_ES_URL
const env = process.env.NODE_ENV

// Send request to main server
async function completeChat(data: CompletionData) {
  const response = await fetch(`${MAIN_SERVER_URL}/stream_test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(data),
  })
  return response
}

async function updateChat(
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

export default function Home({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState("")
  const [prompt, setPrompt] = useState("")

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
        const res = await fetch(`${ES_URL}/api/upload/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "usertest",
            chat_id: params.id,
            history: [
              { id: 0, role: "user", text: newChatData.prompt },
              { id: 1, role: "assistant", text: botRes },
            ],
          }),
        })
        if (!res.ok) {
          setError("Failed to upload chat data")
          return
        }
        console.log("Chat data uploaded successfully")
      })()
    }

    const loadFromRemote = () => {
      console.log("Loading chat history from remote")
      // Fetch chat history from server
      ;(async () => {
        const response = await fetch(`${ES_URL}/api/search/chatroom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: "usertest", chat_id: params.id }),
        })
        const history = await response.json().then((data) => data.history)
        setMessages(
          history.map((msg: { role: string; text: string }) => ({
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
      const response = await fetch(`${ES_URL}/api/upload/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "usertest",
          chat_id: params.id,
          history: [
            userMessage,
            { id: newId + 1, role: "assistant", text: botResponse },
          ],
        }),
      })
      if (!response.ok) {
        setError("Failed to upload chat data")
        return
      } else {
        console.log("Chat data uploaded successfully")
      }
    })()
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {error ? <p className="text-red-500">{error}</p> : <></>}
      <p>Model: {model}</p>
      <div className="relative mt-6 flex-1 overflow-y-scroll overflow-x-clip">
        <ChatHeader />
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked(message.text) }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-4 flex items-center"
        >
          <input
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            placeholder="Type your message here..."
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
