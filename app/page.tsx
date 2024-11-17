"use client"
import React, { useState } from "react"
import { type NewChatMeta } from "@/types/global"
import { Textarea } from "./components/Textarea"
import { CircleArrowUp, CircleCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("交通")

  const modelOptions = [
    { name: "交通", description: "不適合任何任務", beta: true },
    { name: "民事", description: "不適合任何任務", beta: true },
    { name: "GPT3", description: "適合大多數任務" },
  ]

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
    <div className="relative h-full flex flex-col justify-center items-center">
      <div className="absolute items-center space-x-1 top-4 left-4 text-lg font-semibold">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="px-4 py-2 rounded-md cursor-pointer text-center hover:bg-gray-200 dark:hover:bg-gray-700">
              {model}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-lg shadow-lg p-3 ">
            {modelOptions.map((option, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setModel(option.name)}
                className="flex items-center justify-between px-3 py-2 rounded-md  cursor-pointer"
              >
                <div>
                  <div className="text-base">{option.name}</div>
                  <div className="text-sm text-gray-400">
                    {option.description}
                    {option.beta && (
                      <span className="ml-2 px-1 py-0.5 text-xs bg-gray-600 rounded text-white">
                        BETA
                      </span>
                    )}
                  </div>
                </div>
                {model === option.name && (
                  <CircleCheck className="h-5 w-5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 text-center">
        <h1 className="text-4xl font-semibold mb-2 select-transparent">
          🧑🏼‍⚖️Your Best Traffic Helper!
        </h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-5 flex items-center rounded-full px-1 py-1"
        >
          <Textarea
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            className="h-5"
          />
          <Button type="submit" size="icon">
            <CircleArrowUp className="h-5 w-5 gray" />
          </Button>
        </form>
      </div>
    </div>
  )
}
