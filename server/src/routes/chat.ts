import { Router, Request, Response, NextFunction } from "express";
import { openAIService } from "../services/gemini";
import {
  buildSystemPrompt,
  isValidHumorLevel,
  HumorLevel,
} from "../personas/buildSystemPrompt";
import type { ChatMessage, ChatRequestBody, ChatResponseBody } from "../types";

const router = Router();

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;
const DEFAULT_LEVEL: HumorLevel = 2;

function validateHistory(history: unknown): ChatMessage[] {
  if (history === undefined) return [];
  if (!Array.isArray(history)) {
    throw new Error("history bir dizi olmalı.");
  }
  const trimmed = history.slice(-MAX_HISTORY_MESSAGES);
  return trimmed.map((item, i) => {
    if (
      !item ||
      typeof item !== "object" ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string"
    ) {
      throw new Error(`history[${i}] geçersiz formatta.`);
    }
    return {
      role: item.role,
      content: item.content.slice(0, MAX_MESSAGE_LENGTH),
    };
  });
}

router.post(
  "/",
  async (
    req: Request<{}, ChatResponseBody, ChatRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { message, level, history } = req.body ?? {};

      if (typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "message alanı zorunlu ve boş olamaz." });
      }
      if (message.length > MAX_MESSAGE_LENGTH) {
        return res
          .status(400)
          .json({ error: `message en fazla ${MAX_MESSAGE_LENGTH} karakter olabilir.` });
      }

      const humorLevel: HumorLevel = isValidHumorLevel(level) ? level : DEFAULT_LEVEL;

      let safeHistory: ChatMessage[];
      try {
        safeHistory = validateHistory(history);
      } catch (e) {
        return res.status(400).json({ error: (e as Error).message });
      }

      const systemPrompt = buildSystemPrompt(humorLevel);
      const reply = await openAIService.generateReply(systemPrompt, safeHistory, message.trim());

      const body: ChatResponseBody = { reply, level: humorLevel };
      res.json(body);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
