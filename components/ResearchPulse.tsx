"use client";

import { useEffect, useState } from "react";

interface PulseData {
  summary: string;
  bullCase: {
    title: string;
    reason: string;
  }[];
  bearCase: {
    title: string;
    reason: string;
  }[];
  topics: string[];
  confidence: {
    level: string;
    reason: string;
  };
}

export default function ResearchPulse({
  company,
  onTopicClick
}: {
  company: string;
  onTopicClick: (topic: string) => void;
}) {
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPulse() {
      try {
        const res = await fetch("/api/pulse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company,
          }),
        });

        const data = await res.json();

        const cleaned = data.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        setPulse(parsed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPulse();
  }, [company]);

  if (loading) {
    return (
      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold">
          🔥 Research Pulse
        </h2>

        <p className="mt-4 text-zinc-500">
          Generating research pulse...
        </p>
      </section>
    );
  }

  if (!pulse) {
    return (
      <section className="mt-10 rounded-xl border border-red-900 bg-red-950/20 p-6">
        Failed to generate Research Pulse.
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          🔥 Research Pulse
        </h2>

        <p className="text-zinc-500 mt-1">
          AI-generated snapshot of what matters today.
        </p>
      </div>

      {/* Overall View */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 mb-6">
        <h3 className="font-semibold text-lg mb-3">
          Overall View
        </h3>

        <p className="text-zinc-300 leading-7">
          {pulse.summary}
        </p>
      </div>

      {/* Bull / Bear */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-green-900 bg-green-950/20 p-5">
          <h3 className="text-green-400 font-semibold mb-4">
            🟢 Bull Case
          </h3>

          <div className="space-y-4">
            {pulse.bullCase.map((item) => (
              <div key={item.title}>
                <h4 className="font-medium">
                  {item.title}
                </h4>

                <p className="text-sm text-zinc-400 mt-1">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-red-900 bg-red-950/20 p-5">
          <h3 className="text-red-400 font-semibold mb-4">
            🔴 Bear Case
          </h3>

          <div className="space-y-4">
            {pulse.bearCase.map((item) => (
              <div key={item.title}>
                <h4 className="font-medium">
                  {item.title}
                </h4>

                <p className="text-sm text-zinc-400 mt-1">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">
          🏷 Trending Topics
        </h3>

        <div className="flex flex-wrap gap-3">
          {pulse.topics.map((topic) => (
            <button
              key={topic}
              onClick={() =>
                onTopicClick(`Explain ${topic} for ${company}.`)
              }
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm transition hover:bg-blue-600 hover:text-white"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <div className="rounded-xl border border-blue-900 bg-blue-950/20 p-5">
        <h3 className="font-semibold mb-2">
          Research Confidence
        </h3>

        <p className="text-blue-400 font-medium">
          {pulse.confidence.level}
        </p>

        <p className="text-zinc-400 text-sm mt-2">
          {pulse.confidence.reason}
        </p>
      </div>
    </section>
  );
}