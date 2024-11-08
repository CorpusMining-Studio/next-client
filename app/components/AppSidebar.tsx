"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { HomeIcon } from "lucide-react"

const ES_URL = process.env.NEXT_PUBLIC_ES_URL

type ChatMeta = {
  id: string
  name: string
}

export function AppSidebar() {
  const userId = "usertest" // Temporary user id for all users
  const [error, setError] = useState<string | null>(null)
  const [rooms, setRooms] = useState<ChatMeta[]>([])

  useEffect(() => {
    ;(async () => {
      // Fetch user data
      const response = await fetch(ES_URL + "/api/search/userchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })
      if (!response.ok) {
        setError("Failed to fetch user data")
        return
      }
      const data = await response.json()
      setRooms(data.message.map((id: string) => ({ id: id, name: id })))
    })()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        {error ? <></> : <p className="text-red-500">{error}</p>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link
            href="/"
            className="flex h-10 px-2 items-center gap-2 hover:bg-gray-100 rounded"
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            New Chat
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <nav className="flex flex-col space-y-2">
            {rooms.map((chat) => (
              <Link
                href={"/c/" + chat.id}
                key={chat.id}
                className="h-10 px-2 flex items-center hover:bg-gray-100 rounded"
              >
                {chat.name}
              </Link>
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
