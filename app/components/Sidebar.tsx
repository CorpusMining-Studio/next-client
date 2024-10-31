"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";

type ChatMeta = {
  id: string;
  name: string;
};

type SidebarProps = {
  className?: string;
};

export function Sidebar(props: SidebarProps) {
  const { isOpen, toggleSidebar, closeSidebar, openSidebar } = useSidebar();
  // const [isOpen, setIsOpen] = useState(props.open.value);
  const listOfChats: ChatMeta[] = [
    // Should be fetched from server
    { id: "1", name: "Chat 1" },
    { id: "2", name: "Chat 2" },
    { id: "3", name: "Chat 3" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // if (!isOpen) {
  //   return <></>;
  // }

  return (
    <div className={cn("flex flex-col", "")}>
      {/* Toggle Button */}
      <button
        onClick={() => toggleSidebar()}
        className="p-2 m-2 border rounded"
      >
        <PanelLeft />
      </button>

      {/* Overlay to close drawer when clicked outside */}
      {isOpen && (
        <div
          onClick={() => closeSidebar()}
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
        ></div>
      )}

      {/* Sidebar as a drawer on small screens, toggleable on all screens */}
      <div
        className={cn(
          "bg-white shadow-md transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "duration-300",
          props.className
        )}
      >
        <button onClick={() => closeSidebar()} className="p-2 border-b">
          <PanelLeft />
        </button>
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
      </div>
    </div>
  );
}
