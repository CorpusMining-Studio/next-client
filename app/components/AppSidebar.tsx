import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { HomeIcon } from "lucide-react";

type ChatMeta = {
  id: string;
  name: string;
};

export function AppSidebar() {
  const listOfChats: ChatMeta[] = [
    // Should be fetched from server
    { id: "1", name: "Chat 1" },
    { id: "2", name: "Chat 2" },
    { id: "3", name: "Chat 3" },
  ];
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <a
            href="/"
            className="flex h-10 px-2 items-center gap-2 hover:bg-gray-100 rounded"
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            New Chat
          </a>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex flex-col space-y-2">
            {listOfChats.map((chat) => (
              <a
                href={"/c/" + chat.id}
                key={chat.id}
                className="h-10 px-2 flex items-center hover:bg-gray-100 rounded"
              >
                {chat.name}
              </a>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
