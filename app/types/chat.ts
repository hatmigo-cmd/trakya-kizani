export type HumorLevel = 1 | 2 | 3 | 4;

export const HUMOR_LEVEL_INFO: Record<
  HumorLevel,
  { title: string; description: string }
> = {
  1: { title: "Efendi", description: "Hafif şive, küfür yok" },
  2: { title: "Samimi", description: "Belirgin şive ve mizah" },
  3: { title: "Kahvehane Modu", description: "Bol muhabbet, laf sokma" },
  4: { title: "Delirmiş Kızan", description: "En sert mizah ve laf sokma" },
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  // İleride sesli konuşma desteği için ayrılan alanlar (MVP'de kullanılmıyor):
  audioUri?: string;
}

export interface Conversation {
  id: string;
  title: string;
  humorLevel: HumorLevel;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
