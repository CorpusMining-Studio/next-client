"use client";
import React, { useState, useEffect } from "react";
import { type Message, type NewChatMeta } from "@/types/global";
import { marked } from "marked";
import { ChatHeader } from "../../components/ChatHeader";

type CompletionData = {
  chat_type: string;
  history: {
    id: number;
    role: string;
    text: string;
  }[];
};

const MAIN_SERVER_URL = process.env.NEXT_PUBLIC_MAIN_SERVER_URL;

// Send request to main server
async function completeChat(data: CompletionData) {
  const response = await fetch(`${MAIN_SERVER_URL}/chat-test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

async function updateChat(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  response: Response
) {
  let assistantMessage = "";
  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result;
    while (!(result = await reader.read()).done) {
      const chunk = decoder.decode(result.value, { stream: true });
      assistantMessage += chunk;
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: assistantMessage },
      ]);
    }
  }
}

export default function Home({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    // Get new chat data from sessionStorage
    const newChatStorage = sessionStorage.getItem("newchat");
    const newChatData: NewChatMeta =
      newChatStorage !== null ? JSON.parse(newChatStorage) : null;

    if (newChatData !== null) {
      setModel(newChatData.model);
      setMessages([
        { role: "user", content: newChatData.prompt },
        { role: "assistant", content: "Loading..." },
      ]);
      sessionStorage.removeItem("newchat");

      (async () => {
        const response = await completeChat({
          chat_type: newChatData.model,
          history: [{ id: 0, role: "user", text: newChatData.prompt }],
        });
        updateChat(setMessages, response);
      })();
    }
    // Fetch chat history from server
    console.log("Fetching chat history from server with id: ", params.id);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    // Prepare data for API request
    const data = {
      chat_type: "交通",
      history: [...messages, userMessage].map((msg, idx) => ({
        id: idx,
        role: msg.role,
        text: msg.content,
      })),
    };

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Loading..." },
    ]);

    const response = await completeChat(data);
    updateChat(setMessages, response);
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="relative mt-6 flex-1 overflow-y-scroll overflow-x-clip">
        <ChatHeader />
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked(message.content) }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-4 flex items-center"
        >
          <input
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            placeholder="Type your message here..."
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
