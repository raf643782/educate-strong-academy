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
    {
      name: 'Frame Deadlift',
      slug: 'frame-deadlift',
      category: 'Deadlift Events',
      description: 'The frame deadlift uses a steel frame that the athlete stands inside, with large handles at the sides. It allows heavier loads than a standard barbell and develops grip and pulling power in a competition-specific position.',
      technicalNotes: 'The athlete positions themselves inside the frame with feet flat and handles at approximately hip height. The lift is initiated from the floor with a hip hinge pattern. Lockout requires knees straight, hips fully extended, and the athlete standing erect. Frame handle heights and widths vary by equipment — adjust start position accordingly.',
      coachingNotes: 'Key coaching points: set the brace before initiating, drive the floor away as in a conventional deadlift, and complete the lockout fully. The wider grip and open stance may require a modified hip position compared to conventional barbell deadlift. Grip is a significant limiting factor due to the wider handle position.',
      judgingCriteria: 'A valid lift requires the frame to be lifted from the floor, knees locked, hips fully extended, and the athlete standing erect with the frame handles held at sides. Rules vary by federation, promoter, and competition — confirm specific criteria before each event.',
      programmingNotes: 'Conventional deadlift strength transfers well to frame deadlift. Include frame-specific work in the final preparation block to adapt to the specific grip and stance width. Grip work (thick bar, static holds) is particularly important for this event.',
      commonErrors: 'Grip failure before lockout; not achieving full hip extension; starting position too close or too far from the frame handles.',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Sandbag to Platform',
      slug: 'sandbag-to-platform',
      category: 'Loading Events',
      description: 'Lifting a heavy sandbag from the floor and loading it onto a platform. A competition staple and accessible alternative to atlas stone loading, requiring similar technique and posterior chain strength.',
      technicalNotes: 'The sandbag is typically carried in a bear hug or over-the-shoulder position and loaded to a platform at a specified height. Pick-up technique varies — bear hug from the floor, or a two-stage pick (floor to knee, knee to shoulder or chest). Platform heights and sandbag weights vary by competition.',
      coachingNotes: 'Teach the bear hug pick-up first: hinge to the sandbag, arms wrap around, brace hard, drive with the legs. For the load, drive hips through and use a shrug motion to place the bag on the platform. The sandbag\'s deformable nature makes it more forgiving than atlas stones but also harder to control — emphasise a high, stable carry position before loading.',
      judgingCriteria: 'The sandbag must be placed clearly on top of the platform surface. Dragging or pushing the bag over the platform edge may or may not be permitted depending on competition rules. Rules vary by federation, promoter, and competition.',
      programmingNotes: 'Sandbag loading has direct carryover to atlas stone technique. Use as an accessible loading event training tool when atlas stones are unavailable. Supplementary work: Romanian deadlift, zercher carry, and heavy carries for posterior chain development.',
      commonErrors: 'Not achieving enough height on the pick; poor hip drive during the load; bag shifting during the carry causing instability.',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Keg Loading',
      slug: 'keg-loading',
      category: 'Loading Events',
      description: 'Loading one or more kegs onto a platform or over a bar. Kegs are unpredictable — their shifting internal weight makes them technically demanding even at moderate loads.',
      technicalNotes: 'Kegs are typically loaded in a series (loading medley format) or individually to a platform. The keg can be picked up in a bear hug or hugging approach similar to atlas stones. Due to the shifting internal weight, the athlete must adapt their grip and carry position dynamically. Some competitions specify loading a keg over a bar (keg toss style).',
      coachingNotes: 'Practise with actual kegs before competition — their behaviour under fatigue is quite different from rigid implements. Key coaching points: establish a stable carry position before moving, brace hard throughout, and avoid attempting to control the keg\'s movement aggressively — instead adapt to it.',
      judgingCriteria: 'The keg must be placed or loaded as specified by the event rules. Platform height, acceptable carry position, and completion criteria vary by competition. Rules vary by federation, promoter, and competition.',
      programmingNotes: 'Sandbag loading provides useful transfer to keg loading given the similarly unstable nature of both implements. Zercher carry and bear hug carries develop the specific positional strength required.',
      commonErrors: 'Trying to control the keg\'s movement too rigidly; insufficient hip drive during the load; poor pick-up position causing unstable carry.',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Arm-Over-Arm Rope Pull',
      slug: 'arm-over-arm-rope-pull',
      category: 'Pull Events',
      description: 'The athlete drags a heavy implement (sled, vehicle, or loaded rope system) hand-over-hand using a rope. A test of back strength, bicep endurance, grip, and core stability — either seated or standing depending on competition format.',
      technicalNotes: 'The athlete positions themselves with feet braced against an anchor surface. Rope is pulled hand-over-hand in a controlled rhythm. Elbows stay close to the body on the pull. Drive comes from the back and biceps, not a shoulder shrug. The implement must be pulled to the finish line or past a designated marker.',
      coachingNotes: 'Establish a consistent hand-over-hand rhythm early in the pull. Losing rhythm under fatigue costs significant time. Key coaching points: elbows in and close; pull from the back; keep the rope taut between pulls; breathe with each pull cycle. The seated version reduces lower back demand and is recommended for beginners.',
      judgingCriteria: 'The implement (sled or vehicle) must cross the finish marker or the athlete must reach the designated point on the rope. Specific distance, starting position, and seated vs standing format vary by competition. Rules vary by federation, promoter, and competition.',
      programmingNotes: 'Include as a pulling variation for back development and grip endurance. Works well as a conditioning finisher. Programme both seated and standing variations where competitions may specify either format. Sled drags provide a lower-load precursor.',
      commonErrors: 'Letting the rope go slack between pulls; pulling with hands too far from the body; relying on shoulder elevation rather than back and bicep drive; losing seated position.',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Vehicle Pull',
      slug: 'vehicle-pull',
      category: 'Pull Events',
      description: 'The athlete uses a harness and rope to drag a heavy vehicle (lorry, bus, car, or other) over a set distance. One of the most iconic Strongman events, testing maximum whole-body power output and anaerobic capacity.',
      technicalNotes: 'The harness sits across the upper chest. The athlete leans forward into the harness and drives with short, powerful steps to overcome the vehicle\'s inertia. Once the vehicle begins to move, transition to longer strides while maintaining forward lean. The rope is held loosely — drive force comes through the harness, not the arms. Vehicle weight, surface, and distance vary significantly by competition.',
      coachingNotes: 'The most common error is pausing once the vehicle begins to slow. Inertia must be maintained continuously — stopping costs more time than slowing. Key coaching points: drive through the floor; lean into the harness; arms relaxed; build momentum and maintain it.',
      judgingCriteria: 'The vehicle must cross the finish line or the athlete must cross the line with the vehicle in motion behind them. Specific criteria vary by competition. Rules vary by federation, promoter, and competition — setup, braking state, and distance are all competition-specific.',
      programmingNotes: 'Simulate with sled pulls until access to a vehicle pull event is available. Strength base: back squat, deadlift, and heavy sled drag provide the best carryover. Taper: avoid maximum vehicle pulls within 7–10 days of competition.',
      commonErrors: 'Pausing when the vehicle slows; over-relying on arms rather than leg drive; taking short, ineffective steps once initial momentum is established.',
      isPublished: true,
      isLaunchPriority: false,
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
    // ── Pressing ─────────────────────────────────────────────────────────────
    {
      name: 'Log Press',
      slug: 'exercise-log-press',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Pressing a large cylindrical log overhead following a continental clean. One of the signature overhead movements in Strongman, demanding upper body strength, trunk stability, and clean mechanics.',
      techniqueNotes: 'Clean the log from the floor using the continental clean technique. Once settled at the chest with a stable base, press overhead — strict, push press, or jerk depending on competition rules. Arms must lock out fully at the top. Feet must remain stationary throughout.',
      coachingCues: 'Clean the log to chest first.\nSettle your position before pressing.\nDrive through the heels.\nLock out fully overhead.\nHold for the judge\'s down signal.',
      commonMistakes: 'Pressing before the clean is fully settled.\nSoft elbows at lockout.\nBouncing the log off the chest without a controlled re-grip.\nLosing trunk stability under fatigue.',
      safetyNotes: 'Never press before the clean is fully stable. Ensure training partners are clear of the sides. Use collars on the log. Build continental clean mechanics progressively before adding heavy pressing load.',
      progressions: 'Barbell strict press → log press from rack → log clean from floor and press from rack → full log clean and press from floor.',
      regressions: 'Log clean from pins or rack → log press from rack with light implement → full log clean and press at lower load.',
      programmingNotes: 'Train log press 1–2x per week. Build strict press strength as a foundation before adding push press or jerk mechanics. Continental clean can be drilled separately. Taper: avoid heavy log work within 4–5 days of competition. Axle and barbell press serve as supplementary work.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Strongman log',
      musclesWorked: 'Shoulders (anterior and medial deltoid), triceps, upper chest, core, upper back',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Log Clean',
      slug: 'log-clean',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Cleaning the log from floor to chest position using the continental clean technique. A technical lift that is the foundation of the log press.',
      techniqueNotes: 'Hinge to the log, lats engaged. Pull the log into the lap using hip extension. Re-grip with hands rotating palm-up or false grip. Drive the log from lap to chest using hip extension and a powerful shrug. Receive the log at the chest with a stable stance.',
      coachingCues: 'Hinge and engage the lats.\nPull into lap using the legs — not the arms.\nRe-grip quickly.\nHip drive to chest.\nSettle before pressing.',
      commonMistakes: 'Using arms to initiate the pull from the floor rather than hip extension.\nRe-gripping too early before the hip drive.\nLosing back position when rising from the lap.\nReceiving the log with misaligned wrists.',
      safetyNotes: 'Avoid banging the log against shins on the pick. Ensure full control at the lap position before re-gripping. Clear the area before initiating.',
      progressions: 'Log deadlift → log to lap (hip drive) → continental clean without press → full log clean and press.',
      regressions: 'Simulate the continental clean pattern with a barbell with bumper plates on the floor → practise with a lighter log → build to full log clean.',
      programmingNotes: 'Drill the clean separately from the press. Technical practice at lower loads builds the movement pattern before adding load.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Strongman log',
      musclesWorked: 'Posterior chain, core, biceps, upper back',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Axle Press',
      slug: 'exercise-axle-press',
      category: 'Pressing',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Overhead pressing with a thick-bar axle (approximately 50mm diameter), eliminating bar rotation and significantly increasing the demand on grip and wrist stability compared to a standard barbell.',
      techniqueNotes: 'The axle can be cleaned from the floor (continental clean) or taken from a rack. Wrist position is critical — maintain neutral alignment. Pressing styles include strict, push press, or jerk per competition rules — confirm rules for the specific competition. Bar path should be vertical.',
      coachingCues: 'Maintain wrist alignment throughout.\nBrace the core.\nDrive the bar in a straight vertical line.\nLock out completely.\nConfirm competition rules for allowed technique.',
      commonMistakes: 'Wrist collapse during the clean.\nPressing before the body is stable.\nInconsistent grip width.\nElbows flaring excessively.',
      safetyNotes: 'The thick bar eliminates rotation, increasing wrist and forearm demands significantly. Build thick-bar tolerance progressively. Wrist wraps may assist during training.',
      progressions: 'Standard barbell overhead press → fat grip barbell press → axle from rack → axle continental clean and press from floor.',
      regressions: 'Standard barbell press → fat grip attachment on barbell → axle from rack at lighter load.',
      programmingNotes: 'Substitute axle for barbell in overhead pressing work to develop grip tolerance. Include wrist curl, reverse curl, and fat bar deadlift as accessories.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Axle bar (approximately 50mm diameter), plates',
      musclesWorked: 'Shoulders, triceps, core, forearms, upper chest',
      isPublished: true,
      isLaunchPriority: true,
    },
    // ── Deadlift / Hinge ──────────────────────────────────────────────────────
    {
      name: 'Conventional Deadlift',
      slug: 'conventional-deadlift',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'The conventional barbell deadlift from the floor. Foundation of pulling strength for all Strongman athletes and the basis for competition deadlift events.',
      techniqueNotes: 'Feet hip to shoulder width, bar over mid-foot. Hip hinge to the bar — shins close, back flat, lats engaged, chest up. Brace with 360 degrees of pressure. Drive the floor away. Bar stays in contact with the legs throughout. Lock out with knees straight, hips fully extended, shoulders back.',
      coachingCues: 'Hip hinge to the bar.\nPush the floor away.\nBar stays against the legs.\nBrace hard throughout.\nLock out fully — hips drive through.',
      commonMistakes: 'Rounding the lower back at the start.\nNot completing full lockout.\nBar drifting away from the body.\nRushing the set-up.\nGrip failing before hip lockout.',
      safetyNotes: 'Never round the lower back under maximal load. Thorough posterior chain warm-up required. Always use collars. Mixed grip reduces rotation risk at heavy loads — alternate sides in training.',
      progressions: 'Hip hinge drill → block pull → Romanian deadlift → conventional deadlift → Strongman variations (elephant bar, frame deadlift).',
      regressions: 'Hip hinge drill → trap bar deadlift → block pull at a height that allows a neutral spine → conventional deadlift from the floor.',
      programmingNotes: 'Cycle max effort singles and higher-rep moderate load work. Romanian deadlift, good morning, and rack pull are key accessories. Taper: avoid heavy deadlift 5–7 days before competition.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell, plates',
      musclesWorked: 'Posterior chain (hamstrings, glutes, erectors), quadriceps, core, forearms',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Romanian Deadlift',
      slug: 'romanian-deadlift',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'A hip hinge movement from standing — lowering the bar while maintaining a slight knee bend and flat back until a strong hamstring stretch is felt. A key accessory for posterior chain development in Strongman.',
      techniqueNotes: 'Start from standing with the bar at hip height. Push the hips back, keeping a slight bend in the knees. Lower the bar along the legs, maintaining a flat back and neutral spine. Lower until a strong hamstring stretch is felt. Return to standing by driving the hips forward.',
      coachingCues: 'Push hips back, not down.\nBar tracks close to the legs.\nFeel the hamstring tension.\nDrive hips forward to stand.\nNeutral spine from head to tailbone.',
      commonMistakes: 'Rounding the lower back.\nExcessive knee bend that turns it into a deadlift.\nGoing beyond the range where a neutral spine can be maintained.\nBar drifting forward from the body.',
      safetyNotes: 'Stop descending when you can no longer maintain a neutral spine. The range of motion will improve with consistent practice. Do not force depth.',
      progressions: 'Hip hinge drill → kettlebell or dumbbell RDL → barbell RDL → single-leg RDL.',
      regressions: 'Hip hinge drill → light kettlebell or dumbbell RDL.',
      programmingNotes: 'Include as a posterior chain accessory on deadlift or lower body days. Moderate weight and higher reps (3–4 sets of 8–12). Builds the posterior chain capacity required across all Strongman events.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell or dumbbells',
      musclesWorked: 'Hamstrings, glutes, erector spinae, core',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Hip Hinge Drill',
      slug: 'hip-hinge-drill',
      category: 'Deadlift / Hinge',
      difficulty: Difficulty.BEGINNER,
      description: 'A teaching drill using a dowel rod or wall to develop and reinforce the hip hinge movement pattern. Essential for coaching new athletes before introducing load.',
      techniqueNotes: 'Hold a dowel rod along the spine or stand with back to a wall. Three points of contact: head, upper back, and sacrum against the dowel or wall. Push hips back while maintaining all three contact points. Knees soft. The upper body leans forward as the hips travel back — this is correct. Return to standing with hip drive.',
      coachingCues: 'Three points of contact on the dowel.\nPush hips back to the wall.\nKnees soft, not driving forward.\nFeel the hamstrings engage.\nDrive hips through to stand.',
      commonMistakes: 'Squatting down (knees forward) rather than hinging.\nLosing contact with the dowel at one or more points.\nRounded lower back.\nHead poking forward.',
      safetyNotes: 'No load — this is a movement quality drill. Ensure clear space behind the athlete if using a wall.',
      progressions: 'Hip hinge drill (bodyweight) → Romanian deadlift with light load → conventional deadlift.',
      regressions: 'Seated hip hinge with band feedback → hip hinge with wall → full standing hip hinge drill.',
      programmingNotes: 'Use at the start of any deadlift or hinge-based session for new athletes. Revisit regularly as a coaching check to reinforce movement quality.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Dowel rod, broomstick, or wall',
      musclesWorked: 'Hamstrings, glutes, core — movement pattern development',
      isPublished: true,
      isLaunchPriority: true,
    },
    // ── Carry ─────────────────────────────────────────────────────────────────
    {
      name: "Farmer's Walk",
      slug: 'exercise-farmers-walk',
      category: 'Carry',
      difficulty: Difficulty.INTERMEDIATE,
      description: "Carrying two loaded implements at arm's length for distance or time. Develops grip, core stability, and conditioning simultaneously. One of the six core Strongman events.",
      techniqueNotes: "Rapid lockout from the pick — stand tall in one motion. Implements hang at the sides. Short, fast stride turnover. Brace the core hard throughout. Keep the torso upright — do not let the implements pull the shoulders forward. Where a re-pick is required, practise this specifically.",
      coachingCues: "Pick up fast — stand tall immediately.\nShort quick steps.\nBrace hard throughout.\nDon't let the implements drag you forward.\nRe-pick quickly if you drop.",
      commonMistakes: "Slow or partial lockout on the pick.\nLooking down.\nAllowing the handles to pull shoulders into protraction.\nPoor re-pick mechanics — losing time and position.",
      safetyNotes: "Clear the path before picking up. Know when to drop safely — never fight a fall. Build grip capacity progressively. Use collars on handles.",
      progressions: "Dumbbell or kettlebell loaded carries → trap bar carry → farmer's walk handles → competition-weight farmer's walk.",
      regressions: "Loaded dumbbell walk → trap bar carry → lighter farmer's implements → full implement at manageable load.",
      programmingNotes: "Programme on a separate day from heavy deadlift work. Short heavy sets build max strength; longer distance carries build conditioning. Year-round grip work: fat bar holds, rolling thunder, thick bar pulls.",
      isCompetitionEvent: true,
      equipmentNeeded: "Farmer's walk handles, plates",
      musclesWorked: 'Full body — grip, forearms, traps, core, erectors, legs',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Yoke Walk',
      slug: 'exercise-yoke-walk',
      category: 'Carry',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Carrying a heavy steel yoke frame across the upper back for distance. Develops total body stability, positional strength, and competitive carry technique.',
      techniqueNotes: "The bar of the yoke sits across the upper back similar to a high-bar squat. Hands grip the uprights for stability. Find the balance point before moving — the yoke will oscillate if rushed. Short, controlled steps. Eyes forward. Brace maximally throughout. Do not lean into the yoke.",
      coachingCues: 'Find your balance point before moving.\nBrace hard — maximum tension throughout.\nShort, controlled steps.\nEyes forward, not down.\nSmooth rhythm over speed.',
      commonMistakes: 'Slow stride turnover causing yoke to swing.\nDropping before stabilising at the pick.\nAttempting to run rather than establishing controlled rhythm.\nYoke riding too low on the back.',
      safetyNotes: 'Have spotters present for first sessions at unfamiliar or high loads. Set the yoke to the correct height for the athlete. Practise dropping the yoke safely — never attempt to save a collapsing yoke. Clear the path entirely.',
      progressions: 'Back squat → walkouts (bar on back, no movement) → empty yoke walk → progressively loaded yoke.',
      regressions: 'Walkout with empty yoke to find the movement feel → very short loaded walk → build distance and load progressively.',
      programmingNotes: 'Heavy squatting has strong carryover. Include yoke-specific work for competition athletes. Short heavy sets build positional strength; longer distances build conditioning. Build speed only after load and technique are established.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Yoke frame, plates',
      musclesWorked: 'Full body — upper back, core, erectors, legs, glutes',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Sandbag Carry',
      slug: 'sandbag-carry',
      category: 'Carry',
      difficulty: Difficulty.BEGINNER,
      description: 'Carrying a heavy sandbag for distance or time. An accessible and effective carry variation that builds core stability, upper back strength, and conditioning with lower technical demand than yoke or atlas stones.',
      techniqueNotes: 'Pick the bag in a bear hug position — arms under the bag, hugging it to the chest. Hold it high on the chest. Elbows in and underneath to pin the bag. Brace the core hard. Upright posture. Short, controlled strides.',
      coachingCues: 'Hug the bag tight.\nKeep it high on the chest.\nElbows in and under.\nBrace throughout.\nStay upright — short steps.',
      commonMistakes: 'Holding the bag too low (waist or hip height), increasing lower back strain.\nNot bracing.\nLeaning backward to counterbalance.\nNot securing the bag before moving.',
      safetyNotes: 'Check bag seams and closure before use. Clear the path. Build back off if lower back strain is felt — the load is destabilising if the brace fails.',
      progressions: 'Sandbag hold and walk → sandbag carry for distance → sandbag to shoulder → sandbag to platform.',
      regressions: 'Practise picking up and holding the bag before walking → short carry distance → build distance progressively.',
      programmingNotes: 'Use as a general conditioning and core stability tool. Effective for athletes without access to atlas stones or yoke. Sandbag loading to a platform is a direct competition event simulation.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Sandbag (various weights)',
      musclesWorked: 'Core, upper back, erectors, legs, arms',
      isPublished: true,
      isLaunchPriority: true,
    },
    // ── Loading ───────────────────────────────────────────────────────────────
    {
      name: 'Atlas Stone to Lap',
      slug: 'atlas-stone-to-lap',
      category: 'Loading',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'The first phase of atlas stone lifting — picking a spherical stone from the floor to a stable lap position. A foundational skill requiring technique, back strength, and positional control.',
      techniqueNotes: 'Approach the stone, feet close to the sides. Hip hinge — back flattens to near-parallel. Arms reach under and around the stone, hands close together, fingers pointing down. Initial drive comes from the legs. Hip extension drives the stone to the lap. The stone should sit in the lap, not be held at arm length.',
      coachingCues: 'Back flat to parallel.\nArms under and around the stone.\nLegs drive first.\nRoll the stone up the thighs.\nHip extension to lap — control the position.',
      commonMistakes: 'Pulling with the arms before the legs engage.\nBack rounding on the initial pick.\nNot getting hands deep enough under the stone.\nBringing the stone up one-sided.\nRushing the lap position.',
      safetyNotes: 'Protect forearms and inner thighs — appropriate clothing and tacky help. Never jerk with the arms without leg drive first. Have a clear area to drop the stone if the lift fails. Start with lighter stones to build technique.',
      progressions: 'Sandbag to lap (lighter and more forgiving) → light atlas stone to lap → progressively heavier stone.',
      regressions: 'Sandbag carry to lap position → light atlas stone with a high crate to reduce range → full stone-to-lap from floor.',
      programmingNotes: 'Drill the stone-to-lap phase separately before combining with the full load to platform. Jefferson curls, Romanian deadlifts, and heavy block pulls build the necessary back strength.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Atlas stone',
      musclesWorked: 'Erector spinae, latissimus dorsi, biceps, core, quadriceps, glutes',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Atlas Stone to Platform',
      slug: 'atlas-stone-to-platform',
      category: 'Loading',
      difficulty: Difficulty.ADVANCED,
      description: 'The complete atlas stone loading movement — from floor to platform. Combines the stone-to-lap phase with full hip extension to place the stone onto the platform.',
      techniqueNotes: 'Complete the stone-to-lap phase first. With the stone in the lap, drive hips forward into full extension (hip drive and shoulder shrug) to raise the stone to platform height. Place or roll the stone firmly onto the platform. Tacky on the forearms assists grip throughout. Platform heights vary by competition.',
      coachingCues: 'Stone to lap first — do not rush.\nStand tall.\nDrive hips through completely.\nExtend and shrug.\nPlace the stone firmly — do not let it roll off.',
      commonMistakes: 'Rushing from floor to platform without a solid lap position.\nPoor tacky application.\nHip drive without the follow-through shrug.\nStone rolling off due to poor angle of release.',
      safetyNotes: 'Ensure the platform is stable before loading. Spotters should be positioned to the side — never directly in front of the stone. Tacky reduces drop risk but is not a substitute for good technique.',
      progressions: 'Atlas stone to lap → stone to low platform (60–80cm) → raise platform height progressively → competition height.',
      regressions: 'Sandbag loading → stone to lap with solid technique → stone to low platform → full height.',
      programmingNotes: 'Practise competition platform heights in the final training block. Supplementary work: Jefferson curls, heavy Romanian deadlifts, zercher carries, block pulls. Build stone frequency progressively.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Atlas stone, loading platform',
      musclesWorked: 'Full posterior chain, erectors, latissimus dorsi, biceps, core, shoulders',
      isPublished: true,
      isLaunchPriority: true,
    },
    // ── Pull ──────────────────────────────────────────────────────────────────
    {
      name: 'Arm-Over-Arm Rope Pull',
      slug: 'arm-over-arm-rope-pull',
      category: 'Pull',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'A Strongman event and training drill where the athlete pulls a heavy implement hand-over-hand using a rope. Tests back strength, bicep endurance, grip, and core stability.',
      techniqueNotes: 'Seated on the floor or standing with feet braced against an anchor. Pull the rope hand-over-hand in a controlled rhythm. Keep elbows close to the body on the pull. Do not use a shoulder shrug — the pull comes from the back and biceps. Maintain rhythm and avoid letting the rope go slack.',
      coachingCues: 'Elbows in and close.\nPull from the back — not the shoulder.\nHand-over-hand rhythm.\nKeep the rope taut.\nBreathe with each pull cycle.',
      commonMistakes: 'Letting the rope go slack between pulls.\nPulling with hands too far away from the body.\nOver-relying on shoulder elevation.\nLosing seated position in the seated version.',
      safetyNotes: 'Ensure the rope end is anchored securely. Clear the lane of obstacles. The seated version reduces lower back demand — use for beginners. Check rope integrity before heavy loads.',
      progressions: 'Seated rope pull with light sled → seated pull with heavier sled → standing pull → competition-weight arm-over-arm pull.',
      regressions: 'Seated position with very light load → build load progressively → move to standing only when the pattern is solid.',
      programmingNotes: 'Include as a pulling variation for back development and grip endurance. Works well as a conditioning finisher. Programme both seated and standing variations where competitions may specify either.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Rope pull apparatus, sled or anchor system',
      musclesWorked: 'Latissimus dorsi, biceps, forearms, core, upper back (rhomboids, traps)',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Sled Drag',
      slug: 'sled-drag',
      category: 'Pull',
      difficulty: Difficulty.BEGINNER,
      description: 'Pulling a loaded sled across a surface using a harness or rope. A foundational pulling accessory for Strongman athletes that builds posterior chain strength and event-specific movement patterns with low spinal loading.',
      techniqueNotes: 'Harness version: lean away from the sled with even tension through the harness across the upper chest. Walk with long driving strides, pushing through the heel. Stay upright. Rope version: hold the rope at hip height, brace hard, pull backward in short sharp steps.',
      coachingCues: 'Lean back into the harness.\nDrive through the heel.\nStay upright.\nMaintain tension.\nConsistent rhythm throughout.',
      commonMistakes: 'Leaning too far forward.\nLosing tension in the harness.\nUsing upper body pull without leg drive.\nUneven foot placement.',
      safetyNotes: 'Ensure the harness is fitted correctly and sits across the upper chest, not the throat. Clear the pulling lane. Build load gradually.',
      progressions: 'Empty sled drag (harness) → loaded harness drag → rope sled drag → competition-weight harness pull.',
      regressions: 'Band-resisted backward walk → very light sled drag → standard loaded sled.',
      programmingNotes: "Low spinal loading makes this suitable for high-frequency use and active recovery days. Useful between heavy lifting days. Superset with farmer's walk for combined event conditioning.",
      isCompetitionEvent: false,
      equipmentNeeded: 'Sled, harness or rope',
      musclesWorked: 'Posterior chain, glutes, hamstrings, core, upper back',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Truck Pull',
      slug: 'truck-pull',
      category: 'Pull',
      difficulty: Difficulty.ADVANCED,
      description: 'The athlete uses a harness and rope to drag a heavy vehicle over a set distance. Tests maximum whole-body power output and anaerobic capacity.',
      techniqueNotes: 'The harness sits across the upper chest. Lean forward into the harness and drive with short, powerful steps to overcome inertia. Once the vehicle begins to move, transition to longer strides while maintaining forward lean and tension through the harness. The rope is held loosely — drive force comes through the harness, not the arms.',
      coachingCues: 'Drive through the floor.\nLean into the harness.\nArms relaxed.\nBuild momentum — do not stop once started.\nBreathe consistently.',
      commonMistakes: 'Over-relying on arms rather than leg drive.\nTaking short ineffective steps once momentum is established.\nPausing when the vehicle slows — inertia must be maintained continuously.',
      safetyNotes: 'Rules and setup vary significantly by federation, promoter, and competition. Never attempt maximum vehicle pulls without appropriate setup and trained safety personnel. Surface must be clear.',
      progressions: 'Harness sled drag → heavy sled pull → competition-simulation with increasingly heavy vehicle.',
      regressions: 'Harness walk without load → light sled → heavier sled → vehicle pull.',
      programmingNotes: 'Simulate with sled pulls until access to a vehicle pull event is available. Strength base: back squat, deadlift, and heavy sled drag. Taper: avoid maximum vehicle pulls within 7–10 days of competition.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Vehicle (lorry, bus, or car per competition rules), harness, rope',
      musclesWorked: 'Full body — glutes, hamstrings, quads, erectors, core, shoulders',
      isPublished: true,
      isLaunchPriority: false,
    },
    // ── Conditioning ──────────────────────────────────────────────────────────
    {
      name: 'Tyre Flip',
      slug: 'tyre-flip',
      category: 'Conditioning',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'Flipping a large tractor tyre end over end for distance or reps. Develops explosive power from the legs, conditioning, and full-body strength.',
      techniqueNotes: 'Position close to the tyre. Drive fingers under the tyre, fingers pointing down. The initial drive is from the legs and hip extension — not the arms. As the tyre rises, step in closer and transition hands to a pushing position. Drive the tyre all the way over to land flat.',
      coachingCues: 'Fingers under — not forward.\nLeg drive first — not arms.\nStep in as the tyre rises.\nHands switch to push.\nDrive it all the way over.',
      commonMistakes: 'Rounding the lower back.\nTrying to muscle the tyre with the arms before leg drive.\nNot getting hands deep enough under the tyre before driving.\nStepping too close or too far from the tyre at set-up.',
      safetyNotes: 'Ensure the tyre is stable and cannot roll sideways before beginning. Clear the flipping lane in both directions. Do not attempt a flip with a tyre too heavy to move with correct technique. Rough tyre surfaces can damage hands — grip protection may be appropriate.',
      progressions: 'Hip hinge and deadlift pattern drill → light tyre flip → progressively heavier tyre.',
      regressions: 'Band-resisted deadlift patterning → lighter tyre → partial flip with technique focus.',
      programmingNotes: 'Programme as a conditioning finisher after primary strength work. 5–10 flips per set is a practical range for power development. Allow sufficient rest between sets to maintain technique quality.',
      isCompetitionEvent: true,
      equipmentNeeded: 'Large tractor tyre (various weights)',
      musclesWorked: 'Quadriceps, glutes, hamstrings, erectors, shoulders, arms — full body',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Sled Push',
      slug: 'sled-push',
      category: 'Conditioning',
      difficulty: Difficulty.BEGINNER,
      description: 'Pushing a loaded sled across a surface. A versatile and low-injury-risk conditioning tool that builds quad strength, cardiovascular capacity, and total body work tolerance.',
      techniqueNotes: 'Hands on the poles or top frame of the sled. Body inclined forward at approximately 45 degrees. Drive from the legs with short, powerful strides. Maintain even push through both arms to keep the sled tracking straight. Core braced throughout. Keep hips down.',
      coachingCues: 'Lean into the sled.\nDrive through the toe.\nKeep hips down.\nPush evenly through both arms.\nConsistent pressure — do not decelerate.',
      commonMistakes: 'Standing too upright, reducing leg drive.\nHips rising as fatigue accumulates.\nPushing unevenly, causing the sled to turn.\nShuffling rather than driving through the legs.',
      safetyNotes: 'Ensure the surface is clear of obstacles. Build load progressively. Appropriate footwear matters on some surfaces.',
      progressions: 'Empty sled push → loaded sled → heavier loads → timed distance variations.',
      regressions: 'Band-resisted forward walk → empty sled push.',
      programmingNotes: "Low spinal loading makes this suitable for high-frequency training. Programme as a conditioning finisher or superset with farmer's walk for high-density conditioning.",
      isCompetitionEvent: false,
      equipmentNeeded: 'Sled, appropriate surface',
      musclesWorked: 'Quadriceps, glutes, calves, core, shoulder stabilisers',
      isPublished: true,
      isLaunchPriority: false,
    },
    // ── Accessories ───────────────────────────────────────────────────────────
    {
      name: 'Plank',
      slug: 'plank',
      category: 'Accessories',
      difficulty: Difficulty.BEGINNER,
      description: 'Foundational isometric core stability exercise. Develops the bracing ability required across all Strongman events. Every heavy lift demands a stable trunk — the plank builds that foundation.',
      techniqueNotes: 'Forearms flat, elbows under shoulders. Body forms a straight line from head to heels. Glutes and abdominals squeezed. Breathe steadily. Neutral spine — do not allow hips to sag toward the floor or pike upward.',
      coachingCues: 'Neutral spine.\nSqueeze glutes and abs.\nBreathe steadily.\nDo not let hips sag or rise.\nFull body tension throughout.',
      commonMistakes: 'Hips sagging.\nHips piking upward.\nBreath-holding.\nHead falling forward.\nNot maintaining full-body tension.',
      safetyNotes: 'Stop if you feel lower back pain — this usually indicates the hips are sagging. Begin with short holds and build duration progressively.',
      progressions: 'Plank hold (build duration) → plank with alternating arm or leg reach → RKC plank (maximum tension) → weighted plank.',
      regressions: 'Plank from knees → short hold plank from toes → build to longer holds.',
      programmingNotes: 'Include in warm-ups or as accessory work after main lifts. Progress by increasing hold duration, then adding variety (RKC, weighted). Foundation for all bracing work.',
      isCompetitionEvent: false,
      equipmentNeeded: 'None (mat optional)',
      musclesWorked: 'Core — transverse abdominis, rectus abdominis, obliques, glutes, shoulder stabilisers',
      isPublished: true,
      isLaunchPriority: true,
    },
    {
      name: 'Good Morning',
      slug: 'good-morning',
      category: 'Accessories',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'A barbell hip hinge with the bar on the upper back. The athlete hinges forward maintaining a neutral spine. A key accessory for building the posterior chain and bracing strength needed across Strongman.',
      techniqueNotes: 'Bar positioned on upper back similar to a high-bar squat. Feet hip width. Soft bend in the knees. Hinge at the hip, pushing hips back, lowering the torso toward parallel with the floor while maintaining a neutral spine. Drive the hips forward to return to standing.',
      coachingCues: 'Push hips back, not down.\nNeutral spine from head to tailbone.\nFeel the hamstring tension.\nDrive hips forward to stand.\nNo knee-dominant movement.',
      commonMistakes: 'Rounding the lower back.\nExcessive knee bend (turning it into a squat).\nGoing beyond the range where neutral spine is maintained.\nBar rolling forward off the back.',
      safetyNotes: 'Use conservative loading — posterior chain injury risk is significant if form breaks down. Never programme at near-maximal loads. Do not use with athletes who have not established a solid hip hinge pattern.',
      progressions: 'Hip hinge drill → Romanian deadlift → good morning with empty bar → moderate-load good morning.',
      regressions: 'Hip hinge drill → Romanian deadlift at light load → good morning with dowel or empty bar.',
      programmingNotes: 'Include as a supplementary posterior chain exercise on pulling or lower body days. 3–4 sets of 8–12 reps at moderate load. Build gradually. Complements Romanian deadlift in a posterior chain programme.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell',
      musclesWorked: 'Hamstrings, glutes, erector spinae, core',
      isPublished: true,
      isLaunchPriority: false,
    },
    {
      name: 'Zercher Carry',
      slug: 'zercher-carry',
      category: 'Accessories',
      difficulty: Difficulty.INTERMEDIATE,
      description: 'A loaded carry where the implement is held in the crooks of the elbows. Develops core strength, upper back, and the functional carrying strength used in atlas stone and loading events.',
      techniqueNotes: 'Position the bar or implement in the fold of the elbows. Hands can be clasped together. Upright posture throughout. Brace the core hard. Short, controlled strides. Keep the implement from sliding down the arms.',
      coachingCues: 'Elbows in and secure.\nSqueeze the implement.\nStand tall.\nBrace your core.\nConsistent stride length — breathe.',
      commonMistakes: 'Letting the implement slide down the arms to the wrists.\nLeaning backward to counterbalance.\nNot bracing.\nArms not locked in position before walking.',
      safetyNotes: 'Barbell on bare elbows can cause discomfort. Use a bar pad, wrap the bar in a towel, or substitute with a sandbag or atlas stone which distributes pressure differently. Build load gradually.',
      progressions: 'Zercher hold (standing, no movement) → short zercher carry → longer distance and heavier load.',
      regressions: 'Sandbag bear hug hold → zercher hold practice at very light load → short zercher walk.',
      programmingNotes: 'Use as an accessory for loading events, atlas stone work, and posterior chain carrying strength. Works well in the same session as atlas stone training.',
      isCompetitionEvent: false,
      equipmentNeeded: 'Barbell, sandbag, or atlas stone',
      musclesWorked: 'Core, erector spinae, upper back, biceps, quadriceps, glutes',
      isPublished: true,
      isLaunchPriority: false,
    },
  ];

  for (const exDef of exerciseDefs) {
    await prisma.exercise.upsert({
      where: { slug: exDef.slug },
      update: {
        description:      exDef.description,
        techniqueNotes:   (exDef as any).techniqueNotes   ?? null,
        coachingCues:     exDef.coachingCues               ?? null,
        commonMistakes:   (exDef as any).commonMistakes   ?? null,
        safetyNotes:      (exDef as any).safetyNotes      ?? null,
        progressions:     (exDef as any).progressions     ?? null,
        regressions:      (exDef as any).regressions      ?? null,
        programmingNotes: (exDef as any).programmingNotes ?? null,
        musclesWorked:    exDef.musclesWorked              ?? null,
        equipmentNeeded:  exDef.equipmentNeeded            ?? null,
      },
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

  // ── EatStrong Articles ─────────────────────────────────────────────────────
  const SCOPE_NOTE = 'This article provides general nutritional information for educational purposes. It does not constitute personalised dietary advice. Coaches should refer athletes to a registered dietitian or registered nutritionist for individualised nutrition support.';

  const beStrongArticles = [
    // BASICS
    {
      title: 'Energy Balance for Strongman Athletes',
      slug: 'energy-balance-strongman',
      category: BeStrongCategory.BASICS,
      summary: 'Why calories matter for strength sport, and how chronic underfuelling sabotages training and recovery.',
      content: 'Strongman athletes have some of the highest energy demands of any strength sport. This article covers the fundamentals of energy balance — what it means, why it matters, and how coaches can identify signs of energy deficiency in their athletes without crossing into nutrition prescription.\n\nKey points:\n• Total energy expenditure in Strongman is significantly higher than general population estimates\n• Chronic energy deficiency impairs recovery, reduces training quality, and increases injury risk\n• Signs a coach might observe: persistent fatigue, stalled progress, irritability, frequent illness\n• The coach\'s role: identify and refer — not prescribe',
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
      content: 'Nutrition conversations happen in every coaching relationship. Handled well, they support athlete development. Handled poorly, they create liability and can cause harm. This guide helps coaches navigate them professionally.\n\nWhat coaches CAN do:\n• Share general evidence-based information (energy balance, protein importance, hydration, competition day fuelling)\n• Signpost athletes to qualified nutrition professionals\n• Notice and respond to red flags (extreme restriction, disordered eating behaviours, dangerous weight cutting)\n• Refer athletes to registered dietitians or registered nutritionists for personalised advice\n• Discuss EatStrong resources as educational starting points\n\nWhat coaches should NOT do:\n• Prescribe calorie targets, macronutrient splits, or specific meal plans\n• Recommend supplement doses\n• Provide medical nutrition therapy (managing eating disorders, medical conditions)\n• Provide weight loss or weight gain prescriptions\n\nPhrasing that stays in scope:\n• "There\'s a great resource on competition nutrition in EatStrong — I\'d recommend having a look."\n• "It might be worth speaking to a sports dietitian about your nutrition leading into this competition."\n• "I\'ve noticed you\'ve mentioned skipping meals a lot — how are you feeling in training?"\n\nPhrasing that crosses the line:\n• "You should eat X calories a day."\n• "Take this supplement — it\'ll help your performance."\n• "You need to cut 3kg before weigh-in — here\'s how."',
      authorName: 'EatStrong Editorial Team',
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
      authorName: 'EatStrong Editorial Team',
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
  console.log(`EatStrong articles seeded: ${beStrongArticles.length}`);

  // ── EatStrong Downloads ────────────────────────────────────────────────────
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
  console.log(`EatStrong downloads seeded: ${beStrongDownloads.length}`);

  // ── EatStrong recommendation prompts linked to course lessons ─────────────
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
      ctaText: 'Want to learn more? Explore EatStrong Nutrition',
      targetType: ContentType.BE_STRONG_ARTICLE,
      targetId: bsBasicsArticle.id,
      targetUrl: '/eatstrong/articles/energy-balance-strongman',
      position: 'end_of_lesson',
      isActive: true,
    }] : []),
    // L2 — deeper nutrition prompt
    ...(l2NutritionLesson && bsNutritionArticle ? [{
      lessonId: l2NutritionLesson.id,
      triggerContext: 'nutrition fundamentals module',
      promptLabel: 'Go deeper on this topic',
      ctaText: 'Go deeper on this topic — EatStrong Competition Nutrition',
      targetType: ContentType.BE_STRONG_ARTICLE,
      targetId: bsNutritionArticle.id,
      targetUrl: '/eatstrong/articles/competition-day-nutrition-guide',
      position: 'end_of_lesson',
      isActive: true,
    }] : []),
  ];

  for (const prompt of beStrongPrompts) {
    await prisma.recommendationPrompt.create({ data: prompt });
  }
  console.log(`EatStrong recommendation prompts seeded: ${beStrongPrompts.length}`);

  // ── Seed Assessments for Level 1 Coaching ──────────────────────────────────
  const l1CoachingCourse = await prisma.course.findUnique({
    where: { slug: 'level-1-coaching-strongman' },
  });

  const l1RefereeCourse = await prisma.course.findUnique({
    where: { slug: 'level-1-strongman-refereeing' },
  });

  if (l1CoachingCourse) {
    const coachingAssessments = [
      {
        courseId: l1CoachingCourse.id,
        title: 'Written Coaching Scenario',
        description: 'Analyse a coaching scenario and propose a structured coaching response. 700–900 words. Tests your ability to apply course learning to real-world coaching situations.',
        type: 'WRITTEN_SCENARIO' as const,
        passMark: 65,
        maxAttempts: 3,
        isActive: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Knowledge Examination',
        description: '40 questions across event technique, safety, coaching fundamentals, and programming. 60 minutes. Pass mark: 75%.',
        type: 'KNOWLEDGE_EXAM' as const,
        passMark: 75,
        maxAttempts: 3,
        isActive: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Practical Coaching Observation',
        description: 'Observed on the in-person course day. Competency-based — all criteria must be passed. Assessed by Paul Smith or Dr Chris Fitzgerald.',
        type: 'PRACTICAL_OBSERVATION' as const,
        passMark: 100,
        maxAttempts: 2,
        isActive: true,
      },
    ];

    for (const assessment of coachingAssessments) {
      await prisma.assessment.upsert({
        where: {
          id: (await prisma.assessment.findFirst({ where: { courseId: assessment.courseId, title: assessment.title } }))?.id || 'new',
        },
        update: {},
        create: assessment,
      });
    }
    console.log('Level 1 Coaching assessments seeded.');
  }

  if (l1RefereeCourse) {
    const refereingAssessments = [
      {
        courseId: l1RefereeCourse.id,
        title: 'Rules Knowledge Examination',
        description: '30 questions covering event rules, judging criteria, and refereeing responsibilities. 45 minutes. Pass mark: 75%.',
        type: 'KNOWLEDGE_EXAM' as const,
        passMark: 75,
        maxAttempts: 3,
        isActive: true,
      },
      {
        courseId: l1RefereeCourse.id,
        title: 'Judging Scenario Assessment',
        description: 'Watch 20 competition attempt clips and record Good Lift / No Lift decisions with rule citations. 90 minutes.',
        type: 'JUDGING_SCENARIO' as const,
        passMark: 70,
        maxAttempts: 2,
        isActive: true,
      },
    ];

    for (const assessment of refereingAssessments) {
      await prisma.assessment.upsert({
        where: {
          id: (await prisma.assessment.findFirst({ where: { courseId: assessment.courseId, title: assessment.title } }))?.id || 'new',
        },
        update: {},
        create: assessment,
      });
    }
    console.log('Level 1 Refereeing assessments seeded.');
  }

  // ── Seed Course Documents ───────────────────────────────────────────────────
  const documentDefs = [
    // Level 1 Coaching documents
    ...(l1CoachingCourse ? [
      {
        courseId: l1CoachingCourse.id,
        title: 'Level 1 Coaching — Course Handbook',
        description: 'Complete course handbook covering all modules, learning outcomes, and assessment requirements.',
        type: 'HANDBOOK' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 2.4,
        sortOrder: 1,
        isPublished: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Pre-Course E-Learning Guide',
        description: 'Complete this guide before attending the in-person practical day. Covers module pre-reading and logistics.',
        type: 'RESOURCE' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 1.1,
        sortOrder: 2,
        isPublished: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Athlete Intake Form',
        description: 'Use this form with all new athletes before coaching sessions.',
        type: 'ASSESSMENT_FORM' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 0.3,
        sortOrder: 3,
        isPublished: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Risk Assessment Template',
        description: 'Required for all training environments. Complete and retain for your coaching records.',
        type: 'CHECKLIST' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 0.4,
        sortOrder: 4,
        isPublished: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Practical Coaching Observation Checklist',
        description: 'The checklist used by assessors during the in-person practical coaching observation.',
        type: 'ASSESSMENT_FORM' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 0.2,
        sortOrder: 5,
        isPublished: true,
      },
      {
        courseId: l1CoachingCourse.id,
        title: 'Level 1 Coaching Certificate',
        description: 'Your Active IQ accredited certificate. Issued upon successful completion of all assessments.',
        type: 'CERTIFICATE' as const,
        status: 'LOCKED' as const,
        fileType: 'PDF',
        sortOrder: 6,
        isPublished: true,
      },
    ] : []),

    // Level 1 Refereeing documents
    ...(l1RefereeCourse ? [
      {
        courseId: l1RefereeCourse.id,
        title: 'Level 1 Refereeing — Course Handbook',
        description: 'Complete course handbook covering refereeing ethos, event rules, and assessment criteria.',
        type: 'HANDBOOK' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 1.8,
        sortOrder: 1,
        isPublished: true,
      },
      {
        courseId: l1RefereeCourse.id,
        title: 'Event Rules Quick Reference Card',
        description: 'Laminated-ready quick reference for good lift and no lift criteria across all six core events.',
        type: 'RESOURCE' as const,
        status: 'AVAILABLE' as const,
        fileType: 'PDF',
        fileSizeMb: 0.2,
        sortOrder: 2,
        isPublished: true,
      },
      {
        courseId: l1RefereeCourse.id,
        title: 'Level 1 Refereeing Certificate',
        description: 'Your WHEA.GB endorsed refereeing certification. Issued on successful completion.',
        type: 'CERTIFICATE' as const,
        status: 'LOCKED' as const,
        fileType: 'PDF',
        sortOrder: 3,
        isPublished: true,
      },
    ] : []),

    // Platform-wide resources (no courseId)
    {
      courseId: null,
      title: 'Anti-Doping Awareness Guide',
      description: 'Required reading for all Educate.Strong coaches. Covers WADA basics, supplement risks, and coach responsibilities.',
      type: 'RESOURCE' as const,
      status: 'AVAILABLE' as const,
      fileType: 'PDF',
      fileSizeMb: 0.5,
      sortOrder: 1,
      isPublished: true,
    },
  ];

  for (const doc of documentDefs) {
    const existing = await prisma.courseDocument.findFirst({
      where: { courseId: doc.courseId, title: doc.title },
    });
    if (!existing) {
      await prisma.courseDocument.create({ data: doc });
    }
  }
  console.log(`Course documents seeded: ${documentDefs.length}`);

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
