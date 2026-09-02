import { openAIService } from "../src/services/gemini";
import { buildSystemPrompt } from "../src/personas/buildSystemPrompt";
import type { HumorLevel } from "../src/types";

export function hasApiKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getModelName(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function getSystemPrompt(level: HumorLevel): string {
  return buildSystemPrompt(level);
}

export interface GenerateResult {
  reply: string;
  latencyMs: number;
}

/**
 * Gerçek uygulamanın kullandığı AYNI kod yolunu (buildSystemPrompt +
 * openAIService.generateReply) çağırır - persona test suite ayrı/kopya bir
 * prompt mantığı kullanmaz, tam olarak /api/chat endpoint'inin
 * kullandığı sistemi test eder.
 */
export async function generatePersonaReply(
  level: HumorLevel,
  question: string
): Promise<GenerateResult> {
  const systemPrompt = getSystemPrompt(level);
  const start = Date.now();
  const reply = await openAIService.generateReply(systemPrompt, [], question);
  return { reply, latencyMs: Date.now() - start };
}
