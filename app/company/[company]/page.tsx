"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResearchChat from "@/components/ResearchChat";
import ResearchPulse from "@/components/ResearchPulse";
import { formatAiError, postAi } from "@/lib/fetch-ai";

export default function CompanyPage() {
  const params = useParams();
  const company = decodeURIComponent(params.company as string);

  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsError, setQuestionsError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCompanyData() {
      setQuestionsError("");

      const { ok, data } = await postAi("/api/ai", {
        company,
        question:
          "Generate an overview and 8 suggested investor questions.",
      });

      if (cancelled) return;

      if (!ok || !data.text) {
        setQuestionsError(formatAiError(data));
        return;
      }

      try {
        const cleaned = data.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        setQuestions(parsed.questions ?? []);
      } catch (error) {
        console.error(error);
        setQuestionsError("Failed to parse suggested questions.");
      }
    }

    loadCompanyData();

    return () => {
      cancelled = true;
    };
  }, [company]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-5xl font-bold mb-8 capitalize">
        {company}
      </h1>

      {/*<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold mb-4">
          AI Summary
        </h2>

        <p className="text-zinc-300 whitespace-pre-wrap">
          {summary}
        </p>
      </div>*/}

      <ResearchPulse 
        company={company}
        onTopicClick={setSelectedTopic}
         />

        

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Suggested Questions
        </h2>

        {questionsError ? (
          <p className="text-sm text-amber-400">{questionsError}</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-zinc-500">Loading suggested questions...</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(question)}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
      <ResearchChat 
      company={company}
      initialPrompt={selectedTopic} />
    </main>
  );
}