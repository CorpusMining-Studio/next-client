"use client";
import React, { useState } from "react";
import { type NewChatMeta } from "@/types/global";

export default function Home() {
  const [model, setModel] = useState("交通");
  const modelOptions = ["交通", "民事"];

  const [prompt, setPrompt] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newChatData: NewChatMeta = {
      id: "new-page-id",
      prompt: prompt,
      model: model,
    };
    sessionStorage.setItem("newchat", JSON.stringify(newChatData));
    location.href = "/c/new-page-id";
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          請選擇模型
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.currentTarget.value)}
          className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {modelOptions.map((model, index) => (
            <option value={model} key={index}>
              {model}
            </option>
          ))}
        </select>
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
