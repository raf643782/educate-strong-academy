/**
 * Stage 5 — scoped new-Event insertion.
 *
 * Adds exactly 6 new, researched, sourced Events (Tyre Flip, Conan's
 * Wheel, Loading Race, Hercules Hold, Fingal's Fingers, Block Press).
 * Full research trail and sources for every claim below are in
 * stage5-event-sources.md alongside this script. 3 further candidates
 * (Overhead Medley, Natural Stones, Keg Press) were researched and
 * deliberately held back — see that file for why.
 *
 * Only existing Event fields are used (description, technicalNotes,
 * judgingCriteria, commonErrors, category). No alternativeNames,
 * sources, author, reviewer, publicationDate or reviewStatus columns
 * exist on the Event model yet — that migration is explicitly deferred
 * to Stage 7, to be designed compatibly with the future Sanity
 * migration rather than added early. No author/reviewer/publication
 * date has been invented anywhere in this file.
 *
 * programmingNotes is left unset on every new record, consistent with
 * the Stage 4 standard that programming/training content belongs on
 * the Exercise page, not the Event page — none of these new Events had
 * a sourced, competition-specific (as opposed to generic training)
 * programming claim worth publishing.
 *
 * This is deliberately NOT the general prisma/seed.ts, for the same
 * reason as the Stage 4 update script: seed.ts's unrelated
 * contentRelationship.create()/recommendationPrompt.create() calls are
 * unguarded and unsafe to rerun against production. This script never
 * touches those tables.
 *
 * Safety model — this is a CREATE operation, not an update, so the
 * Stage 4 "expected original / approved final" drift model does not
 * apply directly. Instead:
 *   - slug not found  -> safe to create (this is the normal first run)
 *   - slug found, and every field already matches the approved content
 *     below -> ALREADY_APPLIED, skipped, not an error (idempotent rerun)
 *   - slug found, but content differs from what's specified below
 *     -> CONFLICT: some other record already occupies this slug with
 *     different content. Abort the whole run before creating anything,
 *     report the exact slug, and do not overwrite it.
 * All 6 records are created together inside a single
 * prisma.$transaction([...]) batch, so either every new Event is
 * created, or (on any single failure) none are.
 *
 * Usage (never run by the assistant — production write requires the
 * repo owner's own DATABASE_URL):
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage5-event-insert.ts --dry-run
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage5-event-insert.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

interface NewEvent {
  name: string;
  slug: string;
  category: string;
  description: string;
  technicalNotes: string;
  judgingCriteria: string;
  commonErrors: string;
  /** Explicitly owned and left empty by this script — no sourced,
   * competition-specific coaching/programming content exists for any
   * of these 6 events, consistent with the Stage 4 standard that this
   * content belongs on the Exercise page. Declared explicitly (not
   * omitted) so the conflict check below can verify a pre-existing
   * record hasn't been given content in a field this script owns. */
  coachingNotes: null;
  programmingNotes: null;
  isPublished: boolean;
  isLaunchPriority: boolean;
}

const NEW_EVENTS: NewEvent[] = [
  {
    name: 'Tyre Flip',
    slug: 'tyre-flip',
    category: 'Loading Events',
    description:
      'Tyre Flip is a strongman event in which the athlete flips a large tractor or truck tyre end over end, combining an initial deadlift-style pull off the ground with an explosive push once the tyre passes its tipping point. It tests full-body strength, hip drive and grip under fatigue.',
    technicalNotes:
      'Format varies by competition: some events score the fastest time to complete a fixed number of flips or a fixed distance, others score the most flips completed within a time cap, and some record-attempt formats score a single maximum-weight tyre flipped for a small number of reps. Tyre weight varies significantly by competition and division.',
    judgingCriteria:
      "A flip counts only once the tyre has been pushed down and rotated fully onto its opposite face; rolling the tyre onto its side rather than flipping it end over end is not a valid rep under at least one published federation ruleset. Where the event is run over a fixed distance, the tyre must reach the finish line in a flipped position. Rules vary by federation, promoter and competition; always confirm before each event.",
    commonErrors:
      "Rolling the tyre onto its side instead of completing a full end-over-end flip is not counted as a valid rep under at least one federation's rules. Failing to bring the tyre to a full, flat landing before the next flip is attempted can also invalidate a rep. Failing to reach the required distance or rep count within the time cap often results in a partial score rather than a completion time, depending on the competition.",
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
  {
    name: "Conan's Wheel",
    slug: 'conans-wheel',
    category: 'Carry Events',
    description:
      "Conan's Wheel is a strongman event built around a fixed pivot point mounted to the ground, from which a long lever arm extends. A loadable carriage holding weight plates or stones sits on the arm between the pivot and the athlete, who takes the arm into a Zercher-style hold, stands, and walks it around the central pivot for maximum distance.",
    technicalNotes:
      'Distance is measured in degrees of rotation around the pivot rather than metres of forward travel, though some events also report an equivalent lap count. Competition loads and arm height vary by promoter. Format varies: some events run a single maximum-distance attempt with no time cap, while others use a fixed time window and score the most rotation completed inside it.',
    judgingCriteria:
      'The arm must be carried in a Zercher hold; it may not rest on the shoulders or ride at or above shoulder height under rulesets that specify this. The attempt starts the moment the arm leaves the base and ends the instant the athlete drops or loses control of it, locking in the distance covered at that point. A minimum distance is sometimes required for the attempt to score at all. Rules vary by federation, promoter and competition; always confirm before each event.',
    commonErrors:
      'Letting the arm rise up onto or above the shoulder is a fault under rulesets that specify a strict Zercher carry. Resting the implement on the belt for support is not valid where a competition restricts load-bearing to the arms. A drop outside any permitted starting tolerance ends the attempt immediately and locks in whatever distance had been covered.',
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
  {
    name: 'Loading Race',
    slug: 'loading-race',
    category: 'Loading Events',
    description:
      'Loading Race, also called a Loading Medley, is a timed strongman event in which an athlete moves a sequence of different implements, commonly a mix of kegs, sandbags, stones, anvils or odd objects, from a start line onto a platform or truck bed, one at a time, over a set course.',
    technicalNotes:
      'Course length, implement count and time cap vary significantly by competition and year, historically ranging from three to eight implements over distances of roughly eight to thirty five metres, with time caps typically between sixty and ninety seconds. Implements are commonly loaded in a fixed order, and many formats do not allow an athlete to skip a failed or unloaded implement to attempt a later one, though this depends on the competition.',
    judgingCriteria:
      'An implement is considered successfully loaded once it is fully and stably placed on the target platform or truck bed, judged to the same standard used for that implement type on its own dedicated page. If the time cap expires before all implements are loaded, the run is typically scored on implements or distance completed rather than receiving no result. Rules vary by federation, promoter and competition; always confirm before each event.',
    commonErrors:
      'Pacing the whole race poorly, for example sprinting too hard between implements and arriving too fatigued to execute a clean load on the next one, is a common way time is lost. Because skipping ahead is not permitted, failing an implement and having to reattempt it costs meaningful time against the clock.',
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
  {
    name: 'Hercules Hold',
    slug: 'hercules-hold',
    category: 'Static Events',
    description:
      'The Hercules Hold is a static strength event in which the athlete stands on a raised platform in a fixed position and holds two weighted pillars upright using chains, one on each side of the body. Unlike carry events, the athlete does not move; the pillars pull outward under their own weight, and the contest is decided by how long the athlete can resist that pull.',
    technicalNotes:
      'Each pillar is chained to a handle held by the athlete. Competition pillar weights vary significantly by event. In the classic format there is no fixed time limit, and the clock runs until the athlete can no longer support both pillars, though this may vary by promoter.',
    judgingCriteria:
      'The clock starts once the athlete takes control of both handles and stops the instant the hold is broken. A hold ends when the athlete drops a handle, a pillar touches the ground, grip is lost, or the athlete otherwise loses control. Longest time under control wins. Permitted equipment commonly includes chalk, with tacky and lifting straps commonly disallowed as a matter of general practice, though this varies by federation and promoter; always confirm before each event.',
    commonErrors:
      'Losing grip on a handle, allowing a pillar to touch the ground, or losing the fixed stance all end the hold immediately and are the recorded reasons for a result in competition.',
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
  {
    name: "Fingal's Fingers",
    slug: 'fingals-fingers',
    category: 'Loading Events',
    description:
      "Fingal's Fingers is a strongman flipping event. A series of hinged poles, most commonly five, each heavier and longer than the last, must be lifted from a horizontal resting position and flipped fully onto the opposite side, one after another, against the clock.",
    technicalNotes:
      'The poles are hinged at a ground-level pivot. Pole weights and time limits vary by competition and promoter. It appears intermittently at major competitions rather than as a fixture of every event calendar.',
    judgingCriteria:
      'A pole must be fully flipped and come to rest on the opposite side to count. Scoring is typically by time to clear all poles, with partial completions ranked by the number flipped within the time limit. Allowed grip aids vary by promoter; some rulesets explicitly disallow tacky. Rules vary by federation, promoter and competition; always confirm before each event.',
    commonErrors:
      'Losing hand position or repositioning too slowly during the transition up the pole is a common source of lost time. Losing stability during the flip phase can stall momentum partway through, particularly on the later, heavier poles.',
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
  {
    name: 'Block Press',
    slug: 'block-press',
    category: 'Press Events',
    description:
      'Block Press is a strongman overhead pressing event using a plate-loadable steel block instead of a log, axle or dumbbell. The athlete cleans the block from the floor to the chest or shoulder, then presses it to full overhead lockout.',
    technicalNotes:
      'Often run as a medley of several blocks of ascending weight, pressed in succession within a set time limit and scored by total blocks or reps completed; some formats instead score a single maximum block locked out. Competition weight ranges and time limits vary by promoter.',
    judgingCriteria:
      'A successful lift requires the block to reach full overhead lockout with both arms extended and the implement under control, held until the judge gives a down signal. Reps or implements are only credited once the down command has been given. Rules vary by federation, promoter and competition; always confirm before each event.',
    commonErrors:
      'Failing to reach full lockout, lowering or dropping the block before the down command is given, and losing control of the implement overhead are all common reasons a lift is not counted.',
    coachingNotes: null,
    programmingNotes: null,
    isPublished: true,
    isLaunchPriority: false,
  },
];

async function main() {
  console.log(`Stage 5 new-Event insertion — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}`);
  console.log(`Target: ${NEW_EVENTS.length} new event(s): ${NEW_EVENTS.map(e => e.slug).join(', ')}\n`);

  const toCreate: NewEvent[] = [];
  const alreadyApplied: string[] = [];
  const conflicts: string[] = [];

  for (const ev of NEW_EVENTS) {
    const existing = await prisma.event.findUnique({ where: { slug: ev.slug } });
    if (!existing) {
      console.log(`${ev.slug}: not found — will create`);
      toCreate.push(ev);
      continue;
    }
    const matches =
      existing.name === ev.name &&
      existing.category === ev.category &&
      existing.description === ev.description &&
      existing.technicalNotes === ev.technicalNotes &&
      existing.judgingCriteria === ev.judgingCriteria &&
      existing.commonErrors === ev.commonErrors &&
      (existing.coachingNotes ?? null) === ev.coachingNotes &&
      (existing.programmingNotes ?? null) === ev.programmingNotes &&
      existing.isPublished === ev.isPublished &&
      existing.isLaunchPriority === ev.isLaunchPriority;
    if (matches) {
      console.log(`${ev.slug}: already exists and matches approved content — ALREADY_APPLIED, skipping`);
      alreadyApplied.push(ev.slug);
    } else {
      console.log(`${ev.slug}: already exists but content differs from what this script would write — CONFLICT`);
      conflicts.push(ev.slug);
    }
  }

  console.log('');

  if (conflicts.length > 0) {
    console.error(`ABORTING — ${conflicts.length} slug(s) already exist with different content. No changes were made:`);
    for (const slug of conflicts) console.error(`  - ${slug}`);
    process.exit(1);
  }

  console.log(`${toCreate.length} to create, ${alreadyApplied.length} already applied, 0 conflicts.`);

  if (DRY_RUN) {
    console.log('\nDry run complete — no changes were written.');
    return;
  }

  if (toCreate.length === 0) {
    console.log('\nAll 6 events already exist with the approved content — nothing to create.');
    return;
  }

  const operations: Prisma.PrismaPromise<any>[] = toCreate.map(ev => prisma.event.create({ data: ev }));
  await prisma.$transaction(operations);
  console.log(`\nDone — ${operations.length} new event(s) created atomically in one transaction.`);
}

main()
  .catch(e => {
    console.error('Stage 5 insertion FAILED — transaction rolled back if it was opened, no partial changes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
