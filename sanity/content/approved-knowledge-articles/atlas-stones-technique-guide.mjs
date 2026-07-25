// Approved source text for this article. Body paragraphs may contain inline
// `{{anchor text|/knowledge/slug}}` links — the update script parses these into
// real Portable Text markDefs. FAQ answers are plain text only (no {{}} syntax).
//
// Slug is deliberately `atlas-stones-technique-guide` — never `atlas-stone-technique`,
// which is a separate, real, currently-live hardcoded article (id 12 in
// frontend/src/data/knowledgeArticles.ts, "Atlas Stone Technique: The Stone-to-Lap
// Phase"). Confirmed via direct Sanity + repo investigation; do not rename.
export default {
  slug: 'atlas-stones-technique-guide',
  title: 'Atlas Stones Technique Guide',
  h1: 'Atlas Stones Technique Guide',
  seoTitle: 'Atlas Stones Technique Guide: How the Lift Works | Educate Strong Academy',
  metaDescription:
    'An evidence-led technique guide to the Atlas Stones lift — the phases, grip considerations, common mistakes, and how it connects to foundational strength movements.',

  body: [
    { type: 'paragraph', text: "Few Strongman events look as simple, and are actually as deceptive, as Atlas Stones. From the crowd, picking a smooth, handle-less boulder off the ground and getting it onto a platform looks like brute force. Up close, it's a precise sequence of phases, and getting that sequence wrong is usually what separates a clean, fast run from a stalled one. This guide breaks the lift down phase by phase, covers what the evidence says about technique and risk, and connects it to the foundational movements worth building before you ever touch a stone." },

    { type: 'h2', text: 'What Are Atlas Stones?' },
    { type: 'paragraph', text: "Atlas Stones is an event where competitors lift heavy, awkward stones and load them onto platforms or barrels. The exact format is set by the competition organiser and varies: some competitions run a timed series of several stones of ascending weight, others use a single stone lifted for repetitions within a time limit, and some use other organiser-specific formats. Unlike most gym equipment, the stones are round, smooth-surfaced, and offer no handles or grip points, which is a large part of what makes the event technically demanding. It's one of the sport's most recognisable events, and is traditionally used as the final, deciding event at World's Strongest Man — though exactly where it falls in a competition's running order is set by the organiser and can differ elsewhere." },

    { type: 'h2', text: 'How the Atlas Stones Lift Works' },
    { type: 'paragraph', text: 'Research on strongman biomechanics has examined the atlas stone lift in detail. Research directly studying this lift (Hindle et al., 2021) describes five phases — recovery, initial grip, first pull, lap, and second pull. For coaching purposes, this guide groups those into four practical stages below — Approach, Lap Position, Extension, and Loading Movement — as a simplified breakdown based on that research, not a restatement of the paper\'s exact phase model.' },

    { type: 'h3', text: 'The Approach' },
    { type: 'paragraph', text: 'The athlete straddles the stone and hugs it close to the torso, using a grip similar in position to a Romanian deadlift starting point, wrapping the arms around the stone rather than gripping a bar.' },
    { type: 'h3', text: 'The Lap Position' },
    { type: 'paragraph', text: 'The stone is drawn up and rests briefly against the lap or thighs. This is a transitional position, not a pause for its own sake, bridging the initial pull from the ground and the final drive upward.' },
    { type: 'h3', text: 'The Extension' },
    { type: 'paragraph', text: 'From the lap position, the athlete drives through an explosive hip and knee extension, moving through a quarter-squat-like position toward full extension, generating the power needed to get the stone up and moving toward the platform.' },
    { type: 'h3', text: 'The Loading Movement' },
    { type: 'paragraph', text: 'The final phase deposits the stone onto the platform or barrel. Some lifters use a "one-motion" (or "zero-lap") technique, moving the stone from the ground to the platform in one continuous action rather than resting on the lap. Research directly studying this technique found it was used by only a minority of the athletes studied, and suggested it may suit taller athletes lifting comparatively lighter stones, likely because it can reduce total repetition time. It\'s an advanced option worth being aware of rather than an automatically-better method — which technique suits best depends on the individual athlete, the specific stone, platform height, and competition setup, and most lifters use the lap transition described above.' },

    { type: 'h2', text: 'Grip and Loading Considerations' },
    { type: 'paragraph', text: 'Because the stones are smooth and offer no handles, grip is one of the defining challenges of the event. Where permitted, tacky can improve adhesion between the athlete and the stone. Grip-aid rules vary by competition and event (see {{our guide to Strongman competition rules|/knowledge/strongman-competition-rules-explained}}), so it\'s worth confirming what\'s allowed before relying on it.' },

    { type: 'h2', text: 'Common Mistakes' },
    { type: 'paragraph', text: 'Rushing the lap transition before the hips and torso are properly set is a common technical error, and it usually shows up as an athlete "muscling" the stone up with the arms instead of driving it with the hips and legs. Gripping and hugging the stone too loosely, or too late in the approach, has the same effect: it costs control right when the lift needs it most.' },

    { type: 'h2', text: 'Safety Considerations' },
    { type: 'paragraph', text: "The atlas stone lift is noted in the biomechanics literature as one of the more mechanically demanding strongman movements. That's not a reason to avoid it, but it is a reason to treat technique and progression seriously rather than rushing toward heavier stones before the movement pattern is consistent. As with any strength movement, this describes documented risk considerations, not a guarantee about what will or won't happen to any individual lifter." },

    { type: 'h2', text: 'Building Toward Atlas Stones' },
    { type: 'h3', text: 'Foundational Movements' },
    { type: 'paragraph', text: 'Research directly comparing the atlas stone lift to other movements has drawn comparisons to the {{Deadlift|/events/deadlift}} and the front squat, particularly in the initial pulling action and the knee-and-hip drive used in the final extension. Beyond that direct comparison, many coaches also include Zercher squat work, general hip extension work, and bracing/core work as practical preparation exercises — these are coaching recommendations based on movement similarity and coaching experience, not claims backed by a specific research citation, and are worth treating as such.' },
    { type: 'h3', text: 'Beginner Progressions' },
    { type: 'paragraph', text: "Rather than starting with a heavy, full-sized stone, beginners typically benefit from practising the hip-hinge-to-extension pattern with more manageable loads first, building comfort with the lap transition before adding weight. This article isn't a training programme, but {{our guide to Strongman for beginners|/knowledge/strongman-for-beginners}} covers how to build a general strength foundation before introducing implements like this one." },
  ],

  faq: [
    { question: 'How heavy are Atlas Stones?', answer: 'Stone weights and diameters vary by competition and are set by the organiser, typically increasing across a set of stones used within one event.' },
    { question: 'Do I need special equipment to practise Atlas Stones?', answer: "Some grip aid, such as tacky, is commonly used where permitted because of the stones' smooth surface, but building the underlying strength pattern can start with standard gym equipment such as a barbell or a Zercher-hold implement." },
    { question: 'Is the Atlas Stones lift dangerous?', answer: "It's documented in the biomechanics literature as one of the more mechanically demanding strongman movements, which is a reason to prioritise technique and gradual progression rather than a reason to avoid it altogether." },
    { question: 'What muscles does the Atlas Stones lift use?', answer: "It's a full-body movement, drawing heavily on the hips, legs, back, and grip, with the lap-position transition and final extension being the most technically important phases." },
  ],

  cta: {
    ctaText: 'Explore the Atlas Stones event pages in our Event Library, or learn more about our coaching and event education pathways →',
    destinationUrl: '/events/atlas-stones',
  },

  publicReferences: [
    { authorsOrOrganisation: 'Hindle, B., Lorimer, A., Winwood, P., & Keogh, J. W. L.', title: 'The Biomechanics and Applications of Strongman Exercises: a Systematic Review', publicationOrSource: 'Sports Medicine – Open, 5(1), 49', year: '2019', doi: '10.1186/s40798-019-0222-z', url: 'https://doi.org/10.1186/s40798-019-0222-z', accessDate: null, notesForDisplay: '' },
    { authorsOrOrganisation: 'Hindle, B., Lorimer, A., Winwood, P., Brimm, D., & Keogh, J. W. L.', title: 'The biomechanical characteristics of the strongman atlas stone lift', publicationOrSource: 'PeerJ, 9, e12066', year: '2021', doi: '10.7717/peerj.12066', url: 'https://doi.org/10.7717/peerj.12066', accessDate: null, notesForDisplay: '' },
    { authorsOrOrganisation: "The World's Strongest Man", title: 'Atlas Stones (official event page)', publicationOrSource: "The World's Strongest Man", year: '', doi: '', url: 'https://www.theworldsstrongestman.com/events/atlas-stones/', accessDate: '2026-07-25', notesForDisplay: '' },
  ],

  author: null,
  reviewedBy: null,
  publishedDate: null,
  lastReviewedDate: null,
  pathway: 'Event Pathway',
  clusterOrder: 2,
  approvalStatus: 'approvedForPublicRelease',
};
