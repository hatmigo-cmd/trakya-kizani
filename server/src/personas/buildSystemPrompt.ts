import type { HumorLevel } from "../types";
import { buildBaseSystemPrompt } from "./basePrompt";
import { DIALECT_LEXICON_GUIDE } from "./dialectLexicon";
import { HUMOR_RULES } from "./humorRules";
import { getProfanityRule } from "./profanityRules";
import { LEVEL_1_EFENDI } from "./level1-efendi";
import { LEVEL_2_SAMIMI } from "./level2-samimi";
import { LEVEL_3_KAHVEHANE } from "./level3-kahvehane";
import { LEVEL_4_DELIRMIS_KIZAN } from "./level4-delirmis-kizan";
import { FEW_SHOT_EXAMPLES, formatFewShotBlock } from "./fewShotExamples";
import { formatCalibrationBlock } from "./levelCalibrationExamples";

export type { HumorLevel };

export const HUMOR_LEVELS: Record<HumorLevel, { key: string; label: string }> = {
  1: { key: "efendi", label: "Efendi" },
  2: { key: "samimi", label: "Samimi" },
  3: { key: "kahvehane", label: "Kahvehane Modu" },
  4: { key: "delirmis-kizan", label: "Delirmiş Kızan" },
};

const LEVEL_PROMPTS: Record<HumorLevel, string> = {
  1: LEVEL_1_EFENDI,
  2: LEVEL_2_SAMIMI,
  3: LEVEL_3_KAHVEHANE,
  4: LEVEL_4_DELIRMIS_KIZAN,
};

export function isValidHumorLevel(value: unknown): value is HumorLevel {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

/**
 * Base kimlik/kurallar + Trakya ağzı sözlüğü + mizah kuralları + küfür
 * kuralı + seçilen mizah seviyesi + geniş üslup örnekleri + seviyeye özel
 * kalibrasyon örnekleri birleştirilerek tek bir system prompt üretilir.
 *
 * Sıra önemli: genel kurallar önce gelir, seviyeye özel talimat ve örnekler
 * en sona, modelin "son okuduğu / en taze" bilgi olarak kalır.
 */
export function buildSystemPrompt(level: HumorLevel): string {
  const base = buildBaseSystemPrompt();
  const profanity = getProfanityRule(level);
  const levelBlock = LEVEL_PROMPTS[level];
  const fewShot = formatFewShotBlock(FEW_SHOT_EXAMPLES);
  const calibration = formatCalibrationBlock(level);

  return [
    base,
    DIALECT_LEXICON_GUIDE,
    HUMOR_RULES,
    profanity,
    levelBlock,
    fewShot,
    calibration,
    "Şimdi kullanıcının mesajına, yukarıdaki tüm kurallara ve seçilen mizah seviyesine uygun şekilde cevap ver. Önce doğru cevap, sonra Trakyalılaştır.",
  ].join("\n\n");
}
