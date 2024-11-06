'use client'; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useState, useEffect } from "react";
import { PlusIcon, PencilSquareIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";

type ChatRoomMeta = {
  id: string;
  name: string;
};

const elasticService = "http://34.41.168.21:1769"

export function AppSidebar() {
  const [listOfChats, setListOfChats] = useState<ChatRoomMeta[]>([{ id: "1", name: "Chat 1" }]);
  const [isDarkMode, setIsDarkMode] = useState(true); 

  // 新增聊天室並且計數
  async function addNewChat() {
    const newChatId = uuidv4();
    const newChat = { id: newChatId, name: `Chat ${listOfChats.length + 1}` };

    // 向後端發送請求以創建新聊天室並初始化資料
    const response = await fetch(`${elasticService}/api/upload/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: "usertest",  // 假設固定使用者 ID
        chat_id: "newChatId",
        history: [
          {
            id: 0,
            role: "system",
            text: "You are a bot. You can chat with me."
          }
        ]
      }),
    });

    if (response.ok) {
      // 更新狀態，添加新的聊天室到清單
      setListOfChats((prevChats) => [...prevChats, newChat]);
    } else {
      console.error("Failed to create new chat:", await response.text());
    }
  }
  
  // // load chatRoom
  // useEffect(() => {
  // }, []);

  
  // Function to toggle dark mode
  function toggleDarkMode() {
    setIsDarkMode((prevMode) => !prevMode);
  }

  return (
    <Sidebar className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}> 
      <SidebarHeader className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="flex items-center justify-between p-4 text-xl font-GeistMonoVF">
          <span>Traffic Helper</span>
          <button className="p-2 rounded-md" onClick={toggleDarkMode}>
            {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
          </button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}> 
        <SidebarGroup>
          <div className="flex flex-col p-4 space-y-2 font-GeistMonoVF">
            <button
              className="flex items-center p-2 space-x-2 font-GeistMonoVF"
              onClick={addNewChat}
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Chat</span>
            </button>
            {listOfChats.map((chat) => (
              <a
                href={"/c/" + chat.id}
                key={chat.id}
                className={`flex items-center p-2 rounded space-x-2 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>{chat.name}</span>
              </a>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="p-4 font-GeistMonoVF">© 2024 CorpusMining-Studio</div>
      </SidebarFooter>
    </Sidebar>
  );
}
