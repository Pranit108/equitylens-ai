"use client";

import {useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ResearchChatProps {
  company: string;
  initialPrompt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ResearchChat({ 
  company,
  initialPrompt
  }: ResearchChatProps) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!initialPrompt) return;

  setInput(initialPrompt);
  sendMessage(initialPrompt);
}, [initialPrompt]);

  async function sendMessage(customQuestion?: string) {
    const question = customQuestion ?? input;

    if (!question.trim()) return;

  const userMessage: Message = {
    role: "user",
    content: question,
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `
You are EquityLens AI.

You are an institutional equity research analyst.

Company: ${company}

Answer this question:

${question}

Keep the answer:
- Accurate
- Concise
- Professional
- Around 150-250 words
- Use markdown where helpful
`,
      }),
    });

    const data = await res.json();

    const aiMessage: Message = {
      role: "assistant",
      content: data.text,
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, something went wrong.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold mb-6">
        Research Chat
      </h2>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            Ask anything about{" "}
            <span className="ml-1 capitalize font-semibold">
              {company}
            </span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <ReactMarkdown>
                    {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="text-zinc-500">
            EquityLens AI is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder={`Ask anything about ${company}...`}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={() => sendMessage()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}