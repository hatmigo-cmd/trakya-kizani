import "dotenv/config";
import * as path from "node:path";
import { SCENARIOS } from "./scenarios";
import type {
  HeuristicFlags,
  HumorLevel,
  JudgeScore,
  LevelResult,
  RunReport,
  Scenario,
  ScenarioResult,
} from "./types";
import { evaluateReply, jaccardSimilarity, tooSimilarAcrossLevels } from "./heuristics";
import { generatePersonaReply, getModelName, getSystemPrompt, hasApiKey } from "./client";
import { judgeScenario } from "./judge";
import { writeReport } from "./report";
import { printSelfTestResults, runSelfTests } from "./selfTest";

const ALL_LEVELS: HumorLevel[] = [1, 2, 3, 4];

interface CliArgs {
  dryRun: boolean;
  judge: boolean;
  categories?: string[];
  ids?: string[];
  levels: HumorLevel[];
  limit?: number;
  concurrency: number;
  outDir: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    dryRun: false,
    judge: false,
    levels: ALL_LEVELS,
    concurrency: 2,
    outDir: path.join(__dirname, "results"),
  };

  for (const raw of argv) {
    const [flag, value] = raw.split("=");
    switch (flag) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--judge":
        args.judge = true;
        break;
      case "--category":
        args.categories = value.split(",").map((s) => s.trim());
        break;
      case "--id":
        args.ids = value.split(",").map((s) => s.trim());
        break;
      case "--level":
        args.levels = value
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n): n is HumorLevel => [1, 2, 3, 4].includes(n));
        break;
      case "--limit":
        args.limit = Number(value);
        break;
      case "--concurrency":
        args.concurrency = Number(value);
        break;
      case "--out":
        args.outDir = path.resolve(value);
        break;
      case "--help":
        printHelp();
        process.exit(0);
      default:
        console.warn(`Bilinmeyen argüman: ${raw} (yok sayıldı)`);
    }
  }

  return args;
}

function printHelp(): void {
  console.log(`Trakya Kızanı Persona Test Suite

Kullanım:
  npm run persona-test -- [seçenekler]
  npm run persona-test:dry-run

Seçenekler:
  --dry-run                Gerçek OpenAI çağrısı yapmaz; sadece altyapıyı
                            (senaryo listesi, system prompt üretimi, rapor
                            formatı) doğrular.
  --judge                  Ek bir LLM-judge çağrısıyla öznel kriterleri
                            (bilgi doğruluğu, mizah kalitesi vb.) puanlar.
                            OPENAI_API_KEY gerektirir, ekstra maliyetlidir.
  --category=Finans,Hukuk  Sadece belirtilen kategorilerde çalıştır.
  --id=finans-01,hukuk-02  Sadece belirtilen senaryo id'lerinde çalıştır.
  --level=1,3              Sadece belirtilen mizah seviyelerini test et.
  --limit=5                İlk N senaryoyla sınırla (maliyet kontrolü için).
  --concurrency=2          Eşzamanlı OpenAI çağrısı sayısı (varsayılan 2).
  --out=./path             Rapor çıktı klasörünü değiştir.
  --help                   Bu yardım metnini göster.
`);
}

function filterScenarios(args: CliArgs): Scenario[] {
  let list = SCENARIOS;
  if (args.categories?.length) {
    const set = new Set(args.categories.map((c) => c.toLowerCase()));
    list = list.filter((s) => set.has(s.category.toLowerCase()));
  }
  if (args.ids?.length) {
    const set = new Set(args.ids);
    list = list.filter((s) => set.has(s.id));
  }
  if (args.limit && args.limit > 0) {
    list = list.slice(0, args.limit);
  }
  return list;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);
  return results;
}

function computeLevelDifferentiation(levels: Partial<Record<HumorLevel, LevelResult>>) {
  const present = ALL_LEVELS.filter((l) => levels[l] && !levels[l]!.error);
  const pairwiseSimilarity: Record<string, number> = {};
  const tooSimilarPairs: string[] = [];

  for (let i = 0; i < present.length; i++) {
    for (let j = i + 1; j < present.length; j++) {
      const a = levels[present[i]]!;
      const b = levels[present[j]]!;
      const key = `${present[i]}-${present[j]}`;
      const sim = jaccardSimilarity(a.reply, b.reply);
      pairwiseSimilarity[key] = sim;
      if (tooSimilarAcrossLevels(a.flags, b.flags, sim)) {
        tooSimilarPairs.push(key);
      }
    }
  }

  return { pairwiseSimilarity, tooSimilarPairs };
}

async function runDryRun(args: CliArgs, scenarios: Scenario[]): Promise<RunReport> {
  console.log(`DRY RUN: ${scenarios.length} senaryo x ${args.levels.length} seviye = ${scenarios.length * args.levels.length} istek SİMÜLE edilecek (gerçek API çağrısı yok).\n`);

  const results: ScenarioResult[] = [];

  for (const scenario of scenarios) {
    const levels: Partial<Record<HumorLevel, LevelResult>> = {};
    for (const level of args.levels) {
      const systemPrompt = getSystemPrompt(level);
      const placeholderReply =
        `[DRY RUN - gerçek model çıktısı değildir] "${scenario.question}" sorusuna ` +
        `Level ${level} için system prompt ${systemPrompt.length} karakter uzunluğunda üretildi.`;
      const flags = evaluateReply(placeholderReply, scenario.question, level);
      levels[level] = { level, reply: placeholderReply, flags };
    }
    results.push({
      scenario,
      levels,
      levelDifferentiation: computeLevelDifferentiation(levels),
    });
  }

  return buildReport(args, scenarios, results, true);
}

async function runReal(args: CliArgs, scenarios: Scenario[]): Promise<RunReport> {
  const totalCalls = scenarios.length * args.levels.length;
  console.log(
    `GERÇEK ÇALIŞTIRMA: ${scenarios.length} senaryo x ${args.levels.length} seviye = ${totalCalls} OpenAI çağrısı yapılacak (model: ${getModelName()}, concurrency: ${args.concurrency}).`
  );
  if (args.judge) {
    console.log(`Judge aşaması AÇIK: ek olarak ${scenarios.length} judge çağrısı yapılacak.`);
  }
  console.log("");

  const results = await mapWithConcurrency(scenarios, args.concurrency, async (scenario) => {
    const levels: Partial<Record<HumorLevel, LevelResult>> = {};

    await mapWithConcurrency(args.levels, args.concurrency, async (level) => {
      try {
        const { reply, latencyMs } = await generatePersonaReply(level, scenario.question);
        const flags = evaluateReply(reply, scenario.question, level);
        levels[level] = { level, reply, latencyMs, flags };
      } catch (err) {
        levels[level] = {
          level,
          reply: "",
          error: err instanceof Error ? err.message : String(err),
          flags: evaluateReply("", scenario.question, level),
        };
      }
      return null;
    });

    const scenarioResult: ScenarioResult = {
      scenario,
      levels,
      levelDifferentiation: computeLevelDifferentiation(levels),
    };

    if (args.judge && hasApiKey()) {
      try {
        const answers: Partial<Record<HumorLevel, string>> = {};
        for (const level of args.levels) {
          const lr = levels[level];
          if (lr && !lr.error) answers[level] = lr.reply;
        }
        const { scores, seviyeFarkiYorumu } = await judgeScenario({ scenario, answers });
        for (const level of args.levels) {
          const score: JudgeScore | undefined = scores[level];
          if (score && levels[level]) levels[level]!.judge = score;
        }
        scenarioResult.judgeSeviyeFarkiYorumu = seviyeFarkiYorumu;
      } catch (err) {
        console.warn(
          `[judge] ${scenario.id} için judge çağrısı başarısız: ${err instanceof Error ? err.message : err}`
        );
      }
    }

    console.log(`  ✓ ${scenario.id} (${scenario.category})`);
    return scenarioResult;
  });

  return buildReport(args, scenarios, results, false);
}

function buildReport(
  args: CliArgs,
  scenarios: Scenario[],
  results: ScenarioResult[],
  dryRun: boolean
): RunReport {
  const summary = {
    mechanicalStuffingFailures: 0,
    fakeDialectFailures: 0,
    forbiddenListFormatFailures: 0,
    excessiveLengthFlags: 0,
    insultSuspectedFailures: 0,
    profanityMismatchFailures: 0,
    lowRelevanceFlags: 0,
    levelDifferentiationFailures: 0,
    errors: 0,
  };

  for (const r of results) {
    for (const level of args.levels) {
      const lr = r.levels[level];
      if (!lr) continue;
      if (lr.error) {
        summary.errors += 1;
        continue;
      }
      const f: HeuristicFlags = lr.flags;
      if (f.mechanicalDialectStuffing) summary.mechanicalStuffingFailures += 1;
      if (f.fakeDialectFeel) summary.fakeDialectFailures += 1;
      if (f.usesForbiddenListFormat) summary.forbiddenListFormatFailures += 1;
      if (f.excessiveLength) summary.excessiveLengthFlags += 1;
      if (f.insultToUserSuspected) summary.insultSuspectedFailures += 1;
      if (f.profanityLevelMismatch) summary.profanityMismatchFailures += 1;
      if (f.lowRelevanceSuspected) summary.lowRelevanceFlags += 1;
    }
    if (r.levelDifferentiation.tooSimilarPairs.length > 0) {
      summary.levelDifferentiationFailures += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    model: getModelName(),
    dryRun,
    judgeEnabled: args.judge,
    totalScenarios: scenarios.length,
    totalCalls: scenarios.length * args.levels.length,
    levelsIncluded: args.levels,
    results,
    summary,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const selfTestsPassed = printSelfTestResults(runSelfTests()) || false;
  if (!selfTestsPassed) {
    console.error("Heuristik motor self-testleri başarısız oldu, çalıştırma durduruldu.");
    process.exit(1);
  }

  const scenarios = filterScenarios(args);
  if (scenarios.length === 0) {
    console.error("Filtrelerle eşleşen hiç senaryo bulunamadı.");
    process.exit(1);
  }

  if (!args.dryRun && !hasApiKey()) {
    console.error(
      "\nOPENAI_API_KEY tanımlı değil.\n" +
        "Gerçek bir OpenAI çağrısı yapılamaz, bu yüzden çalıştırma durduruldu.\n\n" +
        "Ne yapmalısınız:\n" +
        "  1. server/.env.example dosyasını server/.env olarak kopyalayın.\n" +
        "  2. .env içindeki OPENAI_API_KEY değerini gerçek anahtarınızla değiştirin.\n" +
        "  3. Tekrar çalıştırın: npm run persona-test\n\n" +
        "Anahtar olmadan sadece altyapıyı doğrulamak isterseniz:\n" +
        "  npm run persona-test:dry-run\n"
    );
    process.exit(1);
  }

  const report = args.dryRun ? await runDryRun(args, scenarios) : await runReal(args, scenarios);

  const prefix = `${args.dryRun ? "dry-run" : "report"}-${report.generatedAt.replace(/[:.]/g, "-")}`;
  const { jsonPath, mdPath } = writeReport(report, args.outDir, prefix);

  console.log("\n=== Özet ===");
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`\nJSON rapor: ${jsonPath}`);
  console.log(`Markdown rapor (4 seviye yan yana): ${mdPath}`);
}

main().catch((err) => {
  console.error("Beklenmeyen hata:", err);
  process.exit(1);
});
