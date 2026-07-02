import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Article {
  id: number;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  level: string;
  body?: string;
}

const CATEGORIES = [
  { id: 'all',         label: 'All Resources' },
  { id: 'coaching',    label: 'Coaching' },
  { id: 'refereeing',  label: 'Refereeing' },
  { id: 'strongkidz', label: 'StrongKidz' },
  { id: 'eatstrong',  label: 'EatStrong' },
  { id: 'programming', label: 'Programming' },
  { id: 'athlete',    label: 'Athlete Development' },
  { id: 'competition', label: 'Competition' },
];

const ARTICLES: Article[] = [
  {
    id: 1, category: 'coaching',
    title: "Teaching the Hip Hinge: A Coach's Framework",
    summary: 'The hip hinge underpins almost every major Strongman event. Here is how to teach it progressively to beginner athletes.',
    readTime: '8 min', level: 'Foundation',
    body: `The hip hinge is the movement foundation of every major pulling and carrying event in Strongman. From the atlas stone to the farmer's walk to the conventional deadlift, athletes who cannot move cleanly through a hip hinge will be limited by pattern deficit rather than strength.\n\nThe most reliable teaching progression is: hip hinge drill (wall or dowel contact) → Romanian deadlift with a light implement → deadlift from the floor. Use the wall drill first. Instruct the athlete to stand an arm's length from the wall, feet hip-width, and push their hips back until they touch the wall while maintaining three points of contact on a dowel (head, upper back, sacrum).\n\nCommon coaching cues: push hips back, not down; maintain three points of contact on the dowel; knees soft but not driving forward; feel tension in the hamstrings at the bottom of the movement. Progress to load only when the pattern is consistently clean. Reinforce with a brief drill at the start of every pulling session for new athletes.`,
  },
  {
    id: 2, category: 'coaching',
    title: 'Coaching Cues That Actually Work',
    summary: 'External focus cues vs internal focus — what the research says and how to apply it on the gym floor during practical coaching.',
    readTime: '6 min', level: 'Foundation',
    body: `Research in motor learning consistently shows that external focus cues — those directing attention to the implement or the environment — produce better movement outcomes than internal focus cues, which direct attention to the body itself.\n\nFor example, "push the floor away" (external) outperforms "engage your quadriceps" (internal) for deadlift teaching. "Drive the log to the ceiling" typically outperforms "extend your elbows." This is because internal cues narrow attention to a single body part, while external cues allow the motor system to self-organise more effectively across the whole movement.\n\nIn practice: identify the critical movement quality you need to change, then find the external cue that corresponds to it. Test the cue on the athlete — if the movement does not improve within two or three attempts, the cue is not landing. Change the language or the image. Not every cue works for every athlete. Build a library of alternatives for each movement and use them flexibly.`,
  },
  {
    id: 3, category: 'refereeing',
    title: 'Good Lift vs No Lift: Developing Consistency',
    summary: 'Consistent judging decisions come from clear criteria, not instinct. A practical guide to standardising your calls across events.',
    readTime: '7 min', level: 'Refereeing',
    body: `Inconsistent judging decisions are one of the most common sources of frustration in Strongman competition. The solution is not stricter refereeing — it is clearer criteria applied with consistent language before, during, and after the event.\n\nBefore the event: deliver a structured athlete briefing that defines the exact start and finish criteria for every movement. Repeat the most critical points. After the event: use a consistent verbal call for every decision ("good lift" or "no lift") with no ambiguous middle ground.\n\nThe most common judging errors arise at extremes of performance: very clean lifts where judges hesitate unnecessarily, and borderline lifts where subjectivity enters. The answer is to focus on objective completion criteria — full lockout, feet stationary, down signal given and acknowledged. If the criteria are met, it is a good lift. Develop consistency by reviewing past competition video with other referees and calibrating your calls together.`,
  },
  {
    id: 4, category: 'programming',
    title: 'Building Your First 12-Week Strongman Block',
    summary: 'A practical guide to periodisation for beginner and intermediate Strongman athletes — event selection, volume, and progression.',
    readTime: '12 min', level: 'Coaching',
    body: `A practical 12-week block for beginner and intermediate Strongman athletes typically follows a three-phase structure: a foundation phase (weeks 1–4), a loading phase (weeks 5–8), and a realisation phase (weeks 9–12).\n\nIn the foundation phase, focus on technique quality over intensity. Programme each of the six core events at low-moderate weight with high attention to movement. Include posterior chain accessories — Romanian deadlifts, good mornings, and carries — to build base capacity. Week 4 is a deload.\n\nIn the loading phase, increase event-specific loads progressively. Use a rep-based approach (e.g. 5x3 descending weight on log press) rather than max attempts. Week 8 is a deload. In the realisation phase, work up to competition-specific weights and practise the complete event formats. Simulate competition timing. Week 12 is the competition or test week — no new stimulus, only confidence-building practice.`,
  },
  {
    id: 5, category: 'athlete',
    title: 'Managing Fatigue Across a Competition Season',
    summary: 'Understanding accumulative fatigue, deload protocols, and how to time your athletes to peak on competition day.',
    readTime: '10 min', level: 'Advanced',
    body: `Accumulative fatigue is one of the least-discussed challenges in Strongman coaching. Unlike team sports with enforced rest seasons, Strongman athletes often train continuously, adding event-specific work on top of general strength work with insufficient recovery.\n\nThe key principle is fitness-fatigue theory: performance is a function of fitness minus fatigue. Fatigue masks fitness — athletes who are very fit but highly fatigued will perform below their capability. The goal of a taper is not to gain fitness; it is to reduce fatigue while maintaining the fitness already built.\n\nPractical guidelines: reduce volume significantly in the final 7–10 days before competition. Maintain intensity — do not go light. Do not introduce new exercises. Monitor subjective wellbeing — a simple 1–10 morning readiness score helps identify when athletes are underrecovering. Plan deload weeks every 4–6 weeks across the training year, not only before competition.`,
  },
  {
    id: 6, category: 'strongkidz',
    title: 'Age-Appropriate Loading: What the Evidence Says',
    summary: 'A practical overview of youth strength training research and how to apply it safely in StrongKidz sessions.',
    readTime: '9 min', level: 'Youth',
    body: `The evidence on youth strength training is well-established: age-appropriate resistance training is safe and beneficial for children and adolescents when supervised correctly. Concerns about growth plate damage from resistance training are not supported by the current evidence base when technique and load are managed appropriately.\n\nKey principles for StrongKidz sessions: prioritise movement quality over load, use bodyweight and light implement activities to build motor skills, keep sessions short and varied, and ensure all activities are supervised with appropriate coaching ratios.\n\nFor Strongman-specific activities in StrongKidz: log pick-up and carry drills with implement-weight equipment, sandbag carries at very light loads, basic hip hinge patterns using dowels or very light barbells, and tyre pulls using a lightweight tyre on a smooth surface. All activities should be achievable at age-appropriate load and designed to reinforce the enjoyment of the sport.`,
  },
  {
    id: 7, category: 'eatstrong',
    title: 'Competition Day Nutrition: A Practical Guide',
    summary: 'What to eat, when to eat, and how to fuel across a full day of Strongman competition events.',
    readTime: '8 min', level: 'Nutrition',
    body: `Strongman competition days are long, typically spanning 4–8 hours with multiple events. The athlete's nutritional goal is to maintain energy, hydration, and cognitive readiness across all events — not to achieve any specific body composition goal on the day.\n\nPre-competition: athletes should eat a familiar, carbohydrate-rich meal 2–3 hours before the first event. Avoid experimenting with new foods. Pre-hydrate: aim for pale yellow urine before the start. Caffeine can be used strategically if the athlete is habituated to it — approximately 3–6mg/kg of bodyweight, 45–60 minutes before the first event.\n\nDuring competition: consume small, carbohydrate-based snacks between events — bananas, rice cakes, or sports bars are practical. Maintain fluid intake throughout. Avoid large meals mid-competition as digestion reduces blood flow available to working muscles. If weigh-in is involved, establish a clear post-weigh-in refuelling strategy before competition day.`,
  },
  {
    id: 8, category: 'competition',
    title: 'Event Selection Strategy for First-Time Competitors',
    summary: 'How coaches should approach event selection to maximise athlete performance and confidence at their first competition.',
    readTime: '7 min', level: 'Coaching',
    body: `A first competition should build confidence, not test limits. Event selection for first-time competitors should favour events where the athlete has demonstrated reliable technique at or near competition weight, rather than events that challenge physical limits.\n\nReview the competition announcement early. For each event, assess: has the athlete performed this event at this weight? Do they have a reliable pick-up and completion pattern? Are there known technical weaknesses that could lead to a red light?\n\nWhere the competition is fixed-event, preparation should focus on the athlete's weakest event — that is where time in the final block is most valuable. For athletes with event choice, prioritise events in their strength categories and accept lower-scoring rounds on weaker events. The goal of a first competition is to complete it safely, score on the board, and leave wanting to compete again.`,
  },
  {
    id: 9, category: 'coaching',
    title: 'Risk Assessment for Strongman Training Environments',
    summary: "A coach's practical guide to identifying and managing risk before sessions involving heavy implements.",
    readTime: '6 min', level: 'Foundation',
    body: `Risk management in Strongman is professional responsibility, not bureaucratic box-ticking. The nature of the implements, the loads involved, and the movement patterns of Strongman events all carry specific risks that coaches must identify and manage before every session.\n\nPre-session checks: inspect all implements for damage, cracks, loose collars, or unstable welds. Check the training surface for slippery areas or obstacles in carry lanes. Verify adequate ceiling height for overhead pressing. Confirm no one is working in the drop zone for any implement that may be dropped.\n\nAthletes with pre-existing conditions require individual risk assessment before each session. Coaches must maintain a record of relevant health disclosures. A signed liability waiver does not transfer the duty of care from coach to athlete — the coach remains professionally responsible for foreseeable risks.`,
  },
  {
    id: 10, category: 'refereeing',
    title: 'Briefing Athletes: Before the Event Starts',
    summary: 'A structured approach to athlete briefings that reduces disputes, improves clarity, and sets the tone for fair officiating.',
    readTime: '5 min', level: 'Refereeing',
    body: `An effective athlete briefing is one of the most undervalued judging tools. A clear, consistent briefing reduces disputes, reduces no-lifts caused by misunderstanding rather than inability, and sets a professional tone.\n\nA structured briefing for each event should cover: the start position and start signal, the completion criteria (what constitutes a good lift or a valid carry), the finish position, the down or stop signal, and any specific rules about re-picks, drops, or stepping.\n\nSpeak clearly and at a moderate pace. Ask if there are any questions before the event begins. Answer questions directly — do not dismiss them. A confused athlete is more likely to receive a red light through misunderstanding than through inability. The briefing is your tool for clarity, not a formality.`,
  },
  {
    id: 11, category: 'athlete',
    title: 'The Six Core Events: An Overview for New Athletes',
    summary: 'Why the six core events form the foundation of Strongman training and what each one demands technically and physically.',
    readTime: '7 min', level: 'Foundation',
    body: `The six core events — Log Press, Axle Press, Conventional Deadlift, Farmer's Walk, Yoke Walk, and Atlas Stones — form the curriculum of the EducateStrong Level 1 coaching qualification. They were selected because they represent the breadth of physical demands in Strongman: overhead pressing, maximum pulling, bilateral carries, and loaded carry requiring different stability demands.\n\nEach event has a distinct technical requirement. The log press demands continental clean mechanics and overhead pressing strength. The axle press adds a thick-bar grip challenge. The conventional deadlift builds raw pulling power that underpins all other events. The farmer's walk develops grip and loaded carry conditioning. The yoke walk requires unique positional stability under high load. Atlas stones demand sequential power application from floor to platform.\n\nFor new athletes, the six events provide a complete introduction to Strongman movement patterns. Mastery of these six movements builds the physical and technical foundation for more advanced event training and competition participation.`,
  },
  {
    id: 12, category: 'coaching',
    title: 'Atlas Stone Technique: The Stone-to-Lap Phase',
    summary: 'The stone-to-lap phase is where most technical errors in atlas stone lifting occur. A detailed coaching breakdown.',
    readTime: '8 min', level: 'Coaching',
    body: `The stone-to-lap phase is where most technical errors in atlas stone lifting occur. Athletes who cannot achieve a reliable, controlled lap position will not develop a consistent stone to platform movement.\n\nThe key teaching points are sequential: hip hinge to the stone with the back as close to parallel as possible; arms wrap under the stone with hands as close together as possible, fingers pointing down; the initial drive comes from the legs — not the arms. As the stone begins to rise, the athlete drives through both legs while pulling the stone into the body. The stone rolls up the inside of the thighs to the lap.\n\nCommon errors: initiating with the arms before the legs drive; back rounding on the initial pick because the athlete is too upright; insufficient hip extension to achieve a high lap position. Drill the stone-to-lap phase in isolation — many repetitions at lighter weight before combining with the full load to platform. Sandbag loading provides a lower-risk alternative for building the same movement pattern.`,
  },
  {
    id: 13, category: 'coaching',
    title: 'Safe Carry Event Setup and Warm-Up',
    summary: 'Carry events require specific warm-up protocols that standard barbell work does not address. What coaches need to know.',
    readTime: '6 min', level: 'Foundation',
    body: `Carry events — farmer's walk, yoke, and sandbag carry — require specific warm-up protocols that standard barbell warm-ups do not address. The specific demands of picking up and carrying under grip and core fatigue must be prepared for directly.\n\nFor farmer's walk: warm up the grip with loaded holds at 50–60% of working weight. Perform two or three short warm-up sets (10m) at progressively increasing load. For yoke: warm up the upper back with band pull-aparts and loaded walkouts. Practise two or three short yoke walks with increasing weight before the working load.\n\nAdditionally, check the carry lane for obstacles, surface quality, and appropriate width. At competitions, walk the course before the event starts. Understand the drop and re-pick rules for that specific competition. Practise the re-pick in training — many athletes never specifically drill this and lose significant time if they drop during competition.`,
  },
  {
    id: 14, category: 'programming',
    title: 'Programming for Competition: The Final Four Weeks',
    summary: 'The final four weeks before a Strongman competition require a fundamentally different programming approach.',
    readTime: '9 min', level: 'Coaching',
    body: `The final four weeks before competition require a fundamentally different approach to programming than the preceding build phase. The goal shifts from developing fitness to expressing the fitness already built — and the principal tool is fatigue reduction.\n\nWeek 1 (four weeks out): the final heavy session. Push close to competition-specific weights. This is the last time to identify and correct technical issues. Week 2 (three weeks out): reduce volume by 30–40%. Maintain intensity — do not go light. Week 3 (two weeks out): reduce volume by a further 20%. Practise complete event rehearsals at competition weight. Week 4 (competition week): minimal training — two or three short sessions covering only the athlete's weakest events, at low volume and moderate intensity. No new stimulus.\n\nNutrition and sleep are as important as training in this phase. Athletes should arrive at competition day well-rested, well-fuelled, and confident — not physically peaked from the final training day.`,
  },
  {
    id: 15, category: 'strongkidz',
    title: 'StrongKidz: Adapting Carries and Rope Work for Youth',
    summary: 'Carry activities, bucket challenges, and rope pulls that work well in StrongKidz sessions — with safe load guidance.',
    readTime: '6 min', level: 'Youth',
    body: `Carrying and grip activities are among the most accessible and enjoyable Strongman-type drills for young athletes. Sandbag carries, bucket carries, and rope pulls can be implemented safely with age-appropriate loads and appropriate supervision.\n\nFor sandbag carries in StrongKidz sessions: use dedicated youth sandbags at loads that allow 10+ metres of confident, upright carry. The emphasis is on posture and enjoyment — not load or time. Bucket carries using filled water buckets or light handled loads develop grip and unilateral carry patterns without requiring specialist equipment.\n\nTyre pulls on a smooth surface (tyre on a rope) are an excellent cooperative activity. Pairs of young athletes take turns pulling a light tyre for distance. This teaches rope pull mechanics, develops posterior chain activation, and works well as a group game. All activities should be framed competitively in a supportive way — emphasise effort and improvement, not performance ranking.`,
  },
  {
    id: 16, category: 'eatstrong',
    title: 'Hydration and Weight Considerations for Strongman',
    summary: 'Most Strongman athletes should aim to compete at a sustainable year-round weight. What coaches and athletes need to know.',
    readTime: '7 min', level: 'Nutrition',
    body: `Unlike weight-class combat sports, the majority of Strongman competitions do not use extreme weight cuts. Athletes are advised to compete at a weight that is sustainable year-round without significant manipulation, as maximal strength output is closely correlated with well-hydrated, well-fuelled body states.\n\nChronically dehydrated athletes underperform on strength metrics. A loss of as little as 2% of bodyweight through dehydration measurably reduces force output. Coaches should monitor athletes' hydration habits in training, particularly during summer months or in warm training environments.\n\nFor competitions that do use weigh-in protocols: coaches should understand the specific rules for that federation before planning any weight management strategy. Rules vary significantly between federations and promoters. In general, a small same-day rehydration protocol following a modest overnight cut is preferable to aggressive manipulation, which compromises performance and carries health risks.`,
  },
  {
    id: 17, category: 'refereeing',
    title: 'Understanding Lockout Criteria Across Events',
    summary: "Lockout criteria vary across pressing and deadlift events. A referee's guide to what to look for and how to call it consistently.",
    readTime: '6 min', level: 'Refereeing',
    body: `Lockout criteria are the most frequently contested aspect of judging across Strongman events. For overhead pressing events — log, axle, or barbell — a valid lockout requires elbows fully extended, the implement stationary overhead, and the athlete's feet planted. The down signal is given once these criteria are met simultaneously.\n\nFor deadlift events, a valid lockout requires knees locked, hips fully extended, and shoulders in a neutral or retracted position. The athlete must be standing erect. Hitching — using the thigh to assist the bar — is permitted in most Strongman competitions but the rules vary. Referees must confirm the specific rules for each competition before judging.\n\nThe most common judging error is premature or delayed down signals. Premature: giving the signal before lockout is complete. Delayed: holding for an athlete to demonstrate a stable position when the rules only require a momentary lockout. Calibrate with other judges before the competition begins.`,
  },
  {
    id: 18, category: 'competition',
    title: 'Understanding Competition Weight Classes and Open Categories',
    summary: 'How weight classes work in Strongman, and what coaches should know when entering athletes for the first time.',
    readTime: '5 min', level: 'Coaching',
    body: `Strongman competition weight classes vary significantly between federations, promoters, and competition levels. There is no single universal standard. Common weight categories include lightweight, middleweight, and heavyweight divisions for both men and women, but specific thresholds differ by organisation.\n\nOpen categories — where all athletes compete regardless of bodyweight — are common at club and regional level. For coaches entering athletes for the first time, an open or beginner category typically provides the most straightforward entry point regardless of the athlete's current bodyweight.\n\nWhen preparing for a specific competition: read the official event announcement carefully for weight class definitions, weigh-in timing, and equipment rules. Contact the promoter if any detail is unclear before competition day. Never assume rules from one federation apply to another.`,
  },
  {
    id: 19, category: 'competition',
    title: 'How to Read a Strongman Event Sheet Without Missing the Important Bits',
    summary: "Event sheets contain everything that determines your competition day — but many athletes miss the details that matter. A practical guide to reading them properly before a training block begins.",
    readTime: '6 min', level: 'Foundation',
    body: `An event sheet is the official document that defines everything about a Strongman competition: the events, the weights, the rules for each lift, the weigh-in time, the class structure, and any specific technical requirements. Reading it carefully — before the training block begins, not the night before — is one of the most valuable things a coach or athlete can do.\n\nStart with the class and division. Confirm you are entering the correct weight class, age group, and experience level. Weigh-in times, equipment allowances, and specific event rules can differ between classes within the same competition. Do not assume your class follows the same rules as the open class.\n\nFor each event, identify: the implement type and weight; the start position and start signal; the completion criteria — what constitutes a valid rep; the finish condition — crossing the line, placing the implement, a judge's command; and any specific rules about drops, re-picks, or equipment such as straps or tacky. Where anything is unclear, contact the promoter before competition day, not on the day itself.\n\nRules vary by federation, promoter, and competition. An event called Log Press at one competition may have different start positions, judging standards, or allowed techniques than the same event name at another. The event sheet is the authority for that specific competition. When in doubt, ask the head referee at the athlete briefing before the event starts.`,
  },
  {
    id: 20, category: 'athlete',
    title: "Start Strongman Safely: A Guide for New Athletes",
    summary: 'What new athletes need to know before their first Strongman session — implement progression, supervision, and the practices that reduce injury risk.',
    readTime: '7 min', level: 'Foundation',
    body: `Strongman training is rewarding and effective, but it carries specific risks that general gym training does not. The implements are heavy, bulky, and less forgiving of poor technique than standard barbells. New athletes should expect to spend several sessions building movement patterns before heavy loading begins.\n\nStart with the pattern, not the load. The hip hinge is the foundation of almost every Strongman event — deadlifts, stones, sandbag loading, and carries. Before picking up a log or an atlas stone, a new athlete should demonstrate a reliable hip hinge pattern with a dowel rod or bodyweight. A coach should not introduce a heavy implement until the fundamental pattern is stable under light load.\n\nChoose first implements carefully. Sandbag carries, trap bar deadlifts, and dumbbell farmer's carries are excellent first Strongman implements because they are more stable and forgiving than logs, axles, or atlas stones. Introduce the competition implements — log, axle, yoke, atlas stones — progressively, with light loads, with a qualified coach present, and with a clear plan for what to do if a rep fails.\n\nKnow when to stop. A rep under Strongman load is not worth the injury risk if technique has broken down. Coaches should establish clear stop criteria before the session begins. Fatigue-driven form breakdown is where most Strongman training injuries occur. Build the habit of stopping before technique fails, not after.`,
  },
  {
    id: 21, category: 'refereeing',
    title: 'Rules Vary: How Strongman Judging Standards Work',
    summary: "Strongman rules are not universal. Understanding what varies — and what to check before each competition — is essential for coaches, athletes, and referees.",
    readTime: '6 min', level: 'Refereeing',
    body: `One of the most important things to understand about Strongman competition is that there is no single universal rulebook. Different federations, organisations, and promoters publish different technical standards. The same event — a log press, a deadlift, a yoke walk — can have different valid completion criteria, different equipment rules, and different judging commands depending on the competition you enter.\n\nThe most variable elements are: what constitutes a valid lockout on overhead pressing events; whether touch-and-go is permitted in deadlift events; whether straps are allowed and on which implements; what body contact rules apply to carry events; whether re-picks from drops are permitted and how they are timed; what height or settling requirements apply to loading events; and how weigh-ins are structured.\n\nFor coaches and athletes, the practical implication is simple: always read the event sheet for each competition and confirm the judging criteria for every event you enter. Do not assume rules carry over from a previous competition, even with the same promoter. If any criteria are unclear, ask the head referee at the athlete briefing before the event starts.\n\nFor referees, this means pre-competition preparation is mandatory. Before each assignment, review the specific event regulations for that competition. Calibrate your decisions with other referees on the panel. If event-specific rules supplement or override your standard training, the event sheet and head referee take precedence. Good refereeing is consistent — but consistency must be built around the correct rules for that competition, not habit from previous assignments.`,
  },
];

const LEVEL_COLOUR: Record<string, string> = {
  Foundation:  'badge-accent',
  Coaching:    'badge-accent',
  Refereeing:  'badge-grey',
  Advanced:    'badge-amber',
  Youth:       'badge-amber',
  Nutrition:   'badge-grey',
};

export default function KnowledgeHub() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Knowledge Hub</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Coaching Intelligence
          </h1>
          <p className="text-es-muted max-w-xl">
            Practical articles, coaching guides, and evidence-based resources for Strongman coaches, referees, and athletes.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'
              }`}
              style={activeCategory === cat.id ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="es-section flex-1">
        <div className="es-container">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-es-muted">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="es-card text-center py-16">
              <p className="text-es-muted mb-2">No articles in this category yet.</p>
              <p className="text-es-subtle text-sm">Content is being developed — check back soon.</p>
              <button onClick={() => setActiveCategory('all')} className="btn-secondary text-sm mt-4">
                View all resources
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(article => (
                <div key={article.id} className="es-card-hover flex flex-col p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={LEVEL_COLOUR[article.level] || 'badge-grey'}>{article.level}</span>
                    <span className="text-xs text-es-subtle">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{article.title}</h3>
                  <p className="text-es-muted text-sm leading-relaxed mb-4">{article.summary}</p>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="btn-secondary text-sm text-center"
                  >
                    Read Article
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section style={{ background: '#111111', borderTop: '1px solid #2C2C2C' }}>
        <div className="es-container py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-1">More resources coming soon</h3>
              <p className="text-es-muted text-sm">The Knowledge Hub grows with every course cohort and coaching insight.</p>
            </div>
            <Link to="/courses" className="btn-primary text-sm flex-shrink-0">Explore Courses</Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Article modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }}
        >
          <div
            className="w-full max-w-2xl rounded-xl overflow-hidden"
            style={{ background: '#1A1A1A', border: '1px solid #2C2C2C', marginBottom: '2rem' }}
          >
            {/* Modal header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2C2C2C' }}>
              <div className="flex items-center gap-3">
                <span className={LEVEL_COLOUR[selectedArticle.level] || 'badge-grey'}>{selectedArticle.level}</span>
                <span className="text-xs text-es-subtle">{selectedArticle.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-es-muted hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: '72vh' }}>
              <h2 className="text-xl font-black text-white mb-3 leading-snug">{selectedArticle.title}</h2>
              <p className="text-es-muted leading-relaxed mb-6 text-sm">{selectedArticle.summary}</p>

              {selectedArticle.body ? (
                <div className="space-y-4">
                  {selectedArticle.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm text-es-muted leading-relaxed">{para}</p>
                  ))}
                  <div style={{ borderTop: '1px solid #2C2C2C', marginTop: '24px', paddingTop: '16px' }}>
                    <p className="text-xs text-es-subtle italic">
                      Content reviewed by the Educate.Strong coaching team. This article is for educational reference — it does not replace qualified instruction or professional coaching.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg p-4 text-sm"
                  style={{ background: 'rgba(164,28,100,0.07)', border: '1px solid rgba(164,28,100,0.15)', color: '#A41C64' }}
                >
                  Full article content for this category is in development. More articles in the{' '}
                  <strong>{CATEGORIES.find(c => c.id === selectedArticle.category)?.label || selectedArticle.category}</strong>{' '}
                  category are also in development.
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end" style={{ borderTop: '1px solid #2C2C2C' }}>
              <button onClick={() => setSelectedArticle(null)} className="btn-secondary text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
