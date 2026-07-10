"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [company, setCompany] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!company.trim()) return;

    router.push(`/company/${company}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-6">
      <h1 className="text-6xl font-bold mb-4">
        EquityLens
      </h1>

      <p className="text-zinc-400 mb-8">
        AI-powered Equity Research
      </p>

      <input
        type="text"
        placeholder="Search companies..."
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        className="w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg outline-none focus:border-blue-500"
      />

      <button
        onClick={handleSearch}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-500 transition"
      >
        Search
      </button>
    </main>
  );
}