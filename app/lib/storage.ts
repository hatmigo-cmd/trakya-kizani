import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Conversation, HumorLevel } from "../types/chat";

const CONVERSATIONS_KEY = "trakya-kizani:conversations";
const DEFAULT_HUMOR_LEVEL_KEY = "trakya-kizani:default-humor-level";
const ONBOARDING_DONE_KEY = "trakya-kizani:onboarding-done";

export async function getConversations(): Promise<Conversation[]> {
  const raw = await AsyncStorage.getItem(CONVERSATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Conversation[];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  const all = await getConversations();
  return all.find((c) => c.id === id);
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  const all = await getConversations();
  const idx = all.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    all[idx] = conversation;
  } else {
    all.push(conversation);
  }
  await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
}

export async function deleteConversation(id: string): Promise<void> {
  const all = await getConversations();
  const next = all.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));
}

export async function getDefaultHumorLevel(): Promise<HumorLevel> {
  const raw = await AsyncStorage.getItem(DEFAULT_HUMOR_LEVEL_KEY);
  const level = raw ? (Number(raw) as HumorLevel) : 2;
  return [1, 2, 3, 4].includes(level) ? level : 2;
}

export async function setDefaultHumorLevel(level: HumorLevel): Promise<void> {
  await AsyncStorage.setItem(DEFAULT_HUMOR_LEVEL_KEY, String(level));
}

export async function isOnboardingDone(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
  return raw === "true";
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "true");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
