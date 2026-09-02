import * as fs from "node:fs";
import * as path from "node:path";
import type { HumorLevel, RunReport, ScenarioResult } from "./types";

const LEVEL_LABELS: Record<HumorLevel, string> = {
  1: "Level 1 - Efendi",
  2: "Level 2 - Samimi",
  3: "Level 3 - Kahvehane Modu",
  4: "Level 4 - Delirmiş Kızan",
};

function ok(bad: boolean): string {
  return bad ? "❌" : "✅";
}

function scenarioMarkdown(result: ScenarioResult): string {
  const { scenario, levels, levelDifferentiation } = result;
  const lines: string[] = [];
  lines.push(`## [${scenario.id}] ${scenario.category} — "${scenario.question}"`);
  if (scenario.reviewerNote) {
    lines.push(`> Gözden geçirici notu: ${scenario.reviewerNote}`);
  }
  lines.push("");

  for (const levelNum of [1, 2, 3, 4] as HumorLevel[]) {
    const lr = levels[levelNum];
    lines.push(`### ${LEVEL_LABELS[levelNum]}`);
    if (!lr) {
      lines.push("_Bu seviye için sonuç yok (filtrelenmiş olabilir)._\n");
      continue;
    }
    if (lr.error) {
      lines.push(`**HATA:** ${lr.error}\n`);
      continue;
    }
    lines.push("");
    lines.push("> " + lr.reply.replace(/\n/g, "\n> "));
    lines.push("");
    const f = lr.flags;
    lines.push(
      `| Ölçüt | Değer |\n` +
        `|---|---|\n` +
        `| Kelime / cümle sayısı | ${f.wordCount} / ${f.sentenceCount} |\n` +
        `| Mekanik şive serpiştirme | ${ok(f.mechanicalDialectStuffing)} (yoğunluk: ${(f.dialectWordDensity * 100).toFixed(1)}%, cümle sonu oranı: ${(f.dialectSentenceEndingRatio * 100).toFixed(0)}%) |\n` +
        `| Kullanılan şive kelimeleri | ${f.dialectWordsUsed.join(", ") || "—"} |\n` +
        `| Yapay/fonetik bozma şive hissi | ${ok(f.fakeDialectFeel)}${f.fakeDialectMatches.length ? ` (${f.fakeDialectMatches.join(", ")})` : ""} |\n` +
        `| Yasak liste/rapor formatı | ${ok(f.usesForbiddenListFormat)} |\n` +
        `| Aşırı uzunluk şüphesi (>220 kelime) | ${ok(f.excessiveLength)} |\n` +
        `| Kullanıcıyı aşağılama şüphesi | ${ok(f.insultToUserSuspected)}${f.insultMatches.length ? ` (${f.insultMatches.join(", ")})` : ""} |\n` +
        `| Küfür/argo tespiti | ${f.profanityHits.join(", ") || "—"} (şiddet: ${f.profanitySeverity}) |\n` +
        `| Seviyeye göre küfür uygunsuzluğu | ${ok(f.profanityLevelMismatch)} |\n` +
        `| Soru-cevap kelime örtüşmesi | ${(f.relevanceKeywordOverlap * 100).toFixed(0)}% |\n` +
        `| Düşük alaka şüphesi | ${ok(f.lowRelevanceSuspected)} |`
    );
    if (lr.judge) {
      const j = lr.judge;
      lines.push("");
      lines.push(
        `**LLM-Judge puanları (1-5):** doğruluk ${j.bilgiDogrulugu}, şive doğallığı ${j.siveDogalligi}, ` +
          `mizah ${j.mizah}, laf sokma bağlamı ${j.lafSokmaBaglami}, küfür uygunluğu ${j.kufurUygunlugu}, ` +
          `aşağılamama ${j.asagilamama}, beya/ula tekrarı ${j.beyaUlaTekrari}, yapay şive hissi ${j.yapaySiveHissi}, ` +
          `gereksiz uzunluk ${j.gereksizUzunluk}, soruyla alaka ${j.sorulaAlaka}`
      );
      lines.push(`> Judge gerekçesi: ${j.gerekce}`);
    }
    lines.push("");
  }

  lines.push("### Seviyeler arası fark analizi");
  const pairs = Object.entries(levelDifferentiation.pairwiseSimilarity);
  if (pairs.length === 0) {
    lines.push("_Karşılaştırma için yeterli seviye sonucu yok._");
  } else {
    lines.push("| Seviye çifti | Benzerlik | Durum |");
    lines.push("|---|---|---|");
    for (const [pair, sim] of pairs) {
      const tooSimilar = levelDifferentiation.tooSimilarPairs.includes(pair);
      lines.push(`| ${pair} | ${(sim * 100).toFixed(0)}% | ${tooSimilar ? "⚠️ Çok benzer" : "✅"} |`);
    }
  }
  if (result.judgeSeviyeFarkiYorumu) {
    lines.push(`\n> Judge yorumu: ${result.judgeSeviyeFarkiYorumu}`);
  }
  lines.push("\n---\n");

  return lines.join("\n");
}

export function reportToMarkdown(report: RunReport): string {
  const lines: string[] = [];
  lines.push(`# Trakya Kızanı — Persona Test Suite Raporu`);
  lines.push("");
  lines.push(`- Oluşturulma zamanı: ${report.generatedAt}`);
  lines.push(`- Mod: ${report.dryRun ? "DRY RUN (gerçek API çağrısı yapılmadı)" : "GERÇEK API ÇAĞRISI"}`);
  lines.push(`- Model: ${report.model}`);
  lines.push(`- Judge aşaması: ${report.judgeEnabled ? "açık" : "kapalı"}`);
  lines.push(`- Senaryo sayısı: ${report.totalScenarios}`);
  lines.push(`- Test edilen seviyeler: ${report.levelsIncluded.join(", ")}`);
  lines.push(`- Toplam çağrı: ${report.totalCalls}`);
  lines.push("");
  lines.push("## Özet");
  lines.push("");
  lines.push("| Sorun | Sayı |");
  lines.push("|---|---|");
  lines.push(`| Mekanik şive serpiştirme | ${report.summary.mechanicalStuffingFailures} |`);
  lines.push(`| Yapay/fonetik bozma şive hissi | ${report.summary.fakeDialectFailures} |`);
  lines.push(`| Yasak liste/rapor formatı | ${report.summary.forbiddenListFormatFailures} |`);
  lines.push(`| Aşırı uzunluk şüphesi | ${report.summary.excessiveLengthFlags} |`);
  lines.push(`| Kullanıcıyı aşağılama şüphesi | ${report.summary.insultSuspectedFailures} |`);
  lines.push(`| Seviyeye göre küfür uygunsuzluğu | ${report.summary.profanityMismatchFailures} |`);
  lines.push(`| Düşük alaka şüphesi | ${report.summary.lowRelevanceFlags} |`);
  lines.push(`| Seviyeler arası fark yetersizliği | ${report.summary.levelDifferentiationFailures} |`);
  lines.push(`| Hatalar (API/çağrı) | ${report.summary.errors} |`);
  lines.push("");
  lines.push("## Senaryo Detayları (4 seviye yan yana)");
  lines.push("");

  for (const result of report.results) {
    lines.push(scenarioMarkdown(result));
  }

  return lines.join("\n");
}

export function writeReport(
  report: RunReport,
  outDir: string,
  filePrefix: string
): { jsonPath: string; mdPath: string } {
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, `${filePrefix}.json`);
  const mdPath = path.join(outDir, `${filePrefix}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf-8");
  fs.writeFileSync(mdPath, reportToMarkdown(report), "utf-8");
  return { jsonPath, mdPath };
}
