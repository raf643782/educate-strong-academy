import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Exercise {
  id: number;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  purpose: string;
  keyPoints: string[];
  mistakes: string[];
  progression: string;
  relatedEvents: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: 1, name: 'Log Press', category: 'press',
    difficulty: 'Intermediate',
    equipment: ['Log implement', 'Chalk', 'Collars'],
    purpose: 'The primary overhead pressing event in Strongman. Tests shoulder strength, stability, and the ability to clean and press a non-standard implement.',
    keyPoints: ['Set up with feet shoulder-width', 'Clean the log to the chest position — elbows up', 'Brace hard before the dip-drive', 'Drive through the heels, press while extending the hips', 'Lock out fully overhead — hold for judge signal'],
    mistakes: ['Elbows dropping on the clean', 'Not bracing the core before the press', 'Hyperextending the lower back', 'Soft lockout — not holding for the signal'],
    progression: 'Start with strict press technique before adding leg drive. Build from barbell OHP → push press → log press with empty log → loaded log.',
    relatedEvents: ['Viking Press', 'Axle Press', 'Circus Dumbbell'],
  },
  {
    id: 2, name: 'Axle Clean & Press', category: 'press',
    difficulty: 'Intermediate',
    equipment: ['Axle bar (50mm)', 'Chalk'],
    purpose: 'Overhead press using a thick 50mm axle bar that cannot be hooked. Tests grip strength alongside pressing ability.',
    keyPoints: ['Continental or one-motion clean depending on format', 'Grip the axle with full hand — no hook grip', 'Keep wrists strong and neutral', 'Can be pressed strict, push press, or jerk depending on event rules'],
    mistakes: ['Allowing wrist flexion under load', 'Losing grip mid-clean', 'Not checking event rules for press style'],
    progression: 'Build grip strength with thick bar work. Practice continental clean mechanics before loading heavily.',
    relatedEvents: ['Log Press', 'Circus Dumbbell'],
  },
  {
    id: 3, name: 'Atlas Stone to Platform', category: 'loading',
    difficulty: 'Advanced',
    equipment: ['Atlas stones (various weights)', 'Tacky', 'Sleeves or tacky spray', 'Platform'],
    purpose: 'Loading a concrete sphere onto a platform at a specified height. One of Strongman\'s most iconic events requiring hip strength, grip, and technique.',
    keyPoints: ['Position feet close to stone', 'Load stone into the lap using hip drive', 'Re-grip high on the stone', 'Drive hips through to extend and place on platform', 'Control the descent away from the stone'],
    mistakes: ['Pulling with the back instead of hips', 'Not loading into the lap properly', 'Losing grip at the top of the lift', 'Standing too far from the stone at setup'],
    progression: 'Begin with a sandbag to platform drill. Progress to light stones with good tacky before increasing weight.',
    relatedEvents: ['Stone Over Bar', 'Keg Load', 'Sandbag Load'],
  },
  {
    id: 4, name: 'Yoke Carry', category: 'carry',
    difficulty: 'Intermediate',
    equipment: ['Yoke frame'],
    purpose: 'Carrying a loaded yoke frame for distance against time. Tests full-body strength, core stability, and conditioning.',
    keyPoints: ['Position the bar slightly below the traps', 'Brace the core throughout', 'Take short, quick steps', 'Keep the yoke level — avoid rocking', 'Maintain head position and look forward'],
    mistakes: ['Steps too long — causes rocking', 'Yoke positioned too high or too low', 'Looking down and rounding the back', 'Losing tension during turns'],
    progression: 'Begin unloaded to feel the implement. Add load progressively. Practice turning before adding competition-level weights.',
    relatedEvents: ["Farmer's Carry", 'Frame Carry'],
  },
  {
    id: 5, name: "Farmer's Carry", category: 'carry',
    difficulty: 'Beginner',
    equipment: ["Farmer's handles", 'Chalk'],
    purpose: "Classic carry event using two loaded handles. Tests grip endurance, core stability, and conditioning over distance.",
    keyPoints: ['Pick up with a strong hip hinge', 'Maintain upright posture throughout', 'Moderate stride length — not too long', 'Grip hard and maintain throughout', 'Controlled turn at the end'],
    mistakes: ['Leaning forward under load', 'Steps too wide causing lateral sway', 'Gripping too early before the pick', 'Rushing the turn and losing control'],
    progression: "Start with dumbbell or kettlebell carries, progress to farmer's handles at bodyweight, then increase.",
    relatedEvents: ['Yoke Carry', 'Frame Carry', 'Suitcase Carry'],
  },
  {
    id: 6, name: 'Deadlift', category: 'deadlift',
    difficulty: 'Beginner',
    equipment: ['Barbell', 'Chalk', 'Plates', 'Belt (optional)'],
    purpose: 'Foundation of Strongman pulling strength. Tests posterior chain from floor to lockout.',
    keyPoints: ['Bar over mid-foot at setup', 'Brace before initiating the pull', 'Maintain neutral spine', 'Drive through the floor — do not jerk', 'Lock hips and knees simultaneously at top', 'Control the descent'],
    mistakes: ['Bar drifting forward from the body', 'Jerking the bar off the floor', 'Hyperextending at lockout', 'Rounding the lower back under heavy loads'],
    progression: 'Begin with Romanian deadlift to build hinge pattern. Progress to conventional, then specifics such as axle or elevated.',
    relatedEvents: ['Axle Deadlift', 'Car Deadlift', '18-inch Deadlift'],
  },
  {
    id: 7, name: 'Axle Deadlift', category: 'deadlift',
    difficulty: 'Intermediate',
    equipment: ['Axle bar (50mm)', 'Chalk'],
    purpose: 'Deadlift performed with a thick axle bar — significantly increases grip demand. Grip often becomes the limiting factor.',
    keyPoints: ['Double overhand grip required in most formats', 'Chalk up thoroughly', 'Same hip hinge as conventional — brace harder', 'Straps not always permitted — check rules', 'Grip failure comes before strength failure for many athletes'],
    mistakes: ['Relying on straps in training — build grip strength raw', 'Neglecting grip-specific work in programming'],
    progression: 'Build raw grip strength with thick bar holds, plate pinches, and high-rep axle work before competing.',
    relatedEvents: ['Conventional Deadlift', 'Car Deadlift'],
  },
  {
    id: 8, name: 'Keg Load', category: 'loading',
    difficulty: 'Intermediate',
    equipment: ['Kegs (various weights)', 'Platform'],
    purpose: 'Loading metal kegs onto a platform or over a bar for reps. Tests loading ability with irregular, shifting implements.',
    keyPoints: ['Get underneath the keg', 'Hip load the keg to the chest', 'Maintain grip on the keg body', 'Extend to load onto platform', 'Reset quickly between reps'],
    mistakes: ['Trying to grip only the top rim', 'Not getting under the keg', 'Rushing between reps without resetting'],
    progression: 'Begin with lighter kegs and practice the loading movement pattern before adding reps or time pressure.',
    relatedEvents: ['Atlas Stones', 'Sandbag Load', 'Barrel Load'],
  },
  {
    id: 9, name: 'Frame Carry', category: 'carry',
    difficulty: 'Intermediate',
    equipment: ['Frame (handles)', 'Chalk'],
    purpose: 'Carrying a loaded frame with two handles — similar to a yoke but load hangs lower, changing the challenge.',
    keyPoints: ['Stand inside the frame, pick up with hip extension', 'Core braced throughout', 'Consistent stride length', 'Frame will swing if steps are uneven'],
    mistakes: ['Uneven stride causing the frame to swing', 'Losing core tension causing lateral lean'],
    progression: 'Progress from farmer\'s handles to frame carry. The hanging load changes balance requirements.',
    relatedEvents: ["Farmer's Carry", 'Yoke Carry'],
  },
  {
    id: 10, name: 'Circus Dumbbell', category: 'press',
    difficulty: 'Advanced',
    equipment: ['Circus dumbbell (60mm handle, large head)'],
    purpose: 'A large, single asymmetric dumbbell pressed overhead. Extremely demanding on shoulder stability and lat engagement.',
    keyPoints: ['Continental clean or lap clean to shoulder', 'Keep the elbow in — do not flare', 'Lat locked in throughout the press', 'Full lockout with grip secure'],
    mistakes: ['Elbow flaring out under load', 'Losing lat tension causing lateral drift', 'Not hip cleaning the implement'],
    progression: 'Build single-arm pressing strength before loading. Kettlebell press and strict DB press are good precursors.',
    relatedEvents: ['Log Press', 'Axle Press'],
  },
  {
    id: 11, name: 'Sandbag Over Bar', category: 'loading',
    difficulty: 'Beginner',
    equipment: ['Sandbag (various weights)', 'Bar or frame'],
    purpose: 'Loading a sandbag over a crossbar for reps. Often used as a beginner-friendly loading event due to the forgiving nature of the implement.',
    keyPoints: ['Get low and bear hug the bag', 'Hip drive to lift', 'Drive the bag over the bar — do not carry', 'Reset quickly'],
    mistakes: ['Trying to lift with the back rather than hips', 'Letting the bag slide down before throwing'],
    progression: 'Begin with lighter sandbags and focus on hip drive. Excellent for introducing loading mechanics to new athletes.',
    relatedEvents: ['Keg Load', 'Atlas Stones'],
  },
  {
    id: 12, name: 'Sled Drag', category: 'conditioning',
    difficulty: 'Beginner',
    equipment: ['Sled', 'Harness or rope', 'Chalk (optional)'],
    purpose: 'Pulling a loaded sled for distance. Excellent for conditioning, leg drive, and loaded carry preparation.',
    keyPoints: ['Lean into the harness — angle matters', 'Drive with the legs, not the back', 'Short powerful steps under heavy loads', 'Long strides for speed events'],
    mistakes: ['Standing too upright under heavy loads', 'Using the back instead of legs'],
    progression: 'Begin unloaded to learn mechanics. Progress systematically — excellent accessory for all pathways.',
    relatedEvents: ['Vehicle Pull', 'Harness Drag'],
  },
  {
    id: 13, name: 'Romanian Deadlift', category: 'accessory',
    difficulty: 'Beginner',
    equipment: ['Barbell or dumbbells'],
    purpose: 'Hip hinge pattern builder. Essential posterior chain developer used in Strongman programming as a primary accessory.',
    keyPoints: ['Hinge at the hip — not a squat', 'Maintain neutral spine throughout', 'Feel the hamstring stretch', 'Bar stays close to the body', 'Do not round at the bottom'],
    mistakes: ['Squatting instead of hinging', 'Rounding the lower back at the bottom', 'Bar drifting forward from the body'],
    progression: 'Master bodyweight RDL before adding load. Foundation movement for all Strongman pulling events.',
    relatedEvents: ['Deadlift', 'Atlas Stones', 'All loading events'],
  },
  {
    id: 14, name: 'Overhead Press', category: 'press',
    difficulty: 'Beginner',
    equipment: ['Barbell'],
    purpose: 'Foundation pressing movement. Builds vertical pressing strength needed for all log, axle, and circus dumbbell events.',
    keyPoints: ['Bar starts at upper chest', 'Brace core — glutes tight', 'Press in a vertical path', 'Full lockout overhead', 'Controlled descent back to start'],
    mistakes: ['Hyperextending the lower back', 'Not achieving full lockout', 'Pressing at an angle rather than vertically'],
    progression: 'Begin with strict press before introducing leg drive (push press). Foundation for all overhead events.',
    relatedEvents: ['Log Press', 'Axle Press', 'Circus Dumbbell'],
  },
  {
    id: 15, name: 'Arm Over Arm Pull', category: 'pull',
    difficulty: 'Intermediate',
    equipment: ['Rope', 'Vehicle or sled'],
    purpose: 'Pulling a vehicle or sled toward you hand over hand while seated. Tests upper body pulling strength and grip.',
    keyPoints: ['Sit low with feet braced against footplates', 'Pull in a straight line — no twisting', 'Consistent rhythm — hand over hand', 'Keep the core engaged throughout'],
    mistakes: ['Pulling at an angle rather than straight', 'Breaking grip rhythm under fatigue'],
    progression: 'Build lat and bicep pulling strength with rows and pull-ups. Practice the motion with a lighter sled before competition loads.',
    relatedEvents: ['Vehicle Pull', 'Sled Drag'],
  },
  {
    id: 16, name: 'Hip Thrust', category: 'accessory',
    difficulty: 'Beginner',
    equipment: ['Barbell', 'Bench or box', 'Pad'],
    purpose: 'Primary glute builder. Develops hip extension power essential for deadlifts, carries, and loading events.',
    keyPoints: ['Upper back on bench, feet flat on floor', 'Drive through the heels', 'Full hip extension at top — squeeze glutes', 'Controlled descent'],
    mistakes: ['Not reaching full hip extension', 'Driving through the toes instead of heels', 'Hyperextending the lower back at top'],
    progression: 'Bodyweight first, then add barbell. Essential in programming for all Strongman athletes.',
    relatedEvents: ['All deadlift and loading events'],
  },
];

const CATEGORIES_FILTER = [
  { id: 'all', label: 'All' },
  { id: 'press', label: 'Press Events' },
  { id: 'deadlift', label: 'Deadlift Events' },
  { id: 'carry', label: 'Carry Events' },
  { id: 'loading', label: 'Loading Events' },
  { id: 'pull', label: 'Pull Events' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'conditioning', label: 'Conditioning' },
];

const DIFF_BADGE: Record<string, string> = {
  Beginner: 'badge-grey',
  Intermediate: 'badge-accent',
  Advanced: 'badge-amber',
};

export default function ExerciseLibrary() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = activeCategory === 'all'
    ? EXERCISES
    : EXERCISES.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-navbar es-grit" style={{ background: '#141414', borderBottom: '1px solid #2C2C2C', position: 'relative' }}>
        <div className="es-container py-16">
          <p className="es-label mb-3">Exercise Library</p>
          <h1 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.04em' }}>
            Technique & Coaching Reference
          </h1>
          <p className="text-es-muted max-w-xl">
            Coaching cues, technique breakdowns, common mistakes, and progression pathways for Strongman events and accessory work.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }}>
        <div className="es-container py-4 flex flex-wrap gap-2">
          {CATEGORIES_FILTER.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${activeCategory === cat.id ? 'text-white' : 'text-es-muted hover:text-white border border-es-grey-dark hover:border-es-accent'}`}
              style={activeCategory === cat.id ? { background: '#A41C64', border: '1px solid rgba(164,28,100,0.6)' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="es-section flex-1">
        <div className="es-container">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-es-muted">
              {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(ex => (
              <div key={ex.id} className="es-card-hover flex flex-col p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={DIFF_BADGE[ex.difficulty] || 'badge-grey'}>{ex.difficulty}</span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug mb-2 flex-1">{ex.name}</h3>
                <p className="text-es-muted text-xs leading-relaxed mb-4 line-clamp-2">{ex.purpose}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {ex.equipment.slice(0, 2).map(eq => (
                    <span key={eq} className="badge-grey text-xs">{eq}</span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedExercise(ex)}
                  className="btn-secondary text-xs text-center py-2"
                >
                  View Exercise
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedExercise(null); }}
        >
          <div
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{ background: '#1A1A1A', border: '1px solid #3C3C3C', boxShadow: '0 20px 80px rgba(0,0,0,0.9)', marginBottom: '2rem' }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6" style={{ borderBottom: '1px solid #2C2C2C', background: 'linear-gradient(135deg, rgba(164,28,100,0.12), transparent)' }}>
              <div>
                <p className="es-label mb-1">{CATEGORIES_FILTER.find(c => c.id === selectedExercise.category)?.label || selectedExercise.category}</p>
                <h2 className="text-2xl font-black text-white">{selectedExercise.name}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={DIFF_BADGE[selectedExercise.difficulty]}>{selectedExercise.difficulty}</span>
                  {selectedExercise.equipment.slice(0, 1).map(eq => (
                    <span key={eq} className="badge-grey">{eq}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded text-es-muted hover:text-white transition-colors flex-shrink-0"
                style={{ background: '#2A2A2A' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">
              {/* Purpose */}
              <div>
                <p className="es-label mb-2">Purpose</p>
                <p className="text-es-muted text-sm leading-relaxed">{selectedExercise.purpose}</p>
              </div>

              {/* Key coaching points */}
              <div>
                <p className="es-label mb-3">Key Coaching Points</p>
                <ul className="space-y-2">
                  {selectedExercise.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                      <span className="font-black text-xs mt-0.5 flex-shrink-0" style={{ color: '#A41C64' }}>{i + 1}</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common mistakes */}
              <div>
                <p className="es-label mb-3">Common Mistakes</p>
                <ul className="space-y-2">
                  {selectedExercise.mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-es-muted">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#E19A47' }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progression */}
              <div className="es-card-grey p-4 rounded-lg">
                <p className="es-label mb-2">Progression Pathway</p>
                <p className="text-sm text-es-muted leading-relaxed">{selectedExercise.progression}</p>
              </div>

              {/* Equipment */}
              <div>
                <p className="es-label mb-2">Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.equipment.map(eq => (
                    <span key={eq} className="badge-grey">{eq}</span>
                  ))}
                </div>
              </div>

              {/* Related events */}
              {selectedExercise.relatedEvents.length > 0 && (
                <div>
                  <p className="es-label mb-2">Related Events</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.relatedEvents.map(ev => (
                      <span key={ev} className="badge-accent">{ev}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2" style={{ borderTop: '1px solid #2C2C2C' }}>
                <p className="text-xs text-es-subtle italic">
                  Placeholder content — exercise details will be reviewed and confirmed by Educate.Strong coaching team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
