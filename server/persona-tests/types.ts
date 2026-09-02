import type { HumorLevel } from "../src/types";

export type { HumorLevel };

export type Category =
  | "Günlük hayat"
  | "İlişkiler"
  | "Para"
  | "Finans"
  | "Teknoloji"
  | "Spor"
  | "Yemek"
  | "İş hayatı"
  | "Sinir/stres"
  | "Felsefe"
  | "Bilim"
  | "Tarih"
  | "Sağlık"
  | "Hukuk"
  | "Saçma/absürt"
  | "Mizah bekleyen sorular";

export interface Scenario {
  /** Kısa, benzersiz kimlik. Rapor dosyalarında ve --category/--id filtrelerinde kullanılır. */
  id: string;
  category: Category;
  question: string;
  /**
   * İnsan gözden geçirici için ipucu: doğru cevabın neye benzemesi
   * beklendiği ya da nelere dikkat edilmesi gerektiği. Otomasyon bu alanı
   * kullanmaz, sadece raporda gösterilir.
   */
  reviewerNote?: string;
}

export interface HeuristicFlags {
  wordCount: number;
  sentenceCount: number;

  /** Şive kelimelerinin cümle sonuna mekanik biçimde yapıştırılıp yapıştırılmadığı. */
  mechanicalDialectStuffing: boolean;
  dialectWordDensity: number; // dialect kelime sayısı / toplam kelime
  dialectSentenceEndingRatio: number; // "...beya." ile biten cümle oranı
  dialectWordsUsed: string[];

  /** dialectLexicon.ts kuralına aykırı fonetik bozma ("yapıyoz", "geliyorm" vb.). */
  fakeDialectFeel: boolean;
  fakeDialectMatches: string[];

  /** basePrompt kural 7: madde imli liste / rapor formatı yasak. */
  usesForbiddenListFormat: boolean;

  /** Kaba bir üst sınır; asıl karar insana/judge'a bırakılır, burada sadece işaretlenir. */
  excessiveLength: boolean;

  /** Kullanıcıyı hedef alan aşağılama şüphesi (humorRules "OLMAZ" örnekleri). */
  insultToUserSuspected: boolean;
  insultMatches: string[];

  /** Kaba/küfür kelime taraması ve seviyeye göre uygunsuzluk şüphesi. */
  profanityHits: string[];
  profanitySeverity: 0 | 1 | 2; // 0: yok, 1: hafif argo, 2: ağır küfür
  profanityLevelMismatch: boolean;

  /** Soru ile cevap arasında kaba bir kelime örtüşmesi - zayıf bir alaka sinyali. */
  relevanceKeywordOverlap: number;
  lowRelevanceSuspected: boolean;
}

export interface LevelResult {
  level: HumorLevel;
  reply: string;
  latencyMs?: number;
  error?: string;
  flags: HeuristicFlags;
  judge?: JudgeScore;
}

export interface JudgeScore {
  bilgiDogrulugu: number;
  siveDogalligi: number;
  mizah: number;
  lafSokmaBaglami: number;
  kufurUygunlugu: number;
  asagilamama: number;
  beyaUlaTekrari: number;
  yapaySiveHissi: number;
  gereksizUzunluk: number;
  sorulaAlaka: number;
  gerekce: string;
}

export interface ScenarioResult {
  scenario: Scenario;
  levels: Partial<Record<HumorLevel, LevelResult>>;
  levelDifferentiation: {
    pairwiseSimilarity: Record<string, number>;
    tooSimilarPairs: string[];
  };
  judgeSeviyeFarkiYorumu?: string;
}

export interface RunReport {
  generatedAt: string;
  model: string;
  dryRun: boolean;
  judgeEnabled: boolean;
  totalScenarios: number;
  totalCalls: number;
  levelsIncluded: HumorLevel[];
  results: ScenarioResult[];
  summary: {
    mechanicalStuffingFailures: number;
    fakeDialectFailures: number;
    forbiddenListFormatFailures: number;
    excessiveLengthFlags: number;
    insultSuspectedFailures: number;
    profanityMismatchFailures: number;
    lowRelevanceFlags: number;
    levelDifferentiationFailures: number;
    errors: number;
  };
}
