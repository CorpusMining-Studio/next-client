'use client'; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useState } from "react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { v4 as uuidvd } from "uuid";

type ChatMeta = {
  id: string;
  name: string;
};

export function AppSidebar() {
  const [listOfChats, setListOfChats] = useState<ChatMeta[]>([
    { id: "1", name: "Chat 1" },
    { id: "2", name: "Chat 2" },
    { id: "3", name: "Chat 3" },
  ]);

  // Function to add a new chat
  function addNewChat() {
    const newChat = { id: uuidvd(), name: `Chat ${listOfChats.length + 1}` };
    setListOfChats((prevChats) => [...prevChats, newChat]);
  }


  return (
    <Sidebar className="bg-customSideBar text-white"> 
      <SidebarHeader className="bg-customSideBar"> 
        <SidebarTrigger className="ml-2 h-7 w-7" /> 
        <div className="p-4 text-xl font-GeistMonoVF "> Traffic Helper </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-customSideBar"> 
        <SidebarGroup>
          <div className="flex flex-col p-4 space-y-2 font-GeistMonoVF">
            <button
              className="flex items-center p-2 space-x-2 font-GeistMonoVF"
              onClick={addNewChat}
            >
              <PlusIcon className= "h-5 w-5" />
              <span>New Chat</span>
            </button>
            {listOfChats.map((chat) => (
              <a
                href={"/c/" + chat.id}
                key={chat.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded space-x-2"
              >
                <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                <span>{chat.name}</span>
              </a>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-customSideBar">
        <div className="p-4 text-GeistMonoVF"> © 2024 CorpusMining-Studio </div>
      </SidebarFooter>
    </Sidebar>
  );
}
