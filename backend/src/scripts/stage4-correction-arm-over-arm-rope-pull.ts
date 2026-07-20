/**
 * One-time correction — Exercise.description for slug
 * "arm-over-arm-rope-pull".
 *
 * After the Stage 4 content-update script ran against production, a
 * fresh dry run found this one Exercise record's description had been
 * set to the Event's approved wording instead of its own approved
 * Exercise wording. This script corrects only that single field on
 * that single record.
 *
 * Does not modify stage4-content-update.ts or any of its logic, and
 * does not touch any other record. Only proceeds if the record's
 * CURRENT description matches the exact known-incorrect value below —
 * if it doesn't (including if it's already correct), the script
 * reports the real current value and exits without writing anything,
 * rather than blindly overwriting whatever is actually there.
 *
 * Usage (never run by the assistant — production write requires the
 * repo owner's own DATABASE_URL):
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-correction-arm-over-arm-rope-pull.ts --dry-run
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-correction-arm-over-arm-rope-pull.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

const SLUG = 'arm-over-arm-rope-pull';

const KNOWN_INCORRECT_VALUE =
  'The Arm Over Arm Rope Pull is a Strongman pulling event. The athlete drags a heavy implement, such as a sled, vehicle or loaded rope system, hand over hand using a rope, seated or standing depending on the competition format.';

const CORRECT_VALUE =
  'A hand-over-hand rope-pulling drill, seated or standing, that trains the pulling pattern used in the Arm-Over-Arm Rope Pull competition event. Tests back strength, biceps endurance, grip and core stability.';

async function main() {
  console.log(`Stage 4 one-time correction — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}`);
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

  await prisma.exercise.update({
    where: { slug: SLUG },
    data: { description: CORRECT_VALUE },
  });

  console.log('\nDone — Exercise.description corrected for slug "arm-over-arm-rope-pull".');
}

main()
  .catch(e => {
    console.error('Correction FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
