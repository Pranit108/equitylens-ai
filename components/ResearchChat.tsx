// "use client";

// import { useEffect, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { formatAiError, postAi } from "@/lib/fetch-ai";

// interface ResearchChatProps {
//   company: string;
//   initialPrompt: string;
// }

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// export default function ResearchChat({
//   company,
//   initialPrompt,
// }: ResearchChatProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!initialPrompt) return;

//     sendMessage(initialPrompt);
//   }, [initialPrompt]);

//   async function sendMessage(customQuestion?: string) {
//     const question = customQuestion ?? input;

//     if (!question.trim() || loading) return;

//     const userMessage: Message = {
//       role: "user",
//       content: question,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

    
//     try {
//       const { ok, data } = await postAi("/api/ai/chat", {
//         company,
//         question,
//       });

//       if (!ok || !data.text) {
//         throw new Error(formatAiError(data));
//       }

//       const aiMessage: Message = {
//         role: "assistant",
//         content: data.text,
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (err) {
//       console.error(err);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             err instanceof Error
//               ? err.message
//               : "Sorry, something went wrong while generating the research.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900">
//       {/* Header */}

//       <div className="border-b border-zinc-800 px-6 py-4">
//         <h2 className="text-xl font-bold">Research Chat</h2>

//         <p className="mt-1 text-sm text-zinc-400">
//           Ask anything about{" "}
//           <span className="font-semibold capitalize text-white">
//             {company}
//           </span>
//         </p>
//       </div>

//       {/* Messages */}

//       <div className="h-[500px] overflow-y-auto p-6 space-y-5">
//         {messages.length === 0 && (
//           <div className="flex h-full items-center justify-center text-zinc-500 text-center">
//             <div>
//               <p className="text-lg font-medium">
//                 Start researching {company}
//               </p>

//               <p className="mt-2 text-sm">
//                 Ask about financials, risks, management, valuation,
//                 competitors, earnings, or anything else.
//               </p>
//             </div>
//           </div>
//         )}

//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.role === "user"
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-3xl rounded-2xl px-5 py-4 ${
//                 message.role === "user"
//                   ? "bg-blue-600 text-white"
//                   : "bg-zinc-800 text-zinc-100"
//               }`}
//             >
//               <div className="prose prose-invert max-w-none">
//                 <ReactMarkdown>
//                 {message.content}
//               </ReactMarkdown> </div>
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//             <div className="rounded-2xl bg-zinc-800 px-5 py-4 text-zinc-400 animate-pulse">
//               EquityLens AI is researching...
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input */}

//       <div className="border-t border-zinc-800 p-4">
//         <div className="flex gap-3">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 sendMessage();
//               }
//             }}
//             placeholder={`Ask anything about ${company}...`}
//             className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-blue-500"
//           />

//           <button
//             disabled={loading}
//             onClick={() => sendMessage()}
//             className="rounded-xl bg-blue-600 px-6 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {loading ? "..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
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
  initialPrompt,
}: ResearchChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialPrompt) return;
    sendMessage(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  async function sendMessage(customQuestion?: string) {
    const question = customQuestion ?? input;

    if (!question.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          question,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate response.");
      }

      if (!res.body) {
        throw new Error("No response body.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullResponse = "";

      // Create an empty assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        fullResponse += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: fullResponse,
          };

          return updated;
        });
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Sorry, something went wrong while generating the research.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-xl font-bold">Research Chat</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Ask anything about{" "}
          <span className="font-semibold capitalize text-white">
            {company}
          </span>
        </p>
      </div>

      <div className="h-[500px] overflow-y-auto space-y-5 p-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-zinc-500">
            <div>
              <p className="text-lg font-medium">
                Start researching {company}
              </p>

              <p className="mt-2 text-sm">
                Ask about financials, risks, valuation, management,
                competitors, earnings, or anything else.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl rounded-2xl px-5 py-4 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-zinc-800 px-5 py-4 text-zinc-400">
              EquityLens AI is researching...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 p-4">
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
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <button
            disabled={loading}
            onClick={() => sendMessage()}
            className="rounded-xl bg-blue-600 px-6 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}