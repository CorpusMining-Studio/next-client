"use client"
import React, { useState } from "react"
import { type NewChatMeta } from "@/types/global"
import { Textarea } from "./components/Textarea"
import { ArrowUpCircleIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid"

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("交通")
  const [dropdown, setDropdown] = useState(false)

  const modelOptions = [
    {name: "交通", description: "不適合任何任務", beta: true}, 
    {name: "民事", description: "不適合任何任務", beta: true},
    {name: "GPT3", description: "適合大多數任務"}
  ]
  const toggleDropdown = () => setDropdown(!dropdown)
  const handleSelectedModel = (selectedModel: string) => {
    setModel(selectedModel)
    setDropdown(false)
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await fetch(`${MAIN_SERVER_URL}/new_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt, model: model }),
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
      <div className="absolute items-center space-x-1 top-4 left-4 text-gray-200 text-lg font-semibold">
      <button
            onClick={toggleDropdown}
            className="flex items-center px-4 py-2 text-white rounded-md text-lg focus:outline-none hover:bg-zinc-900"
          >
            {model}
            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
          </button>
          {dropdown &&(
            <div className= "absolute mt-2 w-64 bg-gray-900 rounded-lg shadow-lg p-3 text-white">
              {modelOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelectedModel(option.name)}
                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
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
                  <CheckIcon className="h-5 w-5 text-white" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h1 className="text-4xl font-semibold text-white mb-12 select-transparent">🧑🏼‍⚖️Your best Traffic Helper!</h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-4 flex items-center rounded-full bg-gray-800 px-4 py-2"
        >
          <Textarea
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            className="w-[600px]"
          />
          <button type="submit">
            <ArrowUpCircleIcon className="h-10 w-10 gray ml-2" />
          </button>
        </form>
        
        <div className="mt-4 flex space-x-4">

        </div>
      
      </div>
    </div>
  )
}
