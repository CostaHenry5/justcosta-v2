/**
 * Runs the FastMED safety and privacy checks. No AI calls, no cost.
 *   npm run test:safety
 * Exits with an error if any case fails, so it can block a release.
 */
import { detectRedFlags } from "../lib/fastmed-safety";
import { redactPersonalData } from "../lib/fastmed-privacy";
import { REDACTION_CASES, SAFETY_CASES } from "./fastmed-safety-cases";

let failures = 0;
const missedAlarms: string[] = [];

for (const testCase of SAFETY_CASES) {
  const result = detectRedFlags(testCase.text, testCase.context);
  const levelOk = result.level === testCase.expect;
  const flagOk = !testCase.flag || result.flags.some((flag) => flag.id === testCase.flag);
  if (!levelOk || !flagOk) {
    failures++;
    if (testCase.expect && !result.level) missedAlarms.push(testCase.id);
    console.log(
      `FAIL ${testCase.id} [${testCase.lang}] "${testCase.text}"\n` +
        `     expected ${testCase.expect ?? "no alarm"}${testCase.flag ? ` (${testCase.flag})` : ""}, ` +
        `got ${result.level ?? "no alarm"} [${result.flags.map((flag) => flag.id).join(", ")}]`,
    );
  }
}

for (const testCase of REDACTION_CASES) {
  const { text } = redactPersonalData(testCase.text);
  const leaked = testCase.mustRemove.filter((part) => text.includes(part));
  const lost = testCase.mustKeep.filter((part) => !text.includes(part));
  if (leaked.length || lost.length) {
    failures++;
    console.log(
      `FAIL redaction ${testCase.id}: "${testCase.text}" -> "${text}"` +
        (leaked.length ? `\n     still contains: ${leaked.join(", ")}` : "") +
        (lost.length ? `\n     wrongly removed: ${lost.join(", ")}` : ""),
    );
  }
}

const total = SAFETY_CASES.length + REDACTION_CASES.length;
const unreviewed = SAFETY_CASES.filter((testCase) => !testCase.reviewed).length;
console.log(
  `\n${total - failures}/${total} checks passed` +
    ` (${SAFETY_CASES.length} red-flag cases, ${REDACTION_CASES.length} privacy cases).` +
    (missedAlarms.length ? `\nMISSED ALARMS (most serious): ${missedAlarms.join(", ")}` : "") +
    `\n${unreviewed} red-flag cases still need clinician review.`,
);
process.exit(failures ? 1 : 0);
