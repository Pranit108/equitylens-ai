export function riskPrompt(company: string, question: string) {
  return `
You are EquityLens AI.

Company:
${company}

Question:
${question}

Analyze the risks.

Cover:
- Business risks
- Financial risks
- Industry risks
- Key metrics investors should monitor

Avoid speculation.

Finish with 3 follow-up questions.
`;
}