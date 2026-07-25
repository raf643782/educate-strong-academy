// Approved source text for this article. Body paragraphs may contain inline
// `{{anchor text|/knowledge/slug}}` links — the update script parses these into
// real Portable Text markDefs. FAQ answers are plain text only (no {{}} syntax).
//
// Two candidate "final" versions of this article existed in the editorial
// review conversation (an earlier complete draft with 5 FAQs, and a later
// condensed "formal confirmation" paraphrase with no FAQ section). The user
// confirmed use of the earlier, complete, explicitly-approved-in-the-moment
// version below.
export default {
  slug: 'strongman-competition-rules-explained',
  title: 'Strongman Competition Rules Explained',
  h1: 'Strongman Competition Rules Explained',
  seoTitle: 'Strongman Competition Rules Explained (Plain English) | Educate Strong Academy',
  metaDescription:
    'A plain English guide to how Strongman competitions are scored and judged, and why exact rules always depend on the specific federation or organiser.',

  body: [
    { type: 'paragraph', text: "Strongman rules can look confusing at first, and the reason is simple: there isn't one rulebook behind them. This guide separates what's genuinely common across the sport, what's specific to individual federations, and what to actually check before you compete or officiate." },

    { type: 'h2', text: "Why There's No Single Strongman Rulebook" },
    { type: 'paragraph', text: "As covered in {{our guide to what Strongman is|/knowledge/what-is-strongman}}, the sport is run by multiple separate organisations — World's Strongest Man (via the Giants Live touring series), Strongman Corporation, United States Strongman, and others — each publishing and enforcing their own rules. That's why the same-sounding rule, like what counts as a valid deadlift lockout, can look different from one competition to the next. Nothing below should be read as one universal rulebook; it's a guide to the concepts, with real examples of how specific organisers apply them." },

    { type: 'h2', text: 'How Scoring Generally Works' },
    { type: 'paragraph', text: 'Common pattern: many Strongman competitions rank athletes based on their performance in each event, summed or compared across the whole competition to determine the overall result.' },
    { type: 'paragraph', text: "Example — Giants Live / World's Strongest Man: in their group-stage format, the top-ranked athlete in each heat carries forward 10 points into the final, the second-ranked 9 points, and so on down to 1 point for the lowest-ranked finalist — a relative-placement system rather than a fixed points-per-performance scale." },
    { type: 'paragraph', text: 'What varies: the exact scoring method, how points are weighted, and how ties are handled are all set by the organiser, and can differ significantly between one competition and another.' },

    { type: 'h2', text: "What Happens If You Don't Complete an Event in Time" },
    { type: 'paragraph', text: "This is one area where it's easy to over-generalise, so it's worth being precise. Organisers use several different methods to rank athletes who don't fully complete a timed event, including: ranking by repetitions completed; ranking by distance covered; ranking by objects successfully loaded; ranking by fastest completion time (for athletes who did finish); awarding partial credit for partial completion; or a method specific to that competition's own published rules." },
    { type: 'paragraph', text: "Example — Giants Live / World's Strongest Man: in their Carry & Hoist event, an athlete who doesn't complete the course is still ranked, based on the distance they covered. In the same competition's 18-Inch Deadlift (a rising-bar format), a missed lift instead results in elimination from that event. These are two different mechanisms from the same organiser — a reminder that even within one federation, the handling of an incomplete attempt depends on the specific event's own rules, not a single blanket policy." },
    { type: 'paragraph', text: 'What varies: whether an incomplete attempt scores zero, partial credit, or elimination is decided event-by-event and competition-by-competition. Always check the specific event sheet rather than assuming one outcome.' },

    { type: 'h2', text: 'What "Good Lift" and "No Rep" Mean' },
    { type: 'paragraph', text: 'Common pattern: across strength sports generally, judges classify each attempt as either valid ("good lift") or invalid ("no rep" or "no lift"), based on whether the athlete met that event\'s technical standard — for example, full lockout on a press or clearing a bar on a toss.' },
    { type: 'paragraph', text: 'What varies: the technical standard itself, and exactly what\'s required to meet it, is set by the competition or federation running that specific event. A "good lift" in one competition isn\'t guaranteed to match the standard at another, so this phrase describes a general judging concept, not one fixed universal rule.' },

    { type: 'h2', text: 'Commands and Communication' },
    { type: 'paragraph', text: 'Common pattern: judges commonly use standardised signals to mark key moments in an attempt, so athletes know clearly whether an effort counted.' },
    { type: 'paragraph', text: 'What varies: the specific command and what triggers it depends on the event and organiser. A "down" command may apply to some lifts once a lockout standard is met; other events instead use a finish line being crossed, an implement reaching a platform, a successful clearance over a bar, a timekeeper\'s signal, or another event-specific standard. Athletes are generally expected to wait for the relevant signal rather than acting on their own judgement of whether an attempt is complete, since acting early can itself be treated as a fault under many competitions\' rules.' },

    { type: 'h2', text: 'Equipment Rules' },
    { type: 'paragraph', text: "Common pattern: some form of supportive gear and chalk is typically addressed in every competition's rules, though what's specifically permitted differs." },
    { type: 'paragraph', text: 'Example — Strongman Corporation: their published rules for sanctioned events permit belts, knee sleeves or wraps, supportive suits, and chalk — but explicitly prohibit tacky or any sticky substance, and straps of any kind.' },
    { type: 'paragraph', text: "What varies: items such as belts, sleeves, wraps, straps, suits, chalk, tacky, footwear, and other grip aids are treated differently by different organisers, and sometimes differently between events at the same competition. No single item on this list should be assumed universally allowed or prohibited — the Strongman Corporation example above shows a specific, real case of a grip aid (tacky) that's commonly used elsewhere being explicitly banned. Always confirm equipment rules against the specific event sheet or rulebook you're working with." },

    { type: 'h2', text: 'Time Limits' },
    { type: 'paragraph', text: 'Many events run within a set time limit, whether that\'s a single attempt (such as a loading event) or a maximum-repetition event within a fixed window. Even events with the same name can carry different time limits between competitions, since the organiser decides this too.' },

    { type: 'h2', text: 'How Ties Are Handled' },
    { type: 'paragraph', text: "What varies: whether and how ties are broken is set by each organiser's own rules, and isn't consistent across the sport. Some competitions can finish extremely close on points without a formal tie-break being needed (recent Giants Live finals have been decided by fractional point margins), but the exact tie-break method, where one exists, should be checked against the specific competition's own published rules rather than assumed." },

    { type: 'h2', text: 'Penalties' },
    { type: 'paragraph', text: 'Failing to meet an event\'s technical standard typically results in a "no rep" for that attempt. More serious faults can cost an athlete points for that event entirely, or result in elimination from it, depending on the specific competition\'s rules — see the time-limit examples above for how this can differ even within one organiser.' },

    { type: 'h2', text: 'Athlete Responsibilities' },
    { type: 'paragraph', text: "The competitors who avoid unnecessary penalties are usually the ones who've actually read the specific event sheet and technical standards for the competition they've entered, rather than assuming a format from a different competition will carry over. That, combined with following the announced equipment rules and responding promptly to judges' commands, covers most of what's expected of you as a competitor." },
  ],

  faq: [
    { question: 'Is there one official Strongman rulebook?', answer: "No. Different federations and competition organisers set their own rules, so there's no single official rulebook covering the whole sport." },
    { question: 'What does "no rep" mean in Strongman?', answer: "It means a specific attempt didn't meet that event's technical standard, so it doesn't count, though the athlete isn't necessarily disqualified from the whole event." },
    { question: 'Do all competitions use the same scoring system?', answer: "No — scoring methods vary by organiser. Giants Live/World's Strongest Man, for example, uses a relative-placement points system; other organisers may score differently, and exact tie-handling rules are set by the organiser too." },
    { question: "What happens if I don't finish an event in time?", answer: 'It depends entirely on the event and organiser. Some events rank incomplete attempts by distance or reps achieved; others eliminate the athlete from that event. Always check the specific competition\'s rules rather than assuming.' },
    { question: 'Are the same implements used at every competition?', answer: "No, event and implement selection is set by each competition's organiser, as covered in our guide to Strongman events." },
  ],

  cta: {
    ctaText: "Understanding the rules is part of building real Strongman knowledge. Explore Educate Strong Academy's Strongman education pathways →",
    destinationUrl: '/coaching',
  },

  publicReferences: [
    { authorsOrOrganisation: 'Strongman Corporation', title: 'FAQ, Athlete Info Overview, and published event equipment rules', publicationOrSource: 'Strongman Corporation', year: '', doi: '', url: 'https://strongmancorporation.com/', accessDate: '2026-07-25', notesForDisplay: '' },
    { authorsOrOrganisation: 'Giants Live', title: 'World\'s Strongest Man — Events & Points System', publicationOrSource: 'Giants Live', year: '', doi: '', url: 'https://giants-live.com/wsm/worlds-strongest-man-2025-preview-the-events-points-system/', accessDate: '2026-07-25', notesForDisplay: '' },
  ],

  author: null,
  reviewedBy: null,
  publishedDate: null,
  lastReviewedDate: null,
  pathway: 'Competition Pathway',
  clusterOrder: 1,
  approvalStatus: 'approvedForPublicRelease',
};
