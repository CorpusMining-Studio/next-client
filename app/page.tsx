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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { uuid } from "@/lib/utils"

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL

type ModelOption = {
  name: string
  desc: string
  value: string
}
const modelOptions: ModelOption[] = [
  { name: "交通", desc: "交通意外、交通糾紛", value: "交通" },
  {
    name: "民事",
    desc: "民事案件（財產糾紛、身份關係糾紛...）",
    value: "民事",
  },
  { name: "GPT4", desc: "日常任務", value: "gpt-4o-mini" },
]

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState<ModelOption>(modelOptions[0])

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
    const name = await response.json()
    const newChatData: NewChatMeta = {
      id: uuid(),
      name: name.message,
      prompt: prompt,
      model: model.value,
    }
    sessionStorage.setItem("newchat", JSON.stringify(newChatData))
    location.href = `/c/${newChatData.id}`
  }

  return (
    <div className="relative h-full flex flex-col justify-center items-center">
      <div className="absolute flex flex-row items-center space-x-1 top-4 left-4 text-lg font-semibold">
        <SidebarTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="px-4 py-2 rounded-md cursor-pointer text-center hover:dropMenu">
              {model.name}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-lg shadow-lg p-3 ">
            {modelOptions.map((option, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setModel(option)}
                className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer"
              >
                <div>
                  <div className="text-base">{option.name}</div>
                  <div className="text-sm text-gray-400">{option.desc}</div>
                </div>
                {model.name === option.name && (
                  <CircleCheck className="h-5 w-5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 text-center">
        <h1 className="text-4xl font-semibold mb-2 select-transparent">
          Your Best Traffic Helper!
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
