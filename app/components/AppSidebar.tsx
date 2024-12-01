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
import { Ellipsis, HomeIcon, XIcon } from "lucide-react"
import { useSidebarReloader, ReloadState } from "./providers/SidebarReloader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { SearchService, DeleteService, UpdateService } from "@/app/api"
import { Input } from "@/components/ui/input"

type ChatMeta = {
  id: string
  name: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function updateChatList(data: any, setRooms: React.Dispatch<any>) {
  setRooms(
    data.message.map((props: any) => ({
      id: props.chat_id,
      name: props.chat_name,
    }))
  )
}

export function AppSidebar() {
  const userId = "usertest" // Temporary user id for all users
  const [error, setError] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string>("")
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

  async function changeChatName(evt: React.KeyboardEvent) {
    if (evt.key === "Enter") {
      console.log("New name: ", (evt.target as HTMLInputElement).value)
      const newName = (evt.target as HTMLInputElement).value
      const chatId = (evt.target as HTMLInputElement).id.replace("-rename", "")
      setRooms((prevRooms) => {
        const newRooms = prevRooms.map((room) => {
          if (room.id === chatId) {
            return { id: room.id, name: newName }
          }
          return room
        })
        return newRooms
      })
      document.getElementById(chatId + "-rename")?.blur()
      setRenaming("")
      const { error } = await UpdateService.updateChatName(
        chatId,
        userId,
        newName
      )
      if (error) {
        setError(error)
        return
      }
    }
  }

  useEffect(() => {
    const input = document.getElementById(renaming)
    if (input) {
      setTimeout(() => input.focus(), 10)
    }
  }, [renaming])

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
        updateChatList(data, setRooms)
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
      updateChatList(data, setRooms)
    })()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
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
                {chat.id + "-rename" === renaming ? (
                  <Input
                    id={chat.id + "-rename"}
                    defaultValue={chat.name}
                    onKeyDown={(evt) => changeChatName(evt)}
                    onBlur={() => setRenaming("")}
                  ></Input>
                ) : (
                  <span className="whitespace-nowrap overflow-x-hidden">
                    {chat.name}
                  </span>
                )}
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
                        onClick={() => setRenaming(chat.id + "-rename")}
                      >
                        Rename
                      </DropdownMenuItem>
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
