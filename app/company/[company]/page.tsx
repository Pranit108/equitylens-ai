"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResearchChat from "@/components/ResearchChat";
import ResearchPulse from "@/components/ResearchPulse";

export default function CompanyPage() {
  const params = useParams();
  const company = decodeURIComponent(params.company as string);

  const [summary, setSummary] = useState("Loading AI Summary...");
  const [questions, setQuestions] = useState<string[]>([]);

  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    async function loadCompanyData() {
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

Generate research data for ${company}.

Return ONLY valid JSON.

{
  "overview": "",
  "questions": [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]
}

Rules:
- overview should be under 150 words.


- Generate exactly 8 short questions:

- Maximum 8 words each.
- Sound like Perplexity suggested prompts.
- Suitable for retail investors.
- Avoid jargon.
- Avoid compound questions.
- Each question should explore a different aspect.

Return JSON only.
- No markdown.
- No explanations.
- Return JSON only.
`,
          }),
        });

        const data = await res.json();
        console.log(data);

        const cleaned = data.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        setSummary(parsed.overview);
        setQuestions(parsed.questions);
      } catch (error) {
        console.error(error);
        setSummary("Failed to load company research.");
      }
    }

    loadCompanyData();
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

        <div className="flex flex-wrap gap-3">
          {questions.map((question, index) => (
            <button
              key={index}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <ResearchChat 
      company={company}
      initialPrompt={selectedTopic} />
    </main>
  );
}