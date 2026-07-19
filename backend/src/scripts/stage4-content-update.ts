/**
 * Stage 4 — scoped Exercise/Event content-separation update.
 *
 * Rewrites ONLY the fields on the 13 confirmed duplicate-wording pairs
 * approved for Stage 4 (Axle Press, Farmer's Walk, Log Press, Yoke Walk,
 * Arm-Over-Arm Rope Pull, Axle Deadlift, Circus Dumbbell, Frame Carry,
 * Husafell Carry, Power Stairs, Stone to Shoulder, Viking Press, and the
 * near-duplicate Truck Pull exercise / Vehicle Pull event). See the
 * Stage 4 closure report for the full before/after comparison and the
 * factual/language review this content went through.
 *
 * This wording is kept in exact sync with backend/prisma/seed.ts — the
 * same 4 exercise descriptions and 13 event field sets appear in both
 * files, so a fresh database seeded from scratch receives the same
 * approved, separated content as this script applies to production.
 *
 * Deliberately NOT the general prisma/seed.ts:
 *  - seed.ts contains unguarded `contentRelationship.create()` and
 *    `recommendationPrompt.create()` calls with no existence check —
 *    re-running it against a database that already has this data would
 *    duplicate those rows. This script never touches those tables, and
 *    that unsafe behaviour is intentionally left unchanged (out of
 *    scope for this closure pass).
 *  - Every write is `prisma.exercise.update()` / `prisma.event.update()`
 *    keyed on an already-published, stable `slug` — never `create` or
 *    `upsert` — so it can only ever modify a record that already
 *    exists, never create or duplicate one.
 *  - Positive models the Stage 4 brief explicitly said NOT to touch
 *    (Atlas Stone to Lap/Platform vs Atlas Stones, Conventional Deadlift
 *    vs Deadlift, Sandbag Carry vs Sandbag Over Bar/Sandbag to Platform)
 *    are not referenced anywhere in this script.
 *
 * Content-drift protection: this script is NOT simply "safe to rerun
 * indefinitely" — it protects later, unrelated editorial changes to
 * these same records. Every field below carries both its EXPECTED
 * ORIGINAL value (what the live record contained when this wording was
 * drafted and approved) and its APPROVED FINAL value. Before writing
 * anything, every field is classified against the record's CURRENT
 * value:
 *   - current === expected original  -> PENDING (will be updated)
 *   - current === approved final     -> ALREADY_APPLIED (no-op, not an error)
 *   - anything else                  -> DRIFTED (someone changed this
 *     field to a third value since this script was written)
 * If ANY field anywhere is classified DRIFTED, the whole run aborts
 * before opening a transaction — nothing is written, and the exact
 * record and field are reported. This is deliberately stricter than
 * "only fail on missing slugs": a drifted field is exactly the case
 * where blindly overwriting could silently discard someone else's
 * more recent edit.
 *
 * Atomicity: once classification confirms it is safe to proceed, every
 * update is issued inside a single `prisma.$transaction([...])` batch —
 * either all 17 records' updates succeed together, or (if any single
 * update throws) the whole transaction rolls back and production is
 * left completely unchanged. There is no possible partial-application
 * state across the 17 records.
 *
 * Usage (never run by the assistant — production write requires the
 * repo owner's own DATABASE_URL):
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-content-update.ts --dry-run
 *   DATABASE_URL="<production-url>" npx tsx src/scripts/stage4-content-update.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

interface FieldChange {
  field: string;
  /** Expected original value, captured from the live record when this
   * wording was drafted. `null` means the field was expected empty. */
  from: string | null;
  /** Approved final value. `null` clears the field. */
  to: string | null;
}

interface RecordTarget {
  model: 'exercise' | 'event';
  slug: string;
  label: string;
  changes: FieldChange[];
}

const TARGETS: RecordTarget[] = [
  // ── Exercise descriptions (4) — each previously asserted a
  // competition-classification claim that belongs on the Event page,
  // or (Truck Pull) simply gained an explicit cross-reference. Every
  // other Exercise field is untouched by this script.
  {
    model: 'exercise',
    slug: 'exercise-farmers-walk',
    label: "Farmer's Walk (exercise)",
    changes: [
      {
        field: 'description',
        from: "Carrying two loaded implements at arm's length for distance or time. Develops grip, core stability, and conditioning simultaneously. One of the six core Strongman events.",
        to: "Carrying two loaded implements at arm's length for distance or time. Develops grip, core stability and conditioning simultaneously. Trains the loaded carry pattern used in the Farmer's Walk competition event.",
      },
    ],
  },
  {
    model: 'exercise',
    slug: 'arm-over-arm-rope-pull',
    label: 'Arm-Over-Arm Rope Pull (exercise)',
    changes: [
      {
        field: 'description',
        from: 'A Strongman event and training drill where the athlete pulls a heavy implement hand-over-hand using a rope. Tests back strength, bicep endurance, grip, and core stability.',
        to: 'A hand-over-hand rope-pulling drill, seated or standing, that trains the pulling pattern used in the Arm-Over-Arm Rope Pull competition event. Tests back strength, biceps endurance, grip and core stability.',
      },
    ],
  },
  {
    model: 'exercise',
    slug: 'axle-deadlift-exercise',
    label: 'Axle Deadlift (exercise)',
    changes: [
      {
        field: 'description',
        from: 'Deadlifting with a thick, non-revolving axle bar. The elimination of bar rotation significantly increases grip demand. A common competition event format as a max single, 3-rep max, or for repetitions in a time cap.',
        to: 'Deadlifting with a thick, non-revolving axle bar. The elimination of bar rotation significantly increases grip demand compared with a standard barbell deadlift. Trains the grip and pull demand used in the Axle Deadlift competition event.',
      },
    ],
  },
  {
    model: 'exercise',
    slug: 'truck-pull',
    label: 'Truck Pull (exercise)',
    changes: [
      {
        field: 'description',
        from: 'The athlete uses a harness and rope to drag a heavy vehicle over a set distance. Tests maximum whole-body power output and anaerobic capacity.',
        to: 'The athlete uses a harness and rope to drag a heavy vehicle over a set distance, the same movement pattern contested in the Vehicle Pull event. Tests maximum whole-body power output and anaerobic capacity.',
      },
    ],
  },

  // ── Event fields (13) — description/technicalNotes/coachingNotes/
  // commonErrors rewritten per the Stage 4 editorial standard; every
  // unsupported certainty claim identified in the closure-pass review
  // was removed, softened, or labelled "As a coaching observation".
  // judgingCriteria is not listed here — it is untouched everywhere.
  // programmingNotes is cleared (`to: null`) on every event: Events
  // have no "programming" category in the approved standard, and that
  // content stays solely on the Exercise page.
  {
    model: 'event',
    slug: 'axle-press',
    label: 'Axle Press (event)',
    changes: [
      {
        field: 'description',
        from: "The Axle Press uses a thick-bar (approximately 50mm diameter) which eliminates the use of a barbell's rotation, making the clean and press significantly more demanding on grip and wrist stability.",
        to: "The Axle Press is a Strongman pressing event contested with a thick, non-revolving bar of around 50mm diameter, which removes a standard barbell's rotation and increases the demand on grip and wrist stability.",
      },
      {
        field: 'technicalNotes',
        from: 'The axle can be cleaned from the floor (continental clean) or taken from a rack. Pressing styles include strict, push press, or jerk depending on competition rules. Check competition rules for allowed technique.',
        to: 'The axle may be cleaned from the floor or taken from raised blocks or a rack; the starting position is set by the competition. Accepted pressing styles, such as strict press, push press or jerk, vary by federation, promoter and competition, so athletes should confirm the allowed technique before each event.',
      },
      {
        field: 'coachingNotes',
        from: 'Develop wrist strength and flexibility as a priority. Teach the continental clean in isolation before combining with the press. The grip challenge means athletes need more specific preparation than standard barbell pressing.',
        to: 'As a coaching observation, grip and wrist fatigue can become the limiting factor on the axle before pressing strength does, since the thick bar removes the rotation a standard barbell allows. For technique and training progressions, see the Axle Press exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Wrist collapse during clean; pressing before body is stable; inconsistent grip width.',
        to: 'A press is not counted unless the bar is shown locked out overhead with the athlete stationary. Whether the axle must be cleaned from the floor or may be taken from a rack depends on the competition, so using the wrong starting position for the event as set can result in a no-lift.',
      },
      {
        field: 'programmingNotes',
        from: 'Include regular axle work if competitions specify it. Can be used interchangeably with log in training for variety. Accessory work: wrist curls, thick bar deadlifts, fat gripz training.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'farmers-walk',
    label: "Farmer's Walk (event)",
    changes: [
      {
        field: 'description',
        from: "Farmer's Walk is a loaded carry event where athletes pick up two heavy implements (one in each hand) and carry them for distance or time as fast as possible. It demands grip, core stability, and total body conditioning.",
        to: "Farmer's Walk is a loaded carry Strongman event. Athletes lift two heavy implements, one in each hand, and carry them for distance or time as fast as possible. It is one of the six events Educate Strong's coaching pathway teaches as the Core Six foundation of Strongman training.",
      },
      {
        field: 'technicalNotes',
        from: 'Implements are set to hip width. The athlete picks up both handles simultaneously (or one at a time by competition rule), stands tall, and carries to the finish. Dropping and re-picking is allowed in most competitions but costs time.',
        to: 'Implements are generally set to hip width, though the exact set-up is determined by the competition. Some competitions require picking up both handles at once, others require one at a time. Dropping and re-picking the implements is permitted in many competitions but costs time; the specific re-pick rules and distance or time format vary by promoter and competition.',
      },
      {
        field: 'coachingNotes',
        from: "Coach: rapid lockout from the pick, fast short stride turnover, keep the handles high (don't let them drag down arms), brace hard throughout. Teach drop and re-pick technique. Conditioning is as important as raw strength for longer distances.",
        to: "As a coaching observation, conditioning can matter as much as raw grip strength once the distance extends beyond a short sprint. For pick-up technique, stride mechanics and re-pick coaching cues, see the Farmer's Walk exercise page.",
      },
      {
        field: 'commonErrors',
        from: 'Slow pick; looking down; allowing the handles to pull shoulders forward; poor re-pick mechanics.',
        to: 'Dragging or crawling with the implements instead of carrying them is not valid and will not count. Where re-picks are permitted, losing time on a fumbled re-pick can cost placings; the specific re-pick rules vary by event.',
      },
      {
        field: 'programmingNotes',
        from: "Programme farmer's walk separately from deadlift days. Use short, heavy sets for strength; longer distance carries for conditioning. Trap bar carries are an effective substitute. Build grip work year-round.",
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'log-press',
    label: 'Log Press (event)',
    changes: [
      {
        field: 'description',
        from: 'The Log Press is one of the most iconic events in Strongman. A large cylindrical log is cleaned from the floor and pressed overhead. It demands exceptional upper body strength, trunk stability, and technical proficiency.',
        to: 'The Log Press is a pressing event in Strongman competition. A large cylindrical log is cleaned from the floor and pressed overhead under judged conditions, testing upper body strength, trunk stability and technical proficiency.',
      },
      {
        field: 'technicalNotes',
        from: 'The log must be cleaned to the chest before being pressed overhead. The athlete must show control at the top with arms locked out and feet stationary. A down signal is given by the judge once the press is complete.',
        to: 'Log Press is contested as a single maximal attempt, for repetitions, or as part of an overhead medley, depending on the competition.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: keep the log close to the body during the clean, drive through the heels on the press, and brace the core throughout. Teach the continental clean progressively. Common faults include dipping the elbows and pressing early before the clean is settled.',
        to: 'As a coaching observation, composure at the top of the lift matters as much as the clean itself: a rushed or incomplete lockout will not be given a down signal even if the clean was clean. For clean technique, pressing cues and training progressions, see the Log Press exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Pressing before the clean is settled; soft elbows at lockout; bouncing the log on the chest; losing trunk position under fatigue.',
        to: 'A press is not given a down signal without a full lockout and a stationary finish. Which pressing styles are permitted, such as strict, push press or jerk, depends on the competition.',
      },
      {
        field: 'programmingNotes',
        from: 'Programme log press in a similar fashion to overhead press. Use axle and barbell press as supplementary work. Build clean mechanics separately. Cycle 5-8 week strength blocks with a competition simulation week.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'yoke-walk',
    label: 'Yoke Walk (event)',
    changes: [
      {
        field: 'description',
        from: 'The Yoke Walk involves carrying a large steel frame (yoke) loaded with weight across the shoulders for a set distance. It is one of the most effective events for building total body strength and mental toughness.',
        to: 'The Yoke Walk is a loaded carry Strongman event. Athletes carry a heavy steel frame loaded with weight across a defined course, testing total body positional strength and composure under a heavy, unstable load.',
      },
      {
        field: 'technicalNotes',
        from: 'The yoke sits across the upper back similar to a high bar squat position. Athletes must walk a defined course without dropping the yoke. Dropping the yoke results in a no-lift or significant time penalty depending on competition rules.',
        to: 'The specific course length and number of turns are set by the competition. Where the yoke is dropped, the penalty depends on the ruleset: some competitions apply a time penalty, others rule the attempt a no-lift. Time is usually recorded when the athlete, or the front of the yoke, crosses the finish line, depending on the competition.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: brace hard, keep steps short and quick, find the balance point of the yoke before moving. Common error is taking long strides which causes the yoke to swing. Teach yoke-specific bracing and movement patterns separately from squatting.',
        to: 'As a coaching observation, athletes who rush their stride turnover under competition pressure are the ones most likely to lose control of the yoke. For balance point, bracing and stride turnover coaching cues, see the Yoke Walk exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Slow stride turnover; dropping at the pick; yoke swinging; running rather than walking controlled steps.',
        to: "Dropping the yoke during the walk is penalised or ends the attempt depending on the competition's rules. Stepping outside a marked lane or course, where lanes are used, is also not valid.",
      },
      {
        field: 'programmingNotes',
        from: 'Heavy squatting provides a good carryover. Yoke-specific work should be included in programming if the event appears in competitions. Start with manageable weights and build speed before adding load.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'arm-over-arm-rope-pull',
    label: 'Arm-Over-Arm Rope Pull (event)',
    changes: [
      {
        field: 'description',
        from: 'The athlete drags a heavy implement (sled, vehicle, or loaded rope system) hand-over-hand using a rope. A test of back strength, bicep endurance, grip, and core stability — either seated or standing depending on competition format.',
        to: 'The Arm-Over-Arm Rope Pull is a Strongman pulling event. The athlete drags a heavy implement, such as a sled, vehicle or loaded rope system, hand over hand using a rope, seated or standing depending on the competition format.',
      },
      {
        field: 'technicalNotes',
        from: 'The athlete positions themselves with feet braced against an anchor surface. Rope is pulled hand-over-hand in a controlled rhythm. Elbows stay close to the body on the pull. Drive comes from the back and biceps, not a shoulder shrug. The implement must be pulled to the finish line or past a designated marker.',
        to: 'The implement must be pulled to the finish line, or the athlete must reach a designated point on the rope, to complete the attempt. Distance, starting position and whether the seated or standing format is used all depend on the competition.',
      },
      {
        field: 'coachingNotes',
        from: 'Establish a consistent hand-over-hand rhythm early in the pull. Losing rhythm under fatigue costs significant time. Key coaching points: elbows in and close; pull from the back; keep the rope taut between pulls; breathe with each pull cycle. The seated version reduces lower back demand and is recommended for beginners.',
        to: 'As a coaching observation, losing the hand-over-hand rhythm under competition fatigue can cost meaningful time. For pulling technique and rhythm-building cues, see the Arm-Over-Arm Rope Pull exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Letting the rope go slack between pulls; pulling with hands too far from the body; relying on shoulder elevation rather than back and bicep drive; losing seated position.',
        to: 'The attempt does not count until the implement crosses the finish marker or the athlete reaches the designated point on the rope; stopping short does not score. What constitutes a valid seated position, where the seated format is used, depends on the competition.',
      },
      {
        field: 'programmingNotes',
        from: 'Include as a pulling variation for back development and grip endurance. Works well as a conditioning finisher. Programme both seated and standing variations where competitions may specify either format. Sled drags provide a lower-load precursor.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'axle-deadlift',
    label: 'Axle Deadlift (event)',
    changes: [
      {
        field: 'description',
        from: 'Deadlifting with a thick, non-revolving axle bar. The elimination of bar rotation significantly increases grip demand. Contested as a max single, a 3-rep max, or for repetitions in a time cap.',
        to: "The Axle Deadlift is a Strongman pulling event contested with a thick, non-revolving bar, which removes a standard barbell's rotation and increases the demand on grip. It is contested as a max single, a three rep max, or for repetitions in a time cap, depending on the competition.",
      },
      {
        field: 'technicalNotes',
        from: 'Set-up is similar to conventional deadlift — feet hip-width, bar over mid-foot, hip hinge to the bar. The thicker diameter requires deliberate attention to grip. The axle does not flex at the start of a heavy pull as a conventional barbell would. Straps may or may not be permitted depending on competition rules — confirm before each event.',
        to: 'Straps, sumo stance and touch-and-go reps may or may not be permitted; equipment and technique allowances depend on the federation, promoter and competition, so athletes should confirm the ruleset before each event.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: squeeze the axle hard before initiating; push the floor away as in a conventional deadlift; bar stays close to the legs throughout; full lockout. Grip capacity is often the limiting factor for new axle users — build thick-bar tolerance with regular axle work and static holds throughout the training year.',
        to: 'As a coaching observation, grip is often the limiting factor the first time an athlete competes on the axle rather than a standard bar. For set-up cues and grip-training progressions, see the Axle Deadlift exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Grip failure before lockout; bar drifting forward due to changed bar diameter; not achieving full lockout; rushing the set-up.',
        to: 'The bar must reach a standing, erect lockout to count; a rep or single that does not achieve full lockout is not scored. Whether touch-and-go reps are permitted depends on the ruleset, so resting the bar down between reps when it is not allowed can also invalidate a rep.',
      },
      {
        field: 'programmingNotes',
        from: 'Substitute axle for standard barbell on some deadlift sessions to build specific grip and pull tolerance. Athletes who are strong on the axle deadlift typically find the continental clean easier to develop. Grip accessories: thick bar static holds, rolling thunder variations.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'circus-dumbbell',
    label: 'Circus Dumbbell (event)',
    changes: [
      {
        field: 'description',
        from: 'A large single-arm dumbbell cleaned to one shoulder and pressed overhead. One of the most technically demanding overhead events, requiring unilateral shoulder strength and controlled shouldering mechanics. Contested as a max attempt, for reps, or as part of an overhead medley.',
        to: 'The Circus Dumbbell is a technically demanding overhead event in Strongman. A large single-arm dumbbell is cleaned to one shoulder and pressed overhead under judged conditions, contested as a max attempt, for reps, or as part of an overhead medley.',
      },
      {
        field: 'technicalNotes',
        from: 'Clean the dumbbell to one shoulder in a single controlled motion or via the lap. Stabilise the shoulder position before pressing. Press overhead to a stacked lockout — elbow directly under the load. The non-working arm may be used for balance but must not assist the press. Exact shoulder position and finish standards vary between competitions.',
        to: 'Exact shoulder position and finish standards, including how settled the dumbbell must be before pressing and what counts as a valid stacked lockout, depend on the competition. Whether the non-working arm may touch the body for balance is also set by the ruleset.',
      },
      {
        field: 'coachingNotes',
        from: 'Train the clean and the press as separate skill problems. Key coaching points: clean the dumbbell to a high shoulder position; settle before pressing; keep the elbow under the load; the free arm is for balance only. Build unilateral shoulder stability through kettlebell clean and press progressions before introducing competition-weight dumbbells.',
        to: 'As a coaching observation, the clean and the press are often treated as two separate skill problems: an unsettled shoulder position can end an attempt even when pressing strength is not the issue. For the clean, shouldering and pressing progressions, see the Circus Dumbbell exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Pressing before the dumbbell is settled on the shoulder; leaning excessively to the working side; using the free hand to assist the press; elbow drifting out from under the load at lockout.',
        to: 'Pressing before the dumbbell is settled on the shoulder is not judged as a valid attempt. Using the free hand to actively assist the press, rather than for balance only, is not valid; the exact allowance for the free arm depends on the competition.',
      },
      {
        field: 'programmingNotes',
        from: 'Use sparingly due to high technical and fatigue demand. Pair with bilateral overhead pressing work throughout the training year. Programme specifically when the circus dumbbell is a named event in a competition.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'frame-carry',
    label: 'Frame Carry (event)',
    changes: [
      {
        field: 'description',
        from: 'Carrying a large rectangular frame by its side handles for a set distance. Demands grip security, upper back stability, and control of a wide-stance carry with loading at the sides.',
        to: 'The Frame Carry is a loaded carry Strongman event. Athletes carry a large rectangular frame by its side handles over a set distance, testing grip security and control of a wide, laterally loaded carry.',
      },
      {
        field: 'technicalNotes',
        from: 'Position inside the frame with both hands on the side handles. Establish an even grip before initiating the pick — both sides must rise together. Walk with short, controlled strides. Brace the core and resist lateral lean. Handle heights and widths vary between apparatus designs — adjust the start position accordingly.',
        to: 'Handle heights and widths vary between apparatus designs from competition to competition, which changes the starting position and grip angle athletes need to adopt. Drop and re-pick rules, and what counts as completing the distance, depend on the federation, promoter and competition.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: even grip before the pick; squeeze then stand; both sides rise together; resist lateral lean throughout the carry; short consistent steps. Grip security is often the limiting factor. Practise the re-pick if drops are permitted in the competition — many athletes lose time here.',
        to: 'As a coaching observation, an uneven pick, where one side rises before the other, tends to be more costly in competition than in training, since it can end the attempt outright rather than just requiring a reset. For grip set-up and pick technique, see the Frame Carry exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Uneven pick causing one side to drop; overstriding and losing frame stability; grip failure before the carry is complete; lateral lean increasing under fatigue.',
        to: "An uneven pick that drops one side of the frame can end the attempt, or require a reset, depending on the competition's drop rules. Where re-picks are permitted, losing time on a fumbled re-pick counts against the clock.",
      },
      {
        field: 'programmingNotes',
        from: "Farmer's walk strength and grip work transfer well. Include frame-specific work in the final preparation block when it is a named event. Static holds at competition-width handles are the most specific grip preparation.",
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'husafell-carry',
    label: 'Husafell Carry (event)',
    changes: [
      {
        field: 'description',
        from: 'A front-loaded carry where the athlete hugs a heavy stone, sandbag, or shield against the chest and carries it for distance. Tests core strength, upper back endurance, and breathing management under a compressive front load.',
        to: 'The Husafell Carry is a front-loaded carry event. The athlete hugs a heavy stone, sandbag or shield against the chest and carries it for distance, judged on contact position and completion.',
      },
      {
        field: 'technicalNotes',
        from: 'Secure the object high on the chest — forearms and biceps cradle the load, elbows tucked underneath. Brace the core and maintain an upright posture. Short, controlled strides. Breathing is restricted by the front load — exhale steadily and breathe shallowly but consistently. Contact rules vary between competitions.',
        to: 'Which body parts may contact the implement, and what counts as a valid carrying position, depend on the federation, promoter and competition. Some competitions specify a minimum height off the chest or restrict where the arms may rest.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: carry the object high on the chest, not at the waist; elbows under the object; upright posture prevents lower back strain; short consistent steps. The breathing restriction is the most underestimated challenge — introduce this carry type progressively with new athletes.',
        to: 'As a coaching observation, the breathing restriction of a front-loaded carry can be a bigger factor in competition than raw carrying strength, particularly for athletes who have not rehearsed breathing under this specific restriction. For carrying position and breathing-management cues, see the Husafell Carry exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Carrying the object too low, increasing lower back strain; leaning backward to counterbalance; not bracing, allowing the load to compress the trunk; dropping due to breathing management failure.',
        to: "Carrying the implement low against the waist rather than high on the chest is not valid under rulesets that specify a contact position. Dropping the implement, for any reason including a breathing-management failure, is scored according to the competition's specific drop rule.",
      },
      {
        field: 'programmingNotes',
        from: 'Direct preparation for Husafell stone, shield carry, and similar front-loaded events. Front squat strength transfers well to the positional demands. Bear hug sandbag carries are an accessible training alternative.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'power-stairs',
    label: 'Power Stairs (event)',
    changes: [
      {
        field: 'description',
        from: 'Lifting a series of heavy objects up a stair apparatus one step at a time. Tests explosive leg and hip drive, pulling strength, and the ability to perform repeated near-maximal efforts under accumulating fatigue.',
        to: 'Power Stairs is a Strongman loading event. A series of heavy objects are lifted up a stair apparatus one step at a time, testing explosive leg and hip drive under accumulating competition fatigue.',
      },
      {
        field: 'technicalNotes',
        from: 'Lift each implement from its resting position using a controlled pattern appropriate to the object type. Drive the object to the next step with hip extension and leg drive. Reset the feet before initiating each step. Own each pick before moving to the next.',
        to: 'Step specifications, implement types and the number of steps in the apparatus depend on the competition. What counts as a completed step, including how firmly the implement must be set before moving to the next, is confirmed by the judge for each event.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: own the first pick — never rush it; chest up and drive through the legs; reset feet between steps; control the reset and breathe briefly. Athletes who fail at power stairs often lose position on the later objects, not the first — programme for accumulated fatigue.',
        to: 'As a coaching observation, athletes can fail on the later steps rather than the first, since accumulated fatigue plays a larger role than raw strength on any single step. For pick technique and fatigue-management cues, see the Power Stairs exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Not completing the previous step cleanly before loading the next; carrying the implement too far from the body; rushing and losing position under fatigue; failing to reset feet between steps.',
        to: 'Loading the next step before the previous one is judged complete is not valid. Failing to reset the feet between steps, where the apparatus rules require it, can also invalidate a step.',
      },
      {
        field: 'programmingNotes',
        from: 'Programme when power stairs is a named event. Conventional deadlift and block pull strength transfers directly. High quad and hip demand — front squat and leg press are useful accessories.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'stone-to-shoulder',
    label: 'Stone to Shoulder (event)',
    changes: [
      {
        field: 'description',
        from: 'Lifting an atlas stone from the floor and fixing it to one shoulder. Requires the full atlas stone lapping pattern followed by an explosive rotation phase to seat the stone on the shoulder. More technically demanding than platform loading.',
        to: 'Stone to Shoulder is a Strongman loading event. An atlas stone is lifted from the floor and fixed to one shoulder, requiring the full lapping pattern followed by a rotation phase, judged for a stable, settled finish.',
      },
      {
        field: 'technicalNotes',
        from: 'Complete the stone-to-lap phase before attempting the rotation. With the stone in the lap, use hip drive and a controlled shrug rotation to transfer the stone to the shoulder. The shoulder catch must be stable. Rules on valid shoulder position and settle requirements vary between competitions.',
        to: 'What counts as a valid, settled shoulder position, and how long the stone must be held there before it counts, depends on the federation, promoter and competition.',
      },
      {
        field: 'coachingNotes',
        from: 'Key coaching points: never rush the lap phase; the rotation is initiated by hip drive, not arm strength; the shoulder must be square and ready to receive the stone. Build the lap and rotation as separate skill phases in early training. Start with lighter or natural stones before competition weight.',
        to: 'As a coaching observation, a rushed rotation phase tends to be punished more heavily in competition than in training, since an unstable shoulder catch is not counted regardless of how close the stone got to the shoulder. For the lap-to-shoulder rotation technique, see the Stone to Shoulder exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Rushing from the floor without a solid lap position; rotating with arms before hip drive; unstable shoulder catch; overrotating and losing the stone.',
        to: 'An unstable shoulder catch, where the stone moves or slips after placement, is not judged as a valid completion. Rushing the lift from the floor without a solid lap position can also lead to a failed rotation.',
      },
      {
        field: 'programmingNotes',
        from: 'Programme when stone to shoulder is a named event. Atlas stone to lap work builds the primary skill. Front-loaded squat strength and unilateral trunk stability are useful accessories.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'viking-press',
    label: 'Viking Press (event)',
    changes: [
      {
        field: 'description',
        from: 'A fixed-lever overhead pressing event contested for repetitions in a time cap. The athlete presses a pivoting apparatus overhead repeatedly. Common in amateur, national, and international Strongman competition for testing overhead endurance and pressing rhythm.',
        to: 'The Viking Press is a fixed-lever overhead pressing event contested for repetitions in a time cap. The athlete presses a pivoting apparatus overhead repeatedly. It is common in amateur, national and international Strongman competition.',
      },
      {
        field: 'technicalNotes',
        from: 'Establish an even foot position under the pivot. Dip into the start of each rep and drive through the natural path of the lever. Maintain a stacked lockout position at the top. Breathe consistently for sustained output. The pivot path varies between apparatus designs — identify the natural groove before competition. Re-dip rules between reps vary by competition.',
        to: 'Re-dip rules between reps, foot movement allowances and lockout standards vary between apparatus designs and competition formats; always confirm before the event.',
      },
      {
        field: 'coachingNotes',
        from: 'Teach consistent lockout quality across all repetitions. Key coaching points: stay under the line of force; short controlled dip; finish each rep stacked; breathe rhythmically; do not rush the turnaround at the bottom. Jammer press or machine shoulder press provide a similar stimulus when the Viking apparatus is unavailable.',
        to: 'As a coaching observation, lockout quality can degrade across reps under competition fatigue before an athlete notices it themselves, and an incomplete lockout is not counted regardless of how many reps have already been completed. For dip mechanics and pacing cues, see the Viking Press exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Drifting backward and losing the line of force; incomplete lockout on later repetitions; holding breath across multiple reps; rushing the reversal at the bottom of each rep.',
        to: 'An incomplete lockout on any repetition is not counted by the judge, however late in the set it occurs. Excessive foot movement or repositioning between reps, where the apparatus rules restrict it, can also invalidate a rep.',
      },
      {
        field: 'programmingNotes',
        from: 'Good for building overhead volume without the clean fatigue of log or axle. Can substitute for one overhead session per week in a competition preparation block.',
        to: null,
      },
    ],
  },
  {
    model: 'event',
    slug: 'vehicle-pull',
    label: 'Vehicle Pull (event)',
    changes: [
      {
        field: 'description',
        from: 'The athlete uses a harness and rope to drag a heavy vehicle (lorry, bus, car, or other) over a set distance. One of the most iconic Strongman events, testing maximum whole-body power output and anaerobic capacity.',
        to: 'The Vehicle Pull is a Strongman event in which the athlete uses a harness and rope to drag a heavy vehicle, such as a lorry, bus or car, over a set distance, testing maximum whole-body power output and anaerobic capacity.',
      },
      {
        field: 'technicalNotes',
        from: "The harness sits across the upper chest. The athlete leans forward into the harness and drives with short, powerful steps to overcome the vehicle's inertia. Once the vehicle begins to move, transition to longer strides while maintaining forward lean. The rope is held loosely — drive force comes through the harness, not the arms. Vehicle weight, surface, and distance vary significantly by competition.",
        to: "Vehicle weight, surface and distance vary significantly by competition and are set by the promoter. Braking state, meaning whether the vehicle's brakes are released or partially applied, also varies by event and affects the difficulty.",
      },
      {
        field: 'coachingNotes',
        from: 'The most common error is pausing once the vehicle begins to slow. Inertia must be maintained continuously — stopping costs more time than slowing. Key coaching points: drive through the floor; lean into the harness; arms relaxed; build momentum and maintain it.',
        to: 'As a coaching observation, pausing once the vehicle begins to slow can cost more time than maintaining a slower continuous drive, since restarting a stationary vehicle takes more force than keeping one moving. For harness set-up and drive-mechanics cues, see the Truck Pull exercise page.',
      },
      {
        field: 'commonErrors',
        from: 'Pausing when the vehicle slows; over-relying on arms rather than leg drive; taking short, ineffective steps once initial momentum is established.',
        to: "Pausing once the vehicle slows, rather than maintaining continuous drive, can cost time against the clock or other competitors. The attempt is complete when the vehicle crosses the finish line, or when the athlete crosses it with the vehicle still moving behind them, depending on the competition's specific criteria.",
      },
      {
        field: 'programmingNotes',
        from: 'Simulate with sled pulls until access to a vehicle pull event is available. Strength base: back squat, deadlift, and heavy sled drag provide the best carryover. Taper: avoid maximum vehicle pulls within 7–10 days of competition.',
        to: null,
      },
    ],
  },
];

type FieldStatus = 'PENDING' | 'ALREADY_APPLIED' | 'DRIFTED';

interface ClassifiedField extends FieldChange {
  status: FieldStatus;
  current: string | null;
}

interface ClassifiedRecord {
  target: RecordTarget;
  fields: ClassifiedField[];
}

async function main() {
  console.log(`Stage 4 content update — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}`);
  console.log(`Target: ${TARGETS.length} record(s) (${TARGETS.filter(t => t.model === 'exercise').length} exercise, ${TARGETS.filter(t => t.model === 'event').length} event)\n`);

  // ── Phase 1: pre-flight existence check — before touching content at all.
  const missing: string[] = [];
  const rows = new Map<string, any>();

  for (const target of TARGETS) {
    const row =
      target.model === 'exercise'
        ? await prisma.exercise.findUnique({ where: { slug: target.slug } })
        : await prisma.event.findUnique({ where: { slug: target.slug } });
    if (!row) missing.push(`${target.model}:${target.slug}`);
    else rows.set(target.slug, row);
  }

  if (missing.length > 0) {
    console.error('ABORTING — expected record(s) not found. No changes were made:');
    for (const m of missing) console.error(`  - ${m}`);
    process.exit(1);
  }
  console.log(`All ${TARGETS.length} expected records found.\n`);

  // ── Phase 2: classify every field (original / already applied / drifted)
  // BEFORE any write is attempted.
  const classified: ClassifiedRecord[] = TARGETS.map(target => {
    const row = rows.get(target.slug);
    const fields: ClassifiedField[] = target.changes.map(change => {
      const current: string | null = row[change.field] ?? null;
      let status: FieldStatus;
      if (current === change.from) status = 'PENDING';
      else if (current === change.to) status = 'ALREADY_APPLIED';
      else status = 'DRIFTED';
      return { ...change, status, current };
    });
    return { target, fields };
  });

  // ── Phase 3: print the full classification report — always, dry run
  // or not, so both modes give the same visibility into every field.
  for (const { target, fields } of classified) {
    console.log(`${target.label} [${target.slug}]`);
    for (const f of fields) {
      console.log(`  ${f.field}: ${f.status}`);
      if (f.status === 'DRIFTED') {
        console.log(`    EXPECTED ORIGINAL: ${f.from ?? '(empty)'}`);
        console.log(`    APPROVED FINAL:    ${f.to ?? '(cleared)'}`);
        console.log(`    ACTUAL CURRENT:    ${f.current ?? '(empty)'}`);
      } else if (f.status === 'PENDING') {
        console.log(`    BEFORE: ${f.from ?? '(empty)'}`);
        console.log(`    AFTER:  ${f.to ?? '(cleared)'}`);
      } else {
        console.log(`    Already matches the approved final value — no change needed.`);
      }
    }
    console.log('');
  }

  // ── Phase 4: any drift anywhere aborts the entire run before any
  // transaction is opened. Never overwrite an unexpected value.
  const drifted = classified.flatMap(r => r.fields.filter(f => f.status === 'DRIFTED').map(f => ({ record: r.target, field: f })));
  if (drifted.length > 0) {
    console.error(`ABORTING — ${drifted.length} field(s) have drifted from the expected original value. No changes were made:`);
    for (const d of drifted) {
      console.error(`  - ${d.record.label} [${d.record.slug}].${d.field.field}`);
    }
    process.exit(1);
  }

  const totalPending = classified.reduce((n, r) => n + r.fields.filter(f => f.status === 'PENDING').length, 0);
  const totalAlready = classified.reduce((n, r) => n + r.fields.filter(f => f.status === 'ALREADY_APPLIED').length, 0);
  console.log(`No drift detected. ${totalPending} field(s) pending, ${totalAlready} field(s) already applied.`);

  if (DRY_RUN) {
    console.log('\nDry run complete — no changes were written.');
    return;
  }

  if (totalPending === 0) {
    console.log('\nEverything already matches the approved final wording — nothing to write.');
    return;
  }

  // ── Phase 5: build one update operation per record that has at least
  // one PENDING field (skip fields that are already correct — no-op
  // writes are harmless but unnecessary), then apply all of them in a
  // single transaction: every record updates together, or (if any one
  // update throws) the whole batch rolls back and nothing changes.
  const operations: Prisma.PrismaPromise<any>[] = [];
  for (const { target, fields } of classified) {
    const pending = fields.filter(f => f.status === 'PENDING');
    if (pending.length === 0) continue;
    const data: Record<string, string | null> = {};
    for (const f of pending) data[f.field] = f.to;
    operations.push(
      target.model === 'exercise'
        ? prisma.exercise.update({ where: { slug: target.slug }, data })
        : prisma.event.update({ where: { slug: target.slug }, data })
    );
  }

  await prisma.$transaction(operations);
  console.log(`\nDone — ${operations.length} record(s) updated atomically in one transaction.`);
}

main()
  .catch(e => {
    console.error('Stage 4 update FAILED — transaction rolled back if it was opened, no partial changes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
