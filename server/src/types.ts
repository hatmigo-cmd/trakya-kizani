export type ChatRole = "user" | "assistant";

export type HumorLevel = 1 | 2 | 3 | 4;

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  message: string;
  level?: number;
  history?: ChatMessage[];
}

export interface ChatResponseBody {
  reply: string;
  level: number;
}
