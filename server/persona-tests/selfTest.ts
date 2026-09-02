import { evaluateReply } from "./heuristics";

/**
 * Heuristik motorun kendini test etmesi: her çalıştırmada (özellikle
 * --dry-run'da) bilinen "kötü" ve "iyi" örnek metinler üzerinden motorun
 * hâlâ doğru çalıştığını doğrular. API anahtarı gerektirmez.
 */
export interface SelfTestResult {
  name: string;
  passed: boolean;
  detail: string;
}

// Görev tanımındaki (madde 7) birebir örnek: mekanik şive serpiştirme.
const MECHANICAL_STUFFING_EXAMPLE =
  "Ula beya, bunu yap beya. Sonra beya şöyle yap beya. En sonunda da rahatla beya.";

// Doğal, ölçülü şive kullanan bir karşı örnek - yanlış pozitif vermemeli.
const NATURAL_EXAMPLE =
  "Bu işi önce şöyle bir sıraya koy: acil olanı bitir, gerisini yarına bırak. " +
  "Zaten çoğu zaman kendimizi gereğinden fazla zorluyoruz beya, sakin ol yeter.";

export function runSelfTests(): SelfTestResult[] {
  const results: SelfTestResult[] = [];

  const mechanicalFlags = evaluateReply(MECHANICAL_STUFFING_EXAMPLE, "Ne yapmalıyım?", 4);
  results.push({
    name: "Mekanik şive serpiştirme örneği FAIL olarak işaretlenmeli",
    passed: mechanicalFlags.mechanicalDialectStuffing === true,
    detail: `dialectSentenceEndingRatio=${mechanicalFlags.dialectSentenceEndingRatio.toFixed(2)}, dialectWordDensity=${mechanicalFlags.dialectWordDensity.toFixed(2)}`,
  });

  const naturalFlags = evaluateReply(NATURAL_EXAMPLE, "Ne yapmalıyım?", 2);
  results.push({
    name: "Doğal/ölçülü şive kullanımı yanlış pozitif ÜRETMEMELİ",
    passed: naturalFlags.mechanicalDialectStuffing === false,
    detail: `dialectSentenceEndingRatio=${naturalFlags.dialectSentenceEndingRatio.toFixed(2)}, dialectWordDensity=${naturalFlags.dialectWordDensity.toFixed(2)}`,
  });

  const insultExample = "Bu kadar da beceriksiz olunmaz, hiç mi düşünmüyon sen?";
  const insultFlags = evaluateReply(insultExample, "Bir hata yaptım.", 4);
  results.push({
    name: "Kullanıcıyı aşağılayan örnek FAIL olarak işaretlenmeli",
    passed: insultFlags.insultToUserSuspected === true,
    detail: `insultMatches=${JSON.stringify(insultFlags.insultMatches)}`,
  });

  const listExample = "Şunları yapmalısın:\n- Birinci adım\n- İkinci adım\n- Üçüncü adım";
  const listFlags = evaluateReply(listExample, "Ne yapmalıyım?", 2);
  results.push({
    name: "Madde imli liste formatı FAIL olarak işaretlenmeli",
    passed: listFlags.usesForbiddenListFormat === true,
    detail: `usesForbiddenListFormat=${listFlags.usesForbiddenListFormat}`,
  });

  const level1ProfanityExample = "Siktir git beya, bu iş böyle olmaz.";
  const profanityFlags = evaluateReply(level1ProfanityExample, "Ne yapmalıyım?", 1);
  results.push({
    name: "Level 1'de küfür geçmesi FAIL olarak işaretlenmeli",
    passed: profanityFlags.profanityLevelMismatch === true,
    detail: `profanitySeverity=${profanityFlags.profanitySeverity}`,
  });

  return results;
}

export function printSelfTestResults(results: SelfTestResult[]): boolean {
  console.log("\n=== Heuristik motor kendi kendini test ediyor ===");
  let allPassed = true;
  for (const r of results) {
    const mark = r.passed ? "✅" : "❌";
    console.log(`${mark} ${r.name}\n   ${r.detail}`);
    if (!r.passed) allPassed = false;
  }
  console.log(allPassed ? "Tüm self-testler geçti.\n" : "BAZI SELF-TESTLER BAŞARISIZ!\n");
  return allPassed;
}
