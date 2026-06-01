import { PrismaClient, Pathway, LessonType, ContentType, Difficulty } from '@prisma/client';
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
