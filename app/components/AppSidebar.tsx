'use client'; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useState } from "react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
type ChatMeta = {
  id: string;
  name: string;
};

export function AppSidebar() {
  const [listOfChats] = useState<ChatMeta[]>([
    { id: "1", name: "Chat 1" },
    { id: "2", name: "Chat 2" },
    { id: "3", name: "Chat 3" },
  ]);


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4 text-xl font-semibold"> Traffic Helper </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col p-4 space-y-2">
            <button
              className="flex items-center p-2 space-x-2 hover:bg-gray-200 rounded text-blue-600"
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
      <SidebarFooter>
        <div className="p-4 text-gray-500 text-sm">© 2024 CorpusMining-Studio </div>
      </SidebarFooter>
    </Sidebar>
  );
}
