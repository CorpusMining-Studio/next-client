"use client"
import React, { useState } from "react"
import { type NewChatMeta } from "@/types/global"
import { Textarea } from "./components/Textarea"

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL

export default function Home() {
  const [model, setModel] = useState("交通")
  const modelOptions = ["交通", "民事"]

  const [prompt, setPrompt] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await fetch(`${MAIN_SERVER_URL}/new_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
    if (!response.ok) {
      alert("Failed to create new chat")
      return
    }
    let id = await response.json()
    id = id.message.replace(/ /g, "_")
    const newChatData: NewChatMeta = {
      id: id,
      prompt: prompt,
      model: model,
    }
    sessionStorage.setItem("newchat", JSON.stringify(newChatData))
    location.href = `/c/${id}`
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          請選擇模型
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.currentTarget.value)}
          className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {modelOptions.map((model, index) => (
            <option value={model} key={index}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-4 flex items-center"
        >
          <Textarea
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            className="w-96"
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
