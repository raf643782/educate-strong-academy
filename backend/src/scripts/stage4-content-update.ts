/**
 * Stage 4 — scoped Exercise/Event content-separation update.
 *
 * Rewrites ONLY the fields on the 13 confirmed duplicate-wording pairs
 * approved for Stage 4 (Axle Press, Farmer's Walk, Log Press, Yoke Walk,
 * Arm-Over-Arm Rope Pull, Axle Deadlift, Circus Dumbbell, Frame Carry,
 * Husafell Carry, Power Stairs, Stone to Shoulder, Viking Press, and the
 * near-duplicate Truck Pull exercise / Vehicle Pull event). See the
 * Stage 4 report for the full before/after comparison this content is
 * drawn from.
 *
 * Deliberately NOT the general prisma/seed.ts:
 *  - seed.ts contains unguarded `contentRelationship.create()` and
 *    `recommendationPrompt.create()` calls with no existence check —
 *    re-running it against a database that already has this data would
 *    duplicate those rows. This script never touches those tables.
 *  - Every write here is `prisma.exercise.update()` / `prisma.event.update()`
 *    keyed on an already-published, stable `slug` — never `create` or
 *    `upsert` — so it can only ever modify a record that already exists,
 *    never create or duplicate one. Re-running this script simply
 *    re-applies the same final text; it is fully idempotent.
 *  - Positive models the Stage 4 brief explicitly said NOT to touch
 *    (Atlas Stone to Lap/Platform vs Atlas Stones, Conventional Deadlift
 *    vs Deadlift, Sandbag Carry vs Sandbag Over Bar/Sandbag to Platform)
 *    are not referenced anywhere in this script.
 *
 * Every Exercise row keeps all of: techniqueNotes, coachingCues,
 * commonMistakes, progressions, regressions, safetyNotes, equipmentNeeded
 * untouched — only `description` changes, and only on the 3 exercises
 * where the current wording asserted a competition-classification claim
 * that belongs on the Event page instead. Every Event row's
 * `judgingCriteria` is left untouched (already correctly event-specific);
 * `programmingNotes` is cleared because the Stage 4 editorial standard
 * gives Events no "programming" category — that content already lives,
 * unduplicated, on the Exercise page.
 *
 * Usage (never run by the assistant — production write requires the
 * repo owner's own DATABASE_URL):
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-content-update.ts --dry-run
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-content-update.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

interface ExerciseUpdate {
  slug: string;
  data: { description: string };
}

interface EventUpdate {
  slug: string;
  data: {
    description: string;
    technicalNotes: string;
    coachingNotes: string;
    commonErrors: string;
    programmingNotes: null;
  };
}

// ── Exercise side: only 3 descriptions changed — each previously
// asserted a competition-classification fact ("one of the six core
// Strongman events", "A Strongman event and training drill", "A common
// competition event format...") that belongs on the Event page. Every
// other Exercise field is untouched by this script.
const EXERCISE_UPDATES: ExerciseUpdate[] = [
  {
    slug: 'exercise-farmers-walk',
    data: {
      description:
        "Carrying two loaded implements at arm's length for distance or time. Develops grip, core stability, and conditioning simultaneously — trains the exact loaded-carry pattern used in the Farmer's Walk competition event.",
    },
  },
  {
    slug: 'arm-over-arm-rope-pull',
    data: {
      description:
        'A hand-over-hand rope-pulling drill, seated or standing, that trains the exact pulling pattern used in the Arm-Over-Arm Rope Pull competition event. Tests back strength, bicep endurance, grip, and core stability.',
    },
  },
  {
    slug: 'axle-deadlift-exercise',
    data: {
      description:
        'Deadlifting with a thick, non-revolving axle bar. The elimination of bar rotation significantly increases grip demand compared to a standard barbell deadlift — trains the exact grip and pull demand used in the Axle Deadlift competition event.',
    },
  },
];

// ── Event side: description/technicalNotes/coachingNotes/commonErrors
// rewritten per the Stage 4 editorial standard (Competition format /
// Athlete objective / Equipment setup / Judging standards / No lifts /
// Penalties / Rule variations / Competition context — no technique
// teaching, no programming). judgingCriteria is untouched everywhere.
const EVENT_UPDATES: EventUpdate[] = [
  {
    slug: 'axle-press',
    data: {
      description:
        'The Axle Press is a Strongman pressing event contested with a thick, non-revolving bar (approximately 50mm diameter), which removes a standard barbell’s rotation and puts extra demand on grip and wrist stability under competition conditions.',
      technicalNotes:
        'Contested as a single maximal attempt, for repetitions, or as part of an overhead medley depending on the competition. The axle may be taken from the floor (continental clean) or from raised blocks or a rack — the starting position is set by the promoter. Accepted pressing styles (strict, push press, or jerk) vary by federation and competition, so athletes should confirm the allowed technique before each event.',
      coachingNotes:
        'Because the axle removes bar rotation entirely, grip and wrist fatigue — rather than raw pressing strength — is often what limits an athlete’s result once the load gets heavy in competition. For technique and training progressions, see the Axle Press exercise page.',
      commonErrors:
        'A press is not valid unless the bar is fully locked out overhead with the athlete stationary — judges will not signal down on a soft or bent-arm lockout. Rules on whether the bar may be taken from a rack or must be cleaned from the floor vary by competition; using the wrong starting position for the event as set can result in a no-lift.',
      programmingNotes: null,
    },
  },
  {
    slug: 'farmers-walk',
    data: {
      description:
        "Farmer's Walk is a loaded-carry Strongman event: athletes lift two heavy implements, one in each hand, and carry them for distance or time as fast as possible. It is one of the six events taught as the “Core Six” foundation of Strongman competition.",
      technicalNotes:
        'Implements are typically set to hip width and picked up simultaneously, though some competitions require picking up one handle at a time. Dropping and re-picking the implements is allowed in most competitions but costs time — the specific re-pick rules and distance or time format vary by promoter and competition.',
      coachingNotes:
        "Conditioning becomes at least as important as raw grip strength once the distance extends beyond a short sprint — this is the main way Farmer's Walk differs from a pure strength test in competition. For pick-up technique, stride mechanics and re-pick coaching cues, see the Farmer's Walk exercise page.",
      commonErrors:
        'Dragging or crawling with the implements instead of carrying them upright is not valid and will not be scored. Where re-picks are permitted, a slow or fumbled re-pick after a drop costs meaningful time against the clock or against other competitors.',
      programmingNotes: null,
    },
  },
  {
    slug: 'log-press',
    data: {
      description:
        'The Log Press is one of the most iconic pressing events in Strongman competition: a large cylindrical log is cleaned from the floor and pressed overhead under judged conditions, testing upper body strength, trunk stability and composure under a maximal single attempt or repetition format.',
      technicalNotes:
        'Contested as a single maximal attempt, for repetitions, or as part of an overhead medley depending on the competition. A down signal is given by the judge once the press shows a full, controlled lockout with the athlete stationary.',
      coachingNotes:
        'Under competition fatigue, athletes most often lose the down signal by rushing the top of the lift rather than by failing the clean — composure at lockout matters as much as raw strength. For clean technique, pressing cues and training progressions, see the Log Press exercise page.',
      commonErrors:
        "A press is not valid without a full lockout and a stationary finish — pressing out or bouncing at the top before the judge's signal will not be scored. Rules on permitted pressing style (strict, push press, or jerk) vary by competition, and using a non-permitted style can result in a no-lift.",
      programmingNotes: null,
    },
  },
  {
    slug: 'yoke-walk',
    data: {
      description:
        'The Yoke Walk is a loaded-carry Strongman event: athletes carry a heavy steel frame loaded with weight across a defined course, testing total body positional strength, bracing, and composure under a heavy, unstable load.',
      technicalNotes:
        'Athletes must carry the yoke across a defined course without dropping it — the specific course length, turns, and drop penalty (no-lift or time penalty) vary by federation, promoter, and competition. Time is typically recorded when the athlete crosses the finish line or the front of the yoke passes it, depending on the ruleset.',
      coachingNotes:
        'The biggest difference from training is the added instability of a competition-height yoke under time pressure — athletes who rush their stride turnover in competition are the ones who lose control of the frame. For balance-point, bracing and stride-turnover coaching cues, see the Yoke Walk exercise page.',
      commonErrors:
        'Dropping the yoke mid-course is penalised or invalidates the attempt depending on the specific ruleset — confirm the drop rule before competing. Stepping outside the marked lane or course, where lanes are used, is also not valid in most rulesets.',
      programmingNotes: null,
    },
  },
  {
    slug: 'arm-over-arm-rope-pull',
    data: {
      description:
        'The Arm-Over-Arm Rope Pull is a Strongman pulling event: the athlete drags a heavy implement — sled, vehicle, or loaded rope system — hand-over-hand using a rope, seated or standing depending on the competition format.',
      technicalNotes:
        'The implement must be pulled to the finish line or past a designated marker to complete the attempt. Distance, starting position, and whether the seated or standing format is used all vary by competition — confirm before the event.',
      coachingNotes:
        'Losing the hand-over-hand rhythm under competition fatigue costs significant time — more so than in training, where fresh athletes rarely break rhythm. For pulling technique and rhythm-building cues, see the Arm-Over-Arm Rope Pull exercise page.',
      commonErrors:
        'The attempt is not complete until the implement crosses the finish marker or the athlete reaches the designated point on the rope — stopping short does not score. Rules vary by federation, promoter, and competition on what constitutes a valid seated position where the seated format is used.',
      programmingNotes: null,
    },
  },
  {
    slug: 'axle-deadlift',
    data: {
      description:
        "The Axle Deadlift is a Strongman pulling event contested with a thick, non-revolving bar, which removes a standard barbell's rotation and puts significantly more demand on grip. It is contested as a max single, a 3-rep max, or for repetitions in a time cap depending on the competition.",
      technicalNotes:
        'Straps, sumo stance, and touch-and-go reps may or may not be permitted — equipment and technique allowances vary by federation, promoter, and competition, so athletes should confirm the ruleset before each event.',
      coachingNotes:
        "Grip is usually the limiting factor the first time an athlete competes on axle rather than a standard bar — this gap is bigger in competition, where there's no second attempt to adjust, than it appears in training. For set-up cues and grip-training progressions, see the Axle Deadlift exercise page.",
      commonErrors:
        "The bar must reach a standing, erect lockout to count — a rep or single that doesn't achieve full lockout is not scored. Where touch-and-go reps aren't permitted by the ruleset, resting the bar down between reps incorrectly can also invalidate a rep.",
      programmingNotes: null,
    },
  },
  {
    slug: 'circus-dumbbell',
    data: {
      description:
        'The Circus Dumbbell is one of the most technically demanding overhead events in Strongman: a large single-arm dumbbell is cleaned to one shoulder and pressed overhead under judged conditions, contested as a max attempt, for reps, or as part of an overhead medley.',
      technicalNotes:
        'Exact shoulder position and finish standards — how settled the dumbbell must be before pressing, and what counts as a valid stacked lockout — vary between competitions. Whether the non-working arm may touch the body for balance is also ruleset-specific.',
      coachingNotes:
        'The clean and the press are effectively two separate skill problems in competition — many athletes lose their attempt on an unsettled shoulder position rather than on pressing strength itself. For the clean, shouldering and pressing progressions, see the Circus Dumbbell exercise page.',
      commonErrors:
        'Pressing before the dumbbell is fully settled on the shoulder is a common reason attempts are not judged as a valid lockout. Using the free arm to actively assist the press, rather than for balance only, is not valid under most rulesets.',
      programmingNotes: null,
    },
  },
  {
    slug: 'frame-carry',
    data: {
      description:
        'The Frame Carry is a loaded-carry Strongman event: athletes carry a large rectangular frame by its side handles over a set distance, testing grip security and control of a wide, laterally-loaded carry.',
      technicalNotes:
        'Handle heights and widths vary between apparatus designs from competition to competition, which changes the starting position and grip angle athletes need to adopt. Drop and re-pick rules, and what counts as completing the distance, vary by federation, promoter, and competition.',
      coachingNotes:
        'An uneven pick — one side rising before the other — is far more costly in competition than in training, since it often ends the attempt outright rather than just requiring a reset. For grip set-up and pick technique, see the Frame Carry exercise page.',
      commonErrors:
        "An uneven pick that drops one side of the frame typically ends the attempt rather than allowing a reset, depending on the competition's drop rules. Where re-picks are permitted, losing time on a fumbled re-pick counts against the clock.",
      programmingNotes: null,
    },
  },
  {
    slug: 'husafell-carry',
    data: {
      description:
        'The Husafell Carry is a front-loaded carry event: the athlete hugs a heavy stone, sandbag, or shield against the chest and carries it for distance under competition judging on contact and completion.',
      technicalNotes:
        'Which body parts may contact the implement, and what counts as a valid carrying position, vary by federation, promoter, and competition. Some competitions specify a minimum height off the chest or restrict where the arms may rest.',
      coachingNotes:
        "The breathing restriction of a front-loaded carry is often the deciding factor in competition, more so than raw carrying strength — athletes who haven't rehearsed breathing under this specific restriction tend to slow dramatically over distance. For carrying position and breathing-management cues, see the Husafell Carry exercise page.",
      commonErrors:
        'Carrying the implement too low against the waist rather than high on the chest is invalid under most rulesets that specify a contact position. Dropping the implement due to breathing-management failure ends the attempt rather than allowing a reset in most competitions.',
      programmingNotes: null,
    },
  },
  {
    slug: 'power-stairs',
    data: {
      description:
        'Power Stairs is a Strongman loading event: a series of heavy objects are lifted up a stair apparatus one step at a time, testing explosive leg and hip drive under accumulating competition fatigue.',
      technicalNotes:
        'Step specifications, implement types, and the number of steps in the apparatus vary by competition. What counts as a completed step — how firmly the implement must be set before moving to the next — is judged and confirmed per event.',
      coachingNotes:
        'Athletes typically fail on the later, not the first, steps in competition — accumulated fatigue rather than raw strength on any single step is usually what decides the result. For pick technique and fatigue-management cues, see the Power Stairs exercise page.',
      commonErrors:
        'Loading the next step before the previous one is judged complete is not valid and will not be scored. Failing to reset the feet between steps, if required by the specific apparatus rules, can also invalidate a step.',
      programmingNotes: null,
    },
  },
  {
    slug: 'stone-to-shoulder',
    data: {
      description:
        'Stone to Shoulder is a Strongman loading event: an atlas stone is lifted from the floor and fixed to one shoulder, requiring the full lapping pattern followed by an explosive rotation phase, judged for a stable, settled finish.',
      technicalNotes:
        'What counts as a valid, settled shoulder position — and how long the stone must be held there before it counts — varies by federation, promoter, and competition.',
      coachingNotes:
        "A rushed rotation phase is punished more heavily in competition than in training, since an unstable shoulder catch simply doesn't count — there's no partial credit for getting the stone most of the way to the shoulder. For the lap-to-shoulder rotation technique, see the Stone to Shoulder exercise page.",
      commonErrors:
        'An unstable shoulder catch — the stone moving or slipping after placement — is not judged as a valid completion. Rushing the lift from the floor without a solid lap position, which often carries through to a failed rotation, is the most common reason attempts are not scored.',
      programmingNotes: null,
    },
  },
  {
    slug: 'viking-press',
    data: {
      description:
        'The Viking Press is a fixed-lever overhead pressing event contested for repetitions in a time cap: the athlete presses a pivoting apparatus overhead repeatedly, common in amateur, national and international Strongman competition.',
      technicalNotes:
        'Re-dip rules between reps, foot movement allowances, and lockout standards vary between apparatus designs and competition formats — always confirm before the event.',
      coachingNotes:
        "Lockout quality tends to degrade across reps under competition fatigue before an athlete notices it themselves — judges will not count a rep with an incomplete lockout even late in a set. For dip mechanics and pacing cues, see the Viking Press exercise page.",
      commonErrors:
        'An incomplete lockout on any repetition, however late in the set, is not counted by the judge. Excessive foot movement or repositioning between reps, where the apparatus rules restrict it, can also invalidate a rep.',
      programmingNotes: null,
    },
  },
  {
    slug: 'vehicle-pull',
    data: {
      description:
        'The Vehicle Pull is one of the most iconic Strongman events: the athlete uses a harness and rope to drag a heavy vehicle — lorry, bus, car, or other — over a set distance, testing maximum whole-body power output and anaerobic capacity under competition conditions.',
      technicalNotes:
        "Vehicle weight, surface, and distance vary significantly by competition and are set by the promoter. Braking state (whether the vehicle's brakes are released or partially applied) also varies by event and materially changes the difficulty.",
      coachingNotes:
        'The single most common way athletes lose time in competition is pausing once the vehicle begins to slow, rather than a lack of raw power — inertia is far more expensive to rebuild than to maintain. For harness set-up and drive-mechanics cues, see the Truck Pull exercise page.',
      commonErrors:
        "Pausing once the vehicle slows, rather than maintaining continuous drive, is the most common reason athletes lose time against the clock or other competitors. The attempt is not complete until the vehicle crosses the finish line, or the athlete crosses it with the vehicle still in motion behind them, depending on the specific competition's criteria.",
      programmingNotes: null,
    },
  },
];

async function main() {
  console.log(`Stage 4 content update — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}`);
  console.log(`Target: ${EXERCISE_UPDATES.length} exercise record(s), ${EVENT_UPDATES.length} event record(s)\n`);

  const missing: string[] = [];
  const currentExercises = new Map<string, any>();
  const currentEvents = new Map<string, any>();

  for (const u of EXERCISE_UPDATES) {
    const row = await prisma.exercise.findUnique({ where: { slug: u.slug } });
    if (!row) missing.push(`exercise:${u.slug}`);
    else currentExercises.set(u.slug, row);
  }
  for (const u of EVENT_UPDATES) {
    const row = await prisma.event.findUnique({ where: { slug: u.slug } });
    if (!row) missing.push(`event:${u.slug}`);
    else currentEvents.set(u.slug, row);
  }

  if (missing.length > 0) {
    console.error('ABORTING — expected record(s) not found. No changes were made:');
    for (const m of missing) console.error(`  - ${m}`);
    process.exit(1);
  }

  console.log(`All ${EXERCISE_UPDATES.length + EVENT_UPDATES.length} expected records found. Planned changes:\n`);

  for (const u of EXERCISE_UPDATES) {
    const before = currentExercises.get(u.slug);
    console.log(`EXERCISE ${u.slug} (${before.name})`);
    for (const [field, newVal] of Object.entries(u.data)) {
      console.log(`  ${field}:`);
      console.log(`    BEFORE: ${before[field] ?? '(empty)'}`);
      console.log(`    AFTER:  ${newVal}`);
    }
    console.log('');
  }

  for (const u of EVENT_UPDATES) {
    const before = currentEvents.get(u.slug);
    console.log(`EVENT ${u.slug} (${before.name})`);
    for (const [field, newVal] of Object.entries(u.data)) {
      console.log(`  ${field}:`);
      console.log(`    BEFORE: ${before[field] ?? '(empty)'}`);
      console.log(`    AFTER:  ${newVal === null ? '(cleared — no programming content on Event pages per Stage 4 standard)' : newVal}`);
    }
    console.log('');
  }

  if (DRY_RUN) {
    console.log('Dry run complete — no changes were written.');
    return;
  }

  for (const u of EXERCISE_UPDATES) {
    await prisma.exercise.update({ where: { slug: u.slug }, data: u.data });
    console.log(`Updated exercise: ${u.slug}`);
  }
  for (const u of EVENT_UPDATES) {
    await prisma.event.update({ where: { slug: u.slug }, data: u.data });
    console.log(`Updated event: ${u.slug}`);
  }

  console.log(`\nDone — ${EXERCISE_UPDATES.length + EVENT_UPDATES.length} record(s) updated.`);
}

main()
  .catch(e => {
    console.error('Stage 4 update FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
