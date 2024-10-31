import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

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
        <SidebarGroup />
        <SidebarGroup />
        <div className="flex flex-col p-4 space-y-2">
          {listOfChats.map((chat) => (
            <a
              href={"/c/" + chat.id}
              key={chat.id}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {chat.name}
            </a>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
