import type { HeuristicFlags, HumorLevel } from "./types";
import {
  DIALECT_WORDS,
  FAKE_DIALECT_PATTERNS,
  INSULT_KEYWORDS,
  MILD_ARGO,
  STOPWORDS,
  STRONG_PROFANITY,
} from "./lexicons";

const WORD_RE = /[\p{L}]+/gu;

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(WORD_RE) ?? []).map((w) => w);
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function countOccurrences(haystack: string, needle: string): number {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${escaped}\\b`, "gi");
  return (haystack.match(re) ?? []).length;
}

/**
 * Bir cümlenin, sondaki noktalama işaretleri temizlendikten sonra bir
 * Trakya şive kelimesiyle bitip bitmediğini kontrol eder. Bu, istenen
 * başarısızlık örneğini ("...yap beya. Sonra beya şöyle yap beya.")
 * doğrudan hedefler.
 */
function sentenceEndsWithDialectWord(sentence: string): boolean {
  const cleaned = sentence.trim().replace(/[.,!?…]+$/g, "").trim();
  const lastWord = cleaned.split(/\s+/).pop()?.toLowerCase() ?? "";
  return DIALECT_WORDS.includes(lastWord);
}

const FORBIDDEN_LIST_FORMAT_RE = /(^|\n)\s*(?:[-*•]|\d+[.)])\s+/m;

export function evaluateReply(
  reply: string,
  question: string,
  level: HumorLevel
): HeuristicFlags {
  const words = tokenize(reply);
  const wordCount = words.length;
  const sentences = splitSentences(reply);
  const sentenceCount = sentences.length;

  // ── Mekanik şive serpiştirme ──
  const dialectWordsUsed: string[] = [];
  let dialectWordTotal = 0;
  for (const dw of DIALECT_WORDS) {
    const n = countOccurrences(reply, dw);
    if (n > 0) {
      dialectWordsUsed.push(dw);
      dialectWordTotal += n;
    }
  }
  const dialectWordDensity = wordCount > 0 ? dialectWordTotal / wordCount : 0;
  const sentencesEndingWithDialect = sentences.filter(sentenceEndsWithDialectWord).length;
  const dialectSentenceEndingRatio =
    sentenceCount > 0 ? sentencesEndingWithDialect / sentenceCount : 0;

  // Örnek "Ula beya, bunu yap beya. Sonra beya şöyle yap beya." gibi
  // metinleri yakalayacak eşikler: ya cümlelerin çoğu bir şive kelimesiyle
  // bitiyor, ya da şive kelimesi yoğunluğu anormal derecede yüksek.
  const mechanicalDialectStuffing =
    (sentenceCount >= 2 && dialectSentenceEndingRatio >= 0.6) || dialectWordDensity >= 0.12;

  // ── Yapay/fonetik bozma şive hissi ──
  const fakeDialectMatches: string[] = [];
  for (const pattern of FAKE_DIALECT_PATTERNS) {
    const matches = reply.match(pattern);
    if (matches) fakeDialectMatches.push(...matches);
  }
  const fakeDialectFeel = fakeDialectMatches.length > 0;

  // ── Yasak liste/rapor formatı (basePrompt kural 7) ──
  const usesForbiddenListFormat = FORBIDDEN_LIST_FORMAT_RE.test(reply);

  // ── Aşırı uzunluk (kaba üst sınır, kesin hüküm değil) ──
  const excessiveLength = wordCount > 220;

  // ── Kullanıcıyı aşağılama şüphesi ──
  const insultMatches = INSULT_KEYWORDS.filter((kw) =>
    reply.toLowerCase().includes(kw.toLowerCase())
  );
  const insultToUserSuspected = insultMatches.length > 0;

  // ── Küfür/argo taraması ve seviyeye uygunluk ──
  const strongHits = STRONG_PROFANITY.filter((w) => countOccurrences(reply, w) > 0);
  const mildHits = MILD_ARGO.filter((w) => reply.toLowerCase().includes(w.toLowerCase()));
  const profanityHits = [...strongHits, ...mildHits];
  const profanitySeverity: 0 | 1 | 2 = strongHits.length > 0 ? 2 : mildHits.length > 0 ? 1 : 0;

  // profanityRules.ts: level 1 -> hiç küfür/argo yok; level 2 -> çok nadir,
  // ağır küfür olmamalı; level 3-4 -> ağır küfür olabilir ama level 1'de
  // asla, level 2'de ağır küfür olmamalı.
  const profanityLevelMismatch =
    (level === 1 && profanitySeverity > 0) || (level === 2 && profanitySeverity === 2);

  // ── Kaba alaka sinyali ──
  const questionTokens = new Set(
    tokenize(question).filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
  const replyTokenSet = new Set(words.filter((w) => w.length > 2 && !STOPWORDS.has(w)));
  let overlap = 0;
  for (const t of questionTokens) {
    if (replyTokenSet.has(t)) overlap += 1;
  }
  const relevanceKeywordOverlap =
    questionTokens.size > 0 ? overlap / questionTokens.size : 1;
  const lowRelevanceSuspected = questionTokens.size >= 3 && relevanceKeywordOverlap === 0;

  return {
    wordCount,
    sentenceCount,
    mechanicalDialectStuffing,
    dialectWordDensity,
    dialectSentenceEndingRatio,
    dialectWordsUsed,
    fakeDialectFeel,
    fakeDialectMatches,
    usesForbiddenListFormat,
    excessiveLength,
    insultToUserSuspected,
    insultMatches,
    profanityHits,
    profanitySeverity,
    profanityLevelMismatch,
    relevanceKeywordOverlap,
    lowRelevanceSuspected,
  };
}

/** Jaccard benzerliği (0 = tamamen farklı kelime kümesi, 1 = aynı). */
export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a).filter((w) => w.length > 2 && !STOPWORDS.has(w)));
  const setB = new Set(tokenize(b).filter((w) => w.length > 2 && !STOPWORDS.has(w)));
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection += 1;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

/**
 * Seviyeler arası fark analizi çıplak kelime benzerliğine ek olarak şive
 * yoğunluğu ve küfür şiddetindeki farkı da göz önüne alır - iki cevap
 * kelime olarak farklı görünse bile aynı "ses tonunda" yazılmışsa (ör. şive
 * ve küfür kullanımı hiç değişmiyorsa) bunu da şüpheli sayar.
 */
export function tooSimilarAcrossLevels(
  simA: HeuristicFlags,
  simB: HeuristicFlags,
  textSimilarity: number
): boolean {
  const sameProfanity = simA.profanitySeverity === simB.profanitySeverity;
  const sameDialectFeel =
    Math.abs(simA.dialectWordDensity - simB.dialectWordDensity) < 0.02;
  return textSimilarity >= 0.6 && sameProfanity && sameDialectFeel;
}
