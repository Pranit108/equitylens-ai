import { generalPrompt } from "./general";
import { explainPrompt } from "./explain";
import { comparePrompt } from "./compare";
import { riskPrompt } from "./risk";
import { overviewPrompt } from "./overview";

export function getPrompt(
  company: string,
  question: string
) {
  if (!company || !question) {
    throw new Error("company and question are required");
  }

  const q = question.toLowerCase();

  if (q.includes("overview") && q.includes("questions")) {
    return overviewPrompt(company);
  }

  if (
    q.startsWith("what is") ||
    q.startsWith("explain") ||
    q.startsWith("how does")
  ) {
    return explainPrompt(company, question);
  }

  if (
    q.includes("compare") ||
    q.includes("vs") ||
    q.includes("versus")
  ) {
    return comparePrompt(company, question);
  }

  if (
    q.includes("risk") ||
    q.includes("threat") ||
    q.includes("downside")
  ) {
    return riskPrompt(company, question);
  }

  return generalPrompt(company, question);
}