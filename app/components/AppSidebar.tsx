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
import { Ellipsis, XIcon } from "lucide-react"
import { useSidebarReloader, ReloadState } from "./providers/SidebarReloader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { SearchService, DeleteService } from "@/app/api"
import { HomeIcon } from "@heroicons/react/24/solid"
// import { SidebarTrigger } from "@/components/ui/sidebar"

type ChatMeta = {
  id: string
  name: string
}

export function AppSidebar() {
  const userId = "usertest" // Temporary user id for all users
  const [error, setError] = useState<string | null>(null)
  const [rooms, setRooms] = useState<ChatMeta[]>([])
  const { reload, setReload } = useSidebarReloader()

  async function deleteChat(id: string) {
    const { error } = await DeleteService.deleteChat(userId, id)
    if (error) {
      setError(error)
      return
    }
    console.log("Chat deleted")
    setReload(ReloadState.RELOAD)
  }

  useEffect(() => {
    if (reload === ReloadState.RELOAD) {
      setReload(ReloadState.RELOADING)
      console.log("Reloading sidebar")
      ;(async () => {
        // Fetch user data
        const { data, error } = await SearchService.searchUserChat(userId)
        if (error) {
          setError(error)
          return
        }
        setRooms(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          data.message.map((props: any) => ({
            id: props.chat_room,
            name: props.chat_room.replace(/_/g, " "),
          }))
        )
        setReload(ReloadState.RELOADED)
        console.log("Sidebar reloaded")
      })()
    }
  }, [reload])

  useEffect(() => {
    ;(async () => {
      // Fetch user data
      const { data, error } = await SearchService.searchUserChat(userId)
      if (error) {
        setError(error)
        return
      }
      setRooms(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        data.message.map((props: any) => ({
          id: props.chat_room,
          name: props.chat_room.replace(/_/g, " "),
        }))
      )
    })()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-lg font-semibold"> Chat history</h1>
        {error ? (
          <Alert
            variant="destructive"
            className="flex justify-between items-center px-2 py-1"
          >
            {error}
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <XIcon />
            </Button>
          </Alert>
        ) : (
          <></>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link
            href="/"
            className="flex h-10 px-2 items-center gap-2 hover:bg-accent rounded"
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
                className="relative group/link h-10 px-2 flex items-center hover:bg-accent rounded"
              >
                <span className="whitespace-nowrap overflow-x-hidden">
                  {chat.name}
                </span>
                <div className="absolute bottom-0 top-0 right-0 w-8 h-full from-sidebar from-0% to-transparent bg-gradient-to-l"></div>
                <div className="absolute right-0 invisible group-hover/link:visible">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="">
                      <Button variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="" align="start">
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => await deleteChat(chat.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Link>
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
