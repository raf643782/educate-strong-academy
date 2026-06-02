import { PrismaClient, Pathway, LessonType, ContentType, Difficulty, BeStrongCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Educate.Strong database...');

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('AdminPass123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@educate-strong.com' },
    update: {},
    create: {
      email: 'admin@educate-strong.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const learnerPassword = await bcrypt.hash('CoachPass123!', 12);
  const learner = await prisma.user.upsert({
    where: { email: 'coach@example.com' },
    update: {},
    create: {
      email: 'coach@example.com',
      password: learnerPassword,
      firstName: 'Alex',
      lastName: 'Thompson',
      role: 'LEARNER',
    },
  });

  console.log(`Users created: ${admin.email}, ${learner.email}`);

  // ── Courses ────────────────────────────────────────────────────────────────
  const courseDefs = [
    {
      title: 'Level 1 Fundamentals of Coaching Strongman',
      slug: 'level-1-coaching-strongman',
      description: "The UK's original Strongman coaching course. Learn to coach the six core events safely and effectively. Covers technique, athlete screening, safety, coaching fundamentals, and beginner programming.",
      summary: 'Teach coaches how to introduce Strongman safely and effectively across the six core events.',
      pathway: Pathway.COACHING,
      level: 1,
      durationHours: 15,
      isPublished: true,
      sortOrder: 1,
      modules: [
        'Introduction to Strongman and the Coaching Role',
        'Athlete Screening and Readiness',
        'Strongman Events — The Core Six',
        'Coaching Fundamentals',
        'Teaching Technique — Cues, Faults, and Corrections',
        'Introduction to Programming',
        'Competition Awareness',
      ],
    },
    {
      title: 'Level 2 Coaching Strongman',
      slug: 'level-2-coaching-strongman',
      description: 'Develop your athletes beyond beginner level. Covers intermediate programming, periodisation, advanced event coaching, competition preparation, athlete management, and nutrition fundamentals.',
      summary: 'Build on Level 1 foundations to develop Strongman athletes at intermediate level.',
      pathway: Pathway.COACHING,
      level: 2,
      durationHours: 25,
      isPublished: true,
      sortOrder: 2,
      modules: [
        'Intermediate Programming and Periodisation',
        'Advanced Event Coaching — The Core Six',
        'Athlete Development',
        'Recovery and Performance Management',
        'Nutrition Fundamentals for Coaches',
        'Competition Preparation Coaching',
        'Applied Coaching Practice',
      ],
    },
    {
      title: 'Level 3 Advanced Coaching Strongman',
      slug: 'level-3-coaching-strongman',
      description: 'For advanced coaches working with higher-level athletes. Covers high-performance programming, sports science, elite athlete management, psychology, and building coaching systems.',
      summary: 'Coach at advanced level and contribute to the development of other coaches.',
      pathway: Pathway.COACHING,
      level: 3,
      durationHours: 40,
      isPublished: true,
      sortOrder: 3,
      modules: [
        'High Performance Programming',
        'Elite Event Coaching',
        'Sports Science for Coaches',
        'Advanced Athlete Management',
        'Psychology and Performance',
        'Building Coaching Systems',
        'Advanced Case Studies and Professional Review Preparation',
      ],
    },
    {
      title: 'Level 1 Strongman Refereeing',
      slug: 'level-1-strongman-refereeing',
      description: 'The first step to becoming a trusted official in Strongman. Covers refereeing ethos, event rules for the six core events, judging decisions, competition operations, and safety.',
      summary: 'Learn to referee Strongman competitions fairly and consistently.',
      pathway: Pathway.REFEREEING,
      level: 1,
      durationHours: 10,
      isPublished: true,
      sortOrder: 4,
      modules: [
        'The Role and Ethics of a Referee',
        'Competition Operations',
        'Event Rules — The Core Six',
        'Judging Decisions',
        'Safety and Welfare',
        'Practical Preparation and First Assignment',
      ],
    },
    {
      title: 'StrongKidz Coach Education',
      slug: 'strongkidz-coach-education',
      description: 'Professional coach education for adults delivering StrongKidz sessions. Covers safeguarding, youth development, age-appropriate movement, session planning, and parent communication.',
      summary: 'Everything you need to deliver StrongKidz sessions safely and professionally.',
      pathway: Pathway.STRONGKIDZ,
      level: 1,
      durationHours: 10,
      isPublished: true,
      sortOrder: 5,
      modules: [
        'Safeguarding and Child Protection',
        'Understanding Youth Development',
        'Coaching Children',
        'Movement Development and Strength Training',
        'Session Planning and Parent Communication',
      ],
    },
  ];

  const createdCourses: any[] = [];

  for (const courseDef of courseDefs) {
    const { modules: moduleTitles, ...courseData } = courseDef;

    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: courseData,
    });

    createdCourses.push(course);

    for (let mi = 0; mi < moduleTitles.length; mi++) {
      const moduleTitle = moduleTitles[mi];
      const existingModule = await prisma.module.findFirst({
        where: { courseId: course.id, title: moduleTitle },
      });

      let mod: any;
      if (existingModule) {
        mod = existingModule;
      } else {
        mod = await prisma.module.create({
          data: {
            courseId: course.id,
            title: moduleTitle,
            sortOrder: mi + 1,
            isPublished: true,
          },
        });
      }

      const lessonTitles = [
        `Introduction to ${moduleTitle}`,
        `Key Principles of ${moduleTitle}`,
        'Practical Application',
        'Module Summary and Knowledge Check',
      ];

      for (let li = 0; li < lessonTitles.length; li++) {
        const existingLesson = await prisma.lesson.findFirst({
          where: { moduleId: mod.id, title: lessonTitles[li] },
        });
        if (!existingLesson) {
          await prisma.lesson.create({
            data: {
              moduleId: mod.id,
              title: lessonTitles[li],
              type: LessonType.TEXT,
              content: `[Content coming soon. This lesson will cover ${moduleTitle} in detail.]`,
              isPublished: true,
              durationMinutes: 10,
              sortOrder: li + 1,
            },
          });
        }
      }
    }
  }

  console.log('Courses, modules, and lessons seeded.');

  // ── Events ─────────────────────────────────────────────────────────────────
  const eventDefs = [
    {
      name: 'Log Press',
      slug: 'log-press',
      category: 'Press Events',
      description: 'The Log Press is one of the most iconic events in Strongman. A large cylindrical log is cleaned from the floor and pressed overhead. It demands exceptional upper body strength, trunk stability, and technical proficiency.',
      technicalNotes: 'The log must be cleaned to the chest before being pressed overhead. The athlete must show control at the top with arms locked out and feet stationary. A down signal is given by the judge once the press is complete.',
      coachingNotes: 'Key coaching points: keep the log close to the body during the clean, drive through the heels on the press, and brace the core throughout. Teach the continental clean progressively. Common faults include dipping the elbows and pressing early before the clean is settled.',
      judgingCriteria: 'The press is valid when: the log is fully cleaned to chest level, the press is completed with arms locked, and the athlete is stationary at the top. Red lights are given for press-out, stepping during the lift, or dropping the log.',
      programmingNotes: 'Programme log press in a similar fashion to overhead press. Use axle and barbell press as supplementary work. Build clean mechanics separately. Cycle 5-8 week strength blocks with a competition simulation week.',
      commonErrors: 'Pressing before the clean is settled; soft elbows at lockout; bouncing the log on the chest; losing trunk position under fatigue.',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Axle Press',
      slug: 'axle-press',
      category: 'Press Events',
      description: 'The Axle Press uses a thick-bar (approximately 50mm diameter) which eliminates the use of a barbell\'s rotation, making the clean and press significantly more demanding on grip and wrist stability.',
      technicalNotes: 'The axle can be cleaned from the floor (continental clean) or taken from a rack. Pressing styles include strict, push press, or jerk depending on competition rules. Check competition rules for allowed technique.',
      coachingNotes: 'Develop wrist strength and flexibility as a priority. Teach the continental clean in isolation before combining with the press. The grip challenge means athletes need more specific preparation than standard barbell pressing.',
      judgingCriteria: 'Rules are similar to log press but vary by competition. Typically: axle cleaned or taken from racks, press completed with arms locked, athlete stationary. Confirm specific rules for each competition.',
      programmingNotes: 'Include regular axle work if competitions specify it. Can be used interchangeably with log in training for variety. Accessory work: wrist curls, thick bar deadlifts, fat gripz training.',
      commonErrors: 'Wrist collapse during clean; pressing before body is stable; inconsistent grip width.',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Deadlift',
      slug: 'deadlift',
      category: 'Deadlift Events',
      description: 'The Strongman Deadlift tests maximum pulling strength. Implements vary from barbell to elephant bar, frame, car deadlift, or deadlift with chains. The standard Strongman deadlift uses a 2m+ elephant bar with significant bar flex.',
      technicalNotes: 'Athletes must lift the bar from the floor until standing erect with knees and hips fully extended. The bar may be hiked (hitched) in Strongman competition. Mixed or double overhand grip. No straps unless permitted by competition rules.',
      coachingNotes: 'Key coaching priorities: hip hinge mechanics, brace, and full lockout. Coach hitching technique where permitted. Sumo vs conventional stance — advise based on individual anatomy. Grip is a major limiting factor; programme grip work systematically.',
      judgingCriteria: 'A valid lift requires: bar lifted from the floor, knees locked, hips fully extended, body erect, shoulders back. The referee gives a down signal. Causes of red light: not reaching full extension, excessive hitching where not permitted, dropping the bar.',
      programmingNotes: 'Cycle through max effort and repetition deadlift work. Use Romanian deadlifts, rack pulls, and deficit deadlifts as accessories. Taper to competition — avoid heavy deadlift within 5-7 days of competition day.',
      commonErrors: 'Rounding the upper back; not completing lockout; grip failure under load; rushing the set-up.',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: "Farmer's Walk",
      slug: 'farmers-walk',
      category: 'Carry Events',
      description: "Farmer's Walk is a loaded carry event where athletes pick up two heavy implements (one in each hand) and carry them for distance or time as fast as possible. It demands grip, core stability, and total body conditioning.",
      technicalNotes: 'Implements are set to hip width. The athlete picks up both handles simultaneously (or one at a time by competition rule), stands tall, and carries to the finish. Dropping and re-picking is allowed in most competitions but costs time.',
      coachingNotes: 'Coach: rapid lockout from the pick, fast short stride turnover, keep the handles high (don\'t let them drag down arms), brace hard throughout. Teach drop and re-pick technique. Conditioning is as important as raw strength for longer distances.',
      judgingCriteria: 'Athlete must cross the finish line with implements in hand. Dragging or crawling is not valid. Specific re-pick rules vary by event — coaches should confirm per competition.',
      programmingNotes: 'Programme farmer\'s walk separately from deadlift days. Use short, heavy sets for strength; longer distance carries for conditioning. Trap bar carries are an effective substitute. Build grip work year-round.',
      commonErrors: 'Slow pick; looking down; allowing the handles to pull shoulders forward; poor re-pick mechanics.',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Yoke Walk',
      slug: 'yoke-walk',
      category: 'Carry Events',
      description: 'The Yoke Walk involves carrying a large steel frame (yoke) loaded with weight across the shoulders for a set distance. It is one of the most effective events for building total body strength and mental toughness.',
      technicalNotes: 'The yoke sits across the upper back similar to a high bar squat position. Athletes must walk a defined course without dropping the yoke. Dropping the yoke results in a no-lift or significant time penalty depending on competition rules.',
      coachingNotes: 'Key coaching points: brace hard, keep steps short and quick, find the balance point of the yoke before moving. Common error is taking long strides which causes the yoke to swing. Teach yoke-specific bracing and movement patterns separately from squatting.',
      judgingCriteria: 'The yoke must be carried from start to finish without stepping outside the lane or dropping (rules vary). The frame must not be dropped. Time is recorded when the athlete crosses the finish line or the front of the yoke passes.',
      programmingNotes: 'Heavy squatting provides a good carryover. Yoke-specific work should be included in programming if the event appears in competitions. Start with manageable weights and build speed before adding load.',
      commonErrors: 'Slow stride turnover; dropping at the pick; yoke swinging; running rather than walking controlled steps.',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Atlas Stones',
      slug: 'atlas-stones',
      category: 'Loading Events',
      description: 'Atlas Stones are spherical stones of increasing weight that athletes must lift and load onto platforms or over bars. The signature finish to most Strongman competitions, requiring total body power and technique.',
      technicalNotes: 'The athlete deadlifts the stone to lap position, then extends the body to place or load the stone onto the platform. Tacky (rosin) is typically permitted on the stones and forearms. Weight and platform heights vary by competition.',
      coachingNotes: 'Teach the stone-to-lap movement thoroughly before adding load. Key points: back flat to parallel on the initial pull, arms wrap under the stone, stand tall to lap. Extension to platform requires hip drive and shoulder shrug. Tacky application should be practised before competition.',
      judgingCriteria: 'The stone must be placed clearly on the platform. The stone must not be rolled or bounced onto the platform. Time is taken when the last stone is loaded or the final stone is clearly on the platform.',
      programmingNotes: 'Stone training should be included regularly for those competing in loading events. Supplementary exercises: Jefferson curls, heavy Romanian deadlifts, zercher carries. Block pulls build the initial pick. Sandbag loading is an accessible alternative.',
      commonErrors: 'Pulling with the arms before the hips; not getting enough lap height; poor tacky application; rushing the load causing the stone to roll off.',
      isPublished: true,
      isLaunchPriority: true,
    },
  ];

  for (const eventDef of eventDefs) {
    await prisma.event.upsert({
      where: { slug: eventDef.slug },
      update: {},
      create: eventDef,
    });
  }
  console.log('Events seeded.');

  // ── Exercises ──────────────────────────────────────────────────────────────
  const exerciseDefs = [
    {
      name: 'Log Press',
      slug: 'exercise-log-press',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Pressing a large cylindrical log overhead following a clean. A foundational Strongman pressing exercise.',
      coachingCues: 'Clean the log to chest; settle your position; drive through the heels; lock out fully overhead.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Strongman log',
      musclesWorked: 'Shoulders, triceps, upper chest, core',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Log Clean',
      slug: 'log-clean',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Cleaning the log from floor to chest position using the continental clean technique.',
      coachingCues: 'Hinge to the log; pull it into the lap; re-grip; drive with the hips to the chest.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Strongman log',
      musclesWorked: 'Posterior chain, core, arms',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Axle Press',
      slug: 'exercise-axle-press',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Overhead pressing with a thick-bar axle, building grip and wrist strength alongside pressing power.',
      coachingCues: 'Maintain wrist alignment; brace the core; drive bar in a straight line; lock out completely.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Axle bar (50mm diameter)',
      musclesWorked: 'Shoulders, triceps, core, forearms',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Conventional Deadlift',
      slug: 'conventional-deadlift',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'The conventional deadlift from the floor with a barbell. Foundation of pulling strength for all Strongman athletes.',
      coachingCues: 'Hip hinge to the bar; brace hard; push the floor away; lock out hips and knees; control the descent.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell, plates',
      musclesWorked: 'Posterior chain, quadriceps, core, forearms',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Romanian Deadlift',
      slug: 'romanian-deadlift',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'A hip hinge movement from standing, lowering the bar while maintaining slight knee bend and a flat back. Key accessory for posterior chain development.',
      coachingCues: 'Hinge at the hip; push hips back; feel a hamstring stretch; keep bar close to legs; stand tall.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell or dumbbells',
      musclesWorked: 'Hamstrings, glutes, lower back',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Hip Hinge Drill',
      slug: 'hip-hinge-drill',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'A teaching drill using a dowel rod or wall to develop the hip hinge pattern. Essential for coaching new athletes.',
      coachingCues: 'Three points of contact (head, upper back, sacrum); push hips back to the wall; maintain neutral spine.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Dowel rod or broomstick (optional)',
      musclesWorked: 'Hamstrings, glutes, core',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: "Farmer's Walk",
      slug: 'exercise-farmers-walk',
      category: 'Carry',
      difficulty: Difficulty.INTERMEDIATE,
      description: "Carrying two loaded implements at arm's length for distance or time. Develops grip, core stability, and conditioning simultaneously.",
      coachingCues: "Pick up fast; stand tall; short quick steps; don't let the implements pull you forward.",
      isCompetitionEvent: true,
      equipmentNeeded: "Farmer's walk handles or dumbbells/kettlebells",
      musclesWorked: 'Full body — grip, traps, core, legs',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Yoke Walk',
      slug: 'exercise-yoke-walk',
      category: 'Carry',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Carrying a heavy yoke frame across the upper back for distance. Develops total body stability and competitive carry technique.',
      coachingCues: 'Find your balance point; brace hard; short controlled steps; keep eyes forward.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Yoke frame',
      musclesWorked: 'Full body — upper back, core, legs',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Atlas Stone to Lap',
      slug: 'atlas-stone-to-lap',
      category: 'Loading',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'The first phase of atlas stone lifting — picking the stone from the floor to lap position. A fundamental skill requiring technique and back strength.',
      coachingCues: 'Back flat to parallel; arms wrap under the stone; use the legs to drive; roll the stone up the thighs to the lap.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Atlas stone',
      musclesWorked: 'Back, biceps, core, legs',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Atlas Stone to Platform',
      slug: 'atlas-stone-to-platform',
      category: 'Loading',
      difficulty: Difficulty.ADVANCED,
      description: 'The complete atlas stone loading movement from floor to platform. Combines the stone-to-lap with extension and placement.',
      coachingCues: 'Stone to lap first; stand tall; drive hips; extend and shrug the stone onto the platform.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Atlas stone, loading platform',
      musclesWorked: 'Full posterior chain, arms, core',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Sandbag Carry',
      slug: 'sandbag-carry',
      category: 'Carry',
      difficulty: Difficulty.BEGINNER,
      description: 'Carrying a heavy sandbag for distance or time. An accessible and effective carry variation that builds core stability and conditioning.',
      coachingCues: 'Hug the bag tight; keep it high on the chest; brace hard; maintain upright posture.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Sandbag',
      musclesWorked: 'Core, upper back, legs, arms',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Plank',
      slug: 'plank',
      category: 'Accessories',
      difficulty: Difficulty.BEGINNER,
      description: 'Foundational core stability exercise. Essential for Strongman athletes to develop the bracing ability required across all events.',
      coachingCues: 'Neutral spine; squeeze glutes and abs; breathe; do not let hips sag or rise.',
      isCompetitionEvent: false,
      equipmentNeeded: 'None',
      musclesWorked: 'Core — transverse abdominis, rectus abdominis, obliques, glutes',
      isPublished: true,
      isLaunchPriority: true,
    },
  ];

  for (const exDef of exerciseDefs) {
    await prisma.exercise.upsert({
      where: { slug: exDef.slug },
      update: {},
      create: exDef,
    });
  }
  console.log('Exercises seeded.');

  // ── Knowledge Articles ─────────────────────────────────────────────────────
  const articleDefs = [
    {
      title: 'Log Press: Technique Breakdown and Coaching Guide',
      slug: 'log-press-technique-breakdown',
      category: 'Event Technique',
      summary: 'A comprehensive breakdown of the log press from clean to lockout, with coaching cues, common faults, and corrections.',
      content: 'The log press is the signature overhead event in Strongman. This article covers the continental clean technique, press mechanics, coaching cues for athletes at all levels, and the most common errors coaches should watch for and correct.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 8,
    },
    {
      title: 'Strongman Safety: Screening and Risk Management for Coaches',
      slug: 'strongman-safety-screening',
      category: 'Safe Practice',
      summary: 'How to screen new athletes, identify risk factors, and manage safety in Strongman training environments.',
      content: 'Safety is the first responsibility of every Strongman coach. This article covers pre-training health screening, identifying contraindications, environmental safety checks, equipment inspection, and the coach\'s duty of care.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 10,
    },
    {
      title: 'Introduction to Programming for Beginner Strongman Athletes',
      slug: 'programming-beginner-strongman',
      category: 'Programming',
      summary: 'A practical guide to structuring training for athletes new to Strongman, covering frequency, volume, and event selection.',
      content: 'Programming for beginner Strongman athletes requires a balance of strength development and event skill acquisition. This article introduces session structure, weekly frequency recommendations, rep and set schemes, and how to build confidence with competition events.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 12,
    },
    {
      title: 'Competition Day Preparation: A Coach\'s Checklist',
      slug: 'competition-day-preparation',
      category: 'Competition Preparation',
      summary: 'Everything a coach needs to prepare their athlete for competition day — from weigh-in to the final event.',
      content: 'Competition day is the culmination of months of preparation. This guide covers athlete preparation in the week before, the day-of routine, warm-up strategy, managing nerves, event-specific activation, nutrition and hydration timing, and how to coach effectively on the day without overloading your athlete.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 15,
    },
    {
      title: 'Understanding Periodisation for Strongman',
      slug: 'periodisation-strongman',
      category: 'Programming',
      summary: 'An accessible introduction to periodisation models and how to apply them to Strongman training cycles.',
      content: 'Periodisation is the systematic organisation of training over time to peak performance for competition. This article introduces linear, undulating, and block periodisation models and discusses how to adapt them for the unique demands of Strongman — including managing multiple event types within a single training cycle.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 14,
    },
    {
      title: 'Atlas Stones: Teaching the Lift from Zero',
      slug: 'atlas-stones-teaching-guide',
      category: 'Event Technique',
      summary: 'Step-by-step guide to teaching the atlas stone from absolute beginner through to competition-ready technique.',
      content: 'The atlas stone is often seen as intimidating for new athletes. This guide breaks the movement into teachable phases: the hip hinge approach, wrapping the arms, stone-to-lap, and extension to the platform. Includes progressions, regression exercises, and tacky application guidance.',
      authorName: 'Educate.Strong Team',
      isPublished: true,
      accessLevel: 'FREE' as const,
      readMinutes: 11,
    },
  ];

  for (const artDef of articleDefs) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: artDef.slug },
      update: {},
      create: artDef,
    });
  }
  console.log('Knowledge articles seeded.');

  // ── Content Relationships ──────────────────────────────────────────────────
  // Get IDs for relationships
  const logPressEvent = await prisma.event.findUnique({ where: { slug: 'log-press' } });
  const axlePressEvent = await prisma.event.findUnique({ where: { slug: 'axle-press' } });
  const deadliftEvent = await prisma.event.findUnique({ where: { slug: 'deadlift' } });
  const farmersEvent = await prisma.event.findUnique({ where: { slug: 'farmers-walk' } });
  const atlasEvent = await prisma.event.findUnique({ where: { slug: 'atlas-stones' } });

  const logPressExercise = await prisma.exercise.findUnique({ where: { slug: 'exercise-log-press' } });
  const logCleanExercise = await prisma.exercise.findUnique({ where: { slug: 'log-clean' } });
  const deadliftExercise = await prisma.exercise.findUnique({ where: { slug: 'conventional-deadlift' } });
  const farmersExercise = await prisma.exercise.findUnique({ where: { slug: 'exercise-farmers-walk' } });
  const atlasLapExercise = await prisma.exercise.findUnique({ where: { slug: 'atlas-stone-to-lap' } });
  const atlasPlatformExercise = await prisma.exercise.findUnique({ where: { slug: 'atlas-stone-to-platform' } });

  const l1Course = await prisma.course.findUnique({ where: { slug: 'level-1-coaching-strongman' } });

  const relationships = [
    { sourceType: ContentType.EXERCISE, sourceId: logPressExercise!.id, targetType: ContentType.EVENT, targetId: logPressEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 1 },
    { sourceType: ContentType.EXERCISE, sourceId: logCleanExercise!.id, targetType: ContentType.EVENT, targetId: logPressEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 2 },
    { sourceType: ContentType.EXERCISE, sourceId: deadliftExercise!.id, targetType: ContentType.EVENT, targetId: deadliftEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 1 },
    { sourceType: ContentType.EXERCISE, sourceId: farmersExercise!.id, targetType: ContentType.EVENT, targetId: farmersEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 1 },
    { sourceType: ContentType.EXERCISE, sourceId: atlasLapExercise!.id, targetType: ContentType.EVENT, targetId: atlasEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 1 },
    { sourceType: ContentType.EXERCISE, sourceId: atlasPlatformExercise!.id, targetType: ContentType.EVENT, targetId: atlasEvent!.id, relationshipType: 'trains_for', displayLabel: 'Competition Event', priority: 1 },
    { sourceType: ContentType.EVENT, sourceId: logPressEvent!.id, targetType: ContentType.COURSE, targetId: l1Course!.id, relationshipType: 'covered_in', displayLabel: 'Learn to coach this', priority: 1 },
    { sourceType: ContentType.EVENT, sourceId: axlePressEvent!.id, targetType: ContentType.COURSE, targetId: l1Course!.id, relationshipType: 'covered_in', displayLabel: 'Learn to coach this', priority: 1 },
  ];

  for (const rel of relationships) {
    await prisma.contentRelationship.create({ data: rel });
  }
  console.log('Content relationships seeded.');

  // ── Recommendation Prompts ─────────────────────────────────────────────────
  // Find the 5th module (Nutrition - "Nutrition Fundamentals for Coaches") in Level 2
  const l2Course = await prisma.course.findUnique({ where: { slug: 'level-2-coaching-strongman' } });
  const nutritionModule = await prisma.module.findFirst({
    where: { courseId: l2Course!.id, title: 'Nutrition Fundamentals for Coaches' },
    include: { lessons: { orderBy: { sortOrder: 'asc' }, take: 1 } },
  });

  const nutritionArticle = await prisma.knowledgeArticle.findUnique({ where: { slug: 'programming-beginner-strongman' } });
  const competitionArticle = await prisma.knowledgeArticle.findUnique({ where: { slug: 'competition-day-preparation' } });
  const logPressTechArticle = await prisma.knowledgeArticle.findUnique({ where: { slug: 'log-press-technique-breakdown' } });

  // Module 3 of Level 1 (Events module) — get first lesson
  const l1EventsModule = await prisma.module.findFirst({
    where: { courseId: l1Course!.id, title: 'Strongman Events — The Core Six' },
    include: { lessons: { orderBy: { sortOrder: 'asc' }, take: 1 } },
  });

  // Module 7 of Level 1 (Competition Awareness) — get first lesson
  const l1CompModule = await prisma.module.findFirst({
    where: { courseId: l1Course!.id, title: 'Competition Awareness' },
    include: { lessons: { orderBy: { sortOrder: 'asc' }, take: 1 } },
  });

  // Module 6 of Level 1 (Programming) — first lesson
  const l1ProgModule = await prisma.module.findFirst({
    where: { courseId: l1Course!.id, title: 'Introduction to Programming' },
    include: { lessons: { orderBy: { sortOrder: 'asc' }, take: 1 } },
  });

  const recommendationDefs = [
    {
      lessonId: nutritionModule?.lessons[0]?.id ?? null,
      promptLabel: 'Want to learn more?',
      ctaText: 'Explore Programming Basics in the Knowledge Hub',
      targetType: ContentType.KB_ARTICLE,
      targetId: nutritionArticle?.id ?? null,
      position: 'end_of_lesson',
      isActive: true,
    },
    {
      lessonId: l1EventsModule?.lessons[0]?.id ?? null,
      promptLabel: 'Explore the Event Library',
      ctaText: 'See coaching notes for the Log Press',
      targetType: ContentType.EVENT,
      targetId: logPressEvent?.id ?? null,
      position: 'end_of_lesson',
      isActive: true,
    },
    {
      lessonId: l1CompModule?.lessons[0]?.id ?? null,
      promptLabel: 'Competition preparation resources',
      ctaText: 'Read: Competition Day Preparation — Coach\'s Checklist',
      targetType: ContentType.KB_ARTICLE,
      targetId: competitionArticle?.id ?? null,
      position: 'end_of_lesson',
      isActive: true,
    },
    {
      lessonId: l1ProgModule?.lessons[0]?.id ?? null,
      promptLabel: 'Deepen your knowledge',
      ctaText: 'Read: Introduction to Programming for Beginners',
      targetType: ContentType.KB_ARTICLE,
      targetId: nutritionArticle?.id ?? null,
      position: 'end_of_lesson',
      isActive: true,
    },
  ];

  for (const rec of recommendationDefs) {
    await prisma.recommendationPrompt.create({ data: rec });
  }
  console.log('Recommendation prompts seeded.');

  // ── Be Strong Articles ─────────────────────────────────────────────────────
  const SCOPE_NOTE = 'This article provides general nutritional information for educational purposes. It does not constitute personalised dietary advice. Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support.';

  const beStrongArticles = [
    // BASICS
    {
      title: 'Energy Balance for Strongman Athletes',
      slug: 'energy-balance-strongman',
      category: BeStrongCategory.BASICS,
      summary: 'Why calories matter for strength sport, and how chronic underfuelling sabotages training and recovery.',
      content: 'Strongman athletes have some of the highest energy demands of any strength sport. This article covers the fundamentals of energy balance — what it means, why it matters, and how coaches can identify signs of energy deficiency in their athletes without crossing into nutrition prescription.\n\nKey points:\n• Total energy expenditure in Strongman is significantly higher than general population estimates\n• Chronic energy deficiency impairs recovery, reduces training quality, and increases injury risk\n• Signs a coach might observe: persistent fatigue, stalled progress, irritability, frequent illness\n• The coach\'s role: identify and refer — not prescribe',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 8,
      sortOrder: 1,
    },
    {
      title: 'Protein for Strength Athletes: What Coaches Need to Know',
      slug: 'protein-strength-athletes-coaches',
      category: BeStrongCategory.BASICS,
      summary: 'The role of protein in muscle protein synthesis, general intake guidance, and timing basics.',
      content: 'Protein is the most discussed macronutrient in strength sport. This article covers what coaches need to understand — at a level that supports athlete conversations without crossing into individualised dietary prescription.\n\nKey points:\n• Muscle protein synthesis requires adequate protein distributed across the day\n• General ranges for strength athletes: 1.6–2.2g per kg bodyweight (current consensus)\n• Timing: protein around training is beneficial but total daily intake matters most\n• Food sources vs supplements: both can contribute; whole food sources first\n• Coaches should refer to a registered dietitian for individualised protein targets',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 10,
      sortOrder: 2,
    },
    {
      title: 'Carbohydrates and Strongman Performance',
      slug: 'carbohydrates-strongman-performance',
      category: BeStrongCategory.BASICS,
      summary: 'Why carbohydrates are essential for high-intensity strength events, and how to discuss them with athletes.',
      content: 'Despite misconceptions in some strength communities, carbohydrates are a critical fuel source for Strongman events. This article covers the basics coaches need to support athlete education.\n\nKey points:\n• High-intensity events like atlas stones, log press, and truck pulls are fuelled primarily by glycolytic (carbohydrate-dependent) pathways\n• Carbohydrate availability affects training quality, recovery between sessions, and competition performance\n• Low-carbohydrate approaches may be appropriate for some athletes in some contexts — but coaches should not make individualised recommendations\n• Practical signpost: if an athlete is consistently fatigued in later events during training, carbohydrate availability is one factor worth exploring with a nutrition professional',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: false,
      readMinutes: 9,
      sortOrder: 3,
    },
    // COMPETITION
    {
      title: 'Competition Day Nutrition: A Practical Guide',
      slug: 'competition-day-nutrition-guide',
      category: BeStrongCategory.COMPETITION,
      summary: 'What to eat before, between, and after events on competition day — practical guidance coaches can share.',
      content: 'Competition day nutrition is one of the highest-impact areas where coaches can support athlete performance. This guide covers practical strategies within coach scope of practice.\n\nPre-competition (2–4 hours before):\n• A carbohydrate-rich meal with moderate protein and low fat/fibre reduces GI discomfort risk\n• Examples: pasta, rice, oats with protein source — well-practiced in training, not tried for the first time on competition day\n\nBetween events (30–90 minute windows):\n• Small carbohydrate-rich snacks: banana, rice cakes, sports drinks if tolerated\n• Hydration: sip consistently rather than drinking large volumes\n• Avoid high fat, high fibre, or novel foods\n\nPost-competition:\n• Protein + carbohydrate meal within 2 hours\n• Prioritise rehydration\n\nCoach role: remind athletes of their own pre-agreed competition day plan; do not create one for them without nutrition professional input.',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 12,
      sortOrder: 1,
    },
    {
      title: 'Managing Long Competition Days',
      slug: 'managing-long-competition-days',
      category: BeStrongCategory.COMPETITION,
      summary: 'Strategies for maintaining energy and focus across a full day of Strongman competition.',
      content: 'A Strongman competition can span 6–10 hours with multiple events. Maintaining fuelling and hydration across this window is a skill in itself.\n\nKey principles:\n• Start the day well-fuelled — do not arrive in a fasted state\n• Treat between-event windows as refuelling opportunities\n• Mental fatigue as the day progresses is partly nutritional — carbohydrate availability affects cognitive function\n• Heat: outdoor competitions dramatically increase fluid and electrolyte needs\n\nCoaching considerations:\n• Help athletes develop and practice their competition day nutrition routine in training\n• Remind athletes of their plan; do not override it under competition pressure\n• Know the signs of energy depletion vs normal competition fatigue',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'ENROLLED' as const,
      isPublished: true,
      isFeatured: false,
      readMinutes: 10,
      sortOrder: 2,
    },
    // RECOVERY
    {
      title: 'Post-Training Nutrition for Strongman Recovery',
      slug: 'post-training-nutrition-strongman',
      category: BeStrongCategory.RECOVERY,
      summary: 'The nutritional strategies that support recovery, adaptation, and readiness for the next session.',
      content: 'Recovery nutrition is one of the most actionable areas where general guidance can make a meaningful difference. This article covers the principles coaches can share with athletes.\n\nThe recovery window:\n• There is no magic 30-minute window — but consuming protein and carbohydrate within 1–2 hours of training is a practical target\n• Protein triggers muscle protein synthesis; carbohydrate restores glycogen and supports hormonal environment for recovery\n\nPractical guidance:\n• A mixed meal with protein and carbohydrate within 2 hours of training is sufficient for most athletes\n• Athletes who train multiple times per day may benefit from faster post-session refuelling\n• Sleep is the most important recovery period — nutrition quality in the hours before sleep matters\n\nScope note: coaches can discuss general recovery nutrition principles; they should not prescribe specific quantities without nutrition professional involvement.',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 9,
      sortOrder: 1,
    },
    // MAKING WEIGHT
    {
      title: 'Weight Categories in Strongman: A Coach\'s Awareness Guide',
      slug: 'weight-categories-coaches-awareness',
      category: BeStrongCategory.MAKING_WEIGHT,
      summary: 'What coaches need to know about weight classes, the risks of extreme weight cutting, and when to refer.',
      content: 'Weight categories exist across most Strongman federations. Coaches need to understand this landscape — and its risks — without crossing into nutrition prescription.\n\nWhat coaches should know:\n• Weight classes vary by federation — verify current class structures with the relevant governing body\n• "Making weight" practices range from benign (dietary adjustment weeks before) to dangerous (dehydration and extreme restriction close to weigh-in)\n• Extreme weight cutting carries serious health risks and impairs competition performance\n\nRed flags a coach should recognise:\n• Athlete discussing dehydration protocols (water cutting)\n• Dramatic calorie restriction in the week before competition\n• Signs of disordered eating: excessive preoccupation with food, distorted body image, secretive eating patterns\n\nCoach role:\n• Encourage athletes to compete in their natural weight class where possible\n• Do not endorse or assist with extreme weight cutting\n• Refer athletes to a sports dietitian for any weight management plan\n• If concerned about eating behaviours, refer to appropriate support services',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 11,
      sortOrder: 1,
    },
    // HYDRATION
    {
      title: 'Hydration for Strongman Training and Competition',
      slug: 'hydration-strongman-training-competition',
      category: BeStrongCategory.HYDRATION,
      summary: 'Daily hydration principles, competition-day fluid management, and recognising dehydration.',
      content: 'Hydration is one of the most underestimated performance factors in Strongman. This article covers the basics coaches can discuss with athletes.\n\nGeneral principles:\n• Even mild dehydration (1–2% body mass) can impair strength output and cognitive function\n• Urine colour is a simple monitoring tool: pale yellow is the target; dark amber indicates dehydration\n• Thirst is a lagging indicator — encourage athletes to drink consistently through the day, not just when thirsty\n\nTraining sessions:\n• Drink before, during, and after training\n• For sessions over 90 minutes, electrolyte intake becomes relevant — particularly sodium\n\nCompetition days:\n• Arrive well-hydrated\n• Sip consistently between events — do not consume large volumes rapidly\n• Outdoor competitions in warm weather: increase fluid intake and monitor for heat illness signs\n\nHeat illness recognition (for coaches):\n• Heavy sweating, pale/clammy skin: heat exhaustion — rest, shade, cool fluids\n• Hot/dry skin, confusion, no sweating: heat stroke — emergency services required immediately',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 10,
      sortOrder: 1,
    },
    // SUPPLEMENTS
    {
      title: 'Supplements for Strongman: Evidence and Scope of Practice',
      slug: 'supplements-strongman-evidence-scope',
      category: BeStrongCategory.SUPPLEMENTS,
      summary: 'A review of commonly discussed supplements in Strongman — what the evidence says, and what coaches should and should not advise.',
      content: 'Supplement use is widespread in Strongman. Coaches will regularly be asked about supplements. This article provides the awareness needed to respond professionally.\n\nIMPORTANT: Coaches are not qualified to recommend specific supplement protocols. The information below is for educational awareness only.\n\nSupplements with reasonable evidence for strength/power sport:\n• Creatine monohydrate: well-researched, generally regarded as safe, may improve high-intensity performance\n• Caffeine: well-evidenced for performance, timing and dose matter, individual tolerance varies\n• Beta-alanine: some evidence for buffering fatigue in high-rep efforts, causes harmless tingling in many users\n\nSupplements requiring caution:\n• Pre-workout blends: ingredient lists are often unclear; contamination risk varies by manufacturer\n• Protein powders: quality varies; batch-tested products reduce contamination risk for tested athletes\n• Any supplement making dramatic performance claims\n\nCoach responsibilities:\n• Do not recommend specific supplements or doses\n• Direct athletes who compete in tested federations to Informed Sport or Informed Choice for batch-tested products\n• Refer all supplement decisions to a qualified sports dietitian',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 13,
      sortOrder: 1,
    },
    // COACHES GUIDE
    {
      title: 'How to Have Nutrition Conversations with Athletes',
      slug: 'nutrition-conversations-with-athletes',
      category: BeStrongCategory.COACHES_GUIDE,
      summary: 'A practical guide for coaches on discussing nutrition effectively without crossing professional boundaries.',
      content: 'Nutrition conversations happen in every coaching relationship. Handled well, they support athlete development. Handled poorly, they create liability and can cause harm. This guide helps coaches navigate them professionally.\n\nWhat coaches CAN do:\n• Share general evidence-based information (energy balance, protein importance, hydration, competition day fuelling)\n• Signpost athletes to qualified nutrition professionals\n• Notice and respond to red flags (extreme restriction, disordered eating behaviours, dangerous weight cutting)\n• Refer athletes to registered dietitians or registered nutritionists for personalised advice\n• Discuss Be Strong resources as educational starting points\n\nWhat coaches should NOT do:\n• Prescribe calorie targets, macronutrient splits, or specific meal plans\n• Recommend supplement doses\n• Provide medical nutrition therapy (managing eating disorders, medical conditions)\n• Provide weight loss or weight gain prescriptions\n\nPhrasing that stays in scope:\n• "There\'s a great resource on competition nutrition in Be Strong — I\'d recommend having a look."\n• "It might be worth speaking to a sports dietitian about your nutrition leading into this competition."\n• "I\'ve noticed you\'ve mentioned skipping meals a lot — how are you feeling in training?"\n\nPhrasing that crosses the line:\n• "You should eat X calories a day."\n• "Take this supplement — it\'ll help your performance."\n• "You need to cut 3kg before weigh-in — here\'s how."',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: null,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: true,
      readMinutes: 12,
      sortOrder: 1,
    },
    // YOUTH
    {
      title: 'Nutrition for Young Strongman Athletes',
      slug: 'nutrition-young-strongman-athletes',
      category: BeStrongCategory.YOUTH_NUTRITION,
      summary: 'Age-appropriate nutritional guidance for StrongKidz coaches supporting young participants.',
      content: 'Young athletes have different nutritional needs from adults. StrongKidz coaches should be aware of these differences — and the particularly important scope-of-practice boundaries that apply when working with children.\n\nKey differences in youth nutrition:\n• Children and adolescents in growth phases have elevated protein and energy needs relative to body mass\n• Growth spurts increase overall nutritional requirements\n• Restrictive diets during development can impair growth and long-term health\n• Young athletes are particularly vulnerable to the consequences of energy deficiency\n\nFor StrongKidz coaches:\n• Never comment on a child\'s weight or body composition\n• Do not discuss specific foods, diets, or eating patterns with children\n• If you observe signs of inadequate nutrition (excessive fatigue, fainting, declining performance), raise this with the parent or guardian — not directly with the child\n• Parents and guardians are the appropriate referral point; signpost them to their GP or a paediatric dietitian if concerned\n\nPositive messaging:\n• "Strong athletes eat well to train well."\n• "Fuel your training — your body needs food to do what you\'re asking it to do."\n• Normalise eating — avoid any language that stigmatises food choices',
      authorName: 'Be Strong Editorial Team',
      reviewerName: 'Victoria Wilson',
      reviewerQualification: 'Strength and Conditioning Coach',
      lastReviewedAt: new Date('2026-01-01'),
      scopeOfPracticeNote: SCOPE_NOTE,
      accessLevel: 'FREE' as const,
      isPublished: true,
      isFeatured: false,
      readMinutes: 10,
      sortOrder: 1,
    },
  ];

  for (const article of beStrongArticles) {
    await prisma.beStrongArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log(`Be Strong articles seeded: ${beStrongArticles.length}`);

  // ── Be Strong Downloads ────────────────────────────────────────────────────
  const beStrongDownloads = [
    {
      title: 'Competition Day Nutrition Planner',
      slug: 'competition-day-nutrition-planner',
      description: 'A one-page planning template for athletes to map their competition day nutrition across morning, between events, and post-competition.',
      category: BeStrongCategory.DOWNLOADS,
      fileType: 'PDF',
      accessLevel: 'ENROLLED' as const,
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: 'Hydration Monitoring Log',
      slug: 'hydration-monitoring-log',
      description: 'A simple daily hydration tracking sheet — urine colour guide included.',
      category: BeStrongCategory.DOWNLOADS,
      fileType: 'PDF',
      accessLevel: 'FREE' as const,
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: 'Athlete Nutrition Conversation Guide for Coaches',
      slug: 'athlete-nutrition-conversation-guide',
      description: 'A reference card with in-scope and out-of-scope nutrition conversation examples for coaches.',
      category: BeStrongCategory.DOWNLOADS,
      fileType: 'PDF',
      accessLevel: 'FREE' as const,
      isPublished: true,
      sortOrder: 3,
    },
    {
      title: 'Supplement Checklist — Tested Athletes',
      slug: 'supplement-checklist-tested-athletes',
      description: 'A reference guide for coaches supporting athletes in tested federations, including batch-testing resource links.',
      category: BeStrongCategory.SUPPLEMENTS,
      fileType: 'PDF',
      accessLevel: 'FREE' as const,
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: 'Recovery Week Nutrition Template',
      slug: 'recovery-week-nutrition-template',
      description: 'A simple weekly nutrition planning framework for deload weeks and post-competition recovery periods.',
      category: BeStrongCategory.RECOVERY,
      fileType: 'PDF',
      accessLevel: 'ENROLLED' as const,
      isPublished: true,
      sortOrder: 1,
    },
  ];

  for (const download of beStrongDownloads) {
    await prisma.beStrongDownload.upsert({
      where: { slug: download.slug },
      update: {},
      create: download,
    });
  }
  console.log(`Be Strong downloads seeded: ${beStrongDownloads.length}`);

  // ── Be Strong recommendation prompts linked to course lessons ─────────────
  // Find the Level 1 nutrition module lesson and Level 2 nutrition module
  const l1NutritionLesson = await prisma.lesson.findFirst({
    where: { module: { title: { contains: 'Programming' } } },
  });
  const l2NutritionLesson = await prisma.lesson.findFirst({
    where: { module: { title: { contains: 'Nutrition' } } },
  });

  const bsNutritionArticle = await prisma.beStrongArticle.findUnique({
    where: { slug: 'competition-day-nutrition-guide' },
  });
  const bsBasicsArticle = await prisma.beStrongArticle.findUnique({
    where: { slug: 'energy-balance-strongman' },
  });

  const beStrongPrompts = [
    // L1 — subtle prompt on any lesson that might mention nutrition
    ...(l1NutritionLesson && bsBasicsArticle ? [{
      lessonId: l1NutritionLesson.id,
      triggerContext: 'nutrition mention in programming lesson',
      promptLabel: 'Want to learn more?',
      ctaText: 'Explore Be Strong — Nutrition Basics',
      targetType: ContentType.BE_STRONG_ARTICLE,
      targetId: bsBasicsArticle.id,
      targetUrl: '/be-strong/articles/energy-balance-strongman',
      position: 'end_of_lesson',
      isActive: true,
    }] : []),
    // L2 — deeper nutrition prompt
    ...(l2NutritionLesson && bsNutritionArticle ? [{
      lessonId: l2NutritionLesson.id,
      triggerContext: 'nutrition fundamentals module',
      promptLabel: 'Go deeper on this topic',
      ctaText: 'Explore Be Strong — Competition Nutrition',
      targetType: ContentType.BE_STRONG_ARTICLE,
      targetId: bsNutritionArticle.id,
      targetUrl: '/be-strong/articles/competition-day-nutrition-guide',
      position: 'end_of_lesson',
      isActive: true,
    }] : []),
  ];

  for (const prompt of beStrongPrompts) {
    await prisma.recommendationPrompt.create({ data: prompt });
  }
  console.log(`Be Strong recommendation prompts seeded: ${beStrongPrompts.length}`);

  console.log('\nSeed complete!');
  console.log('Admin login: admin@educate-strong.com / AdminPass123!');
  console.log('Learner login: coach@example.com / CoachPass123!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
