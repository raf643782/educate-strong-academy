/**
 * One-time correction — Exercise.description for slug
 * "viking-press-exercise".
 *
 * Section 4 audit found this Exercise record's description worded as
 * the competition event itself, rather than as training for it —
 * seeded that way from the start (backend/prisma/seed.ts), not a
 * runtime drift. This script corrects only that single field on that
 * single record, following the same safety pattern as
 * stage4-correction-arm-over-arm-rope-pull.ts.
 *
 * Only proceeds if the record's CURRENT description matches the exact
 * known-incorrect value below — if it doesn't (including if it's
 * already correct), the script reports the real current value and
 * exits without writing anything, rather than blindly overwriting
 * whatever is actually there.
 *
 * Does not touch the Event record ("viking-press") or any other
 * record.
 *
 * Usage (never run by the assistant — production write requires the
 * repo owner's own DATABASE_URL, entered securely, never inline):
 *   npx tsx src/scripts/section5-correction-viking-press-exercise.ts --dry-run
 *   npx tsx src/scripts/section5-correction-viking-press-exercise.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

const SLUG = 'viking-press-exercise';

const KNOWN_INCORRECT_VALUE =
  'A fixed-lever overhead pressing event where the athlete presses a pivoting frame overhead for repetitions. Common in amateur and international Strongman competition. Demands pressing rhythm, timing, and overhead endurance rather than a single maximal effort.';

const CORRECT_VALUE =
  'A fixed lever overhead pressing exercise that develops the pressing rhythm, timing and overhead endurance used in the Viking Press competition event.';

async function main() {
  console.log(`Section 5 one-time correction — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}`);
  console.log(`Target: Exercise.description for slug "${SLUG}"\n`);

  const exercise = await prisma.exercise.findUnique({ where: { slug: SLUG } });

  if (!exercise) {
    console.error(`ABORTING — no Exercise found with slug "${SLUG}". No changes made.`);
    process.exit(1);
  }

  if (exercise.description === CORRECT_VALUE) {
    console.log('Already correct — description already matches the approved Exercise wording. Nothing to do.');
    return;
  }

  if (exercise.description !== KNOWN_INCORRECT_VALUE) {
    console.error('ABORTING — the current description does not match the known-incorrect value this script expects. No changes made.');
    console.error(`  Expected (known-incorrect): ${KNOWN_INCORRECT_VALUE}`);
    console.error(`  Actual current value:       ${exercise.description}`);
    process.exit(1);
  }

  console.log('Confirmed: current description matches the known-incorrect value.');
  console.log(`  BEFORE: ${exercise.description}`);
  console.log(`  AFTER:  ${CORRECT_VALUE}`);

  if (DRY_RUN) {
    console.log('\nDry run complete — no changes were written.');
    return;
  }

  await prisma.$transaction([
    prisma.exercise.update({
      where: { slug: SLUG },
      data: { description: CORRECT_VALUE },
    }),
  ]);

  console.log('\nDone — Exercise.description corrected for slug "viking-press-exercise".');
}

main()
  .catch(e => {
    console.error('Correction FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
