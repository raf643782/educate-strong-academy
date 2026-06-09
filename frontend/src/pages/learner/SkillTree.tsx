/**
 * SkillTree — LMS Coaching Pathway · Constellation Edition
 * Route: /dashboard/pathway (protected)
 *
 * Design: Geometric diamond nodes on a deep-space SVG constellation canvas.
 * Skyrim-style immersion adapted for a premium Strongman coaching LMS.
 * Dark atmosphere · Magenta accents · SVG glow lines · Star field.
 *
 * Visual metaphor chosen: Constellation + geometric hybrid
 *   – Diamond nodes feel architectural and precise (not game-y)
 *   – SVG glow lines create the Skyrim constellation feeling
 *   – Star field and nebula blobs give depth without being cheesy
 *   – Strongman icons inside each node ground it in the sport
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

/* ═══════════════════════════════════════════════════════ TYPES ═══ */

type NodeStatus = 'completed' | 'in-progress' | 'available' | 'locked';

interface SkillNode {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  status: NodeStatus;
  col: number;    // 0–4
  row: number;    // 0–5 for L1; isCPD nodes use fixed Y
  connects: string[];
  isCPD?: boolean;
  category?: string;
}

/* ═══════════════════════════════════════════════════════ DATA ════ */

const NODES: SkillNode[] = [
  /* ── Root ─────────────────────────────────────── */
  {
    id: 'foundation',
    title: 'Level 1 Foundation',
    shortTitle: 'Foundation',
    description:
      'Your entry point into the Strongman coaching pathway. Programme overview, tutor introductions, and learning expectations.',
    icon: '🏋',
    status: 'completed',
    col: 2, row: 0,
    connects: ['intro', 'screening'],
    category: 'Core',
  },
  /* ── Row 1 ─────────────────────────────────────── */
  {
    id: 'intro',
    title: 'Introduction to Strongman Coaching',
    shortTitle: 'SM Intro',
    description:
      'History, philosophy, and core principles of Strongman. What separates it from other strength sports and why it demands specialist coaching.',
    icon: '📋',
    status: 'completed',
    col: 1, row: 1,
    connects: ['session'],
    category: 'Foundation',
  },
  {
    id: 'screening',
    title: 'Athlete Screening & Safety',
    shortTitle: 'Screening',
    description:
      'How to assess readiness, screen for injury risk, and build safe training environments for Strongman athletes of all levels.',
    icon: '🛡',
    status: 'completed',
    col: 3, row: 1,
    connects: ['session'],
    category: 'Safety',
  },
  /* ── Row 2 ─────────────────────────────────────── */
  {
    id: 'session',
    title: 'Session Structure',
    shortTitle: 'Sessions',
    description:
      'Planning, delivering, and reviewing Strongman sessions. Warm-up protocols, event sequencing, and coaching flow.',
    icon: '📅',
    status: 'in-progress',
    col: 2, row: 2,
    connects: ['log', 'axle', 'deadlift', 'farmer', 'yoke'],
    category: 'Delivery',
  },
  /* ── Row 3 — Core Events ───────────────────────── */
  {
    id: 'log',
    title: 'Log Press Fundamentals',
    shortTitle: 'Log Press',
    description:
      'Technique, loading progressions, and coaching cues for the log press — the signature Strongman overhead event.',
    icon: '🪵',
    status: 'available',
    col: 0, row: 3,
    connects: ['practical'],
    category: 'Events',
  },
  {
    id: 'axle',
    title: 'Axle Press Fundamentals',
    shortTitle: 'Axle Press',
    description:
      'Axle press mechanics, grip differences, and continental clean coaching for axle bar events.',
    icon: '⚡',
    status: 'available',
    col: 1, row: 3,
    connects: ['practical'],
    category: 'Events',
  },
  {
    id: 'deadlift',
    title: 'Deadlift Fundamentals',
    shortTitle: 'Deadlift',
    description:
      'Strongman deadlift variations: silver dollar, car deadlift, frame deadlift. Technique, coaching cues, and loading strategy.',
    icon: '🔩',
    status: 'locked',
    col: 2, row: 3,
    connects: ['practical'],
    category: 'Events',
  },
  {
    id: 'farmer',
    title: "Farmer's Walk Fundamentals",
    shortTitle: "Farmer's Walk",
    description:
      'Grip, turn mechanics, and speed work for farmer walks. Foot placement and competition-specific coaching strategies.',
    icon: '🚶',
    status: 'locked',
    col: 3, row: 3,
    connects: ['yoke'],
    category: 'Events',
  },
  {
    id: 'yoke',
    title: 'Yoke Fundamentals',
    shortTitle: 'Yoke',
    description:
      'Load placement, leg drive, and visual cue techniques for the yoke. Common errors and correction strategies.',
    icon: '⚖',
    status: 'locked',
    col: 4, row: 3,
    connects: ['stones'],
    category: 'Events',
  },
  /* ── Row 4 ─────────────────────────────────────── */
  {
    id: 'stones',
    title: 'Atlas Stones Fundamentals',
    shortTitle: 'Atlas Stones',
    description:
      'The pinnacle Strongman event. Tacky application, lap mechanics, and safe loading progressions for the atlas stone.',
    icon: '🪨',
    status: 'locked',
    col: 3, row: 4,
    connects: ['practical'],
    category: 'Events',
  },
  {
    id: 'practical',
    title: 'Practical Coaching Skills',
    shortTitle: 'Practical',
    description:
      'On-floor delivery, communication styles, feedback loops, and real-time athlete support during Strongman training sessions.',
    icon: '🎯',
    status: 'locked',
    col: 1, row: 4,
    connects: ['assessment'],
    category: 'Delivery',
  },
  /* ── Row 5 — Assessment ────────────────────────── */
  {
    id: 'assessment',
    title: 'Assessment Preparation',
    shortTitle: 'Assessment',
    description:
      'Preparing for the formal Active IQ assessment. Portfolio requirements, practical demonstration, and written components.',
    icon: '📜',
    status: 'locked',
    col: 2, row: 5,
    connects: [],
    category: 'Core',
  },
  /* ── CPD — locked until Level 1 complete ───────── */
  {
    id: 'cpd-cues',
    title: 'Coaching Cues Masterclass',
    shortTitle: 'Cues CPD',
    description:
      'Advanced cueing strategies for Strongman events. Verbal, visual, and tactile coaching cues for measurable performance gains.',
    icon: '💡',
    status: 'locked',
    isCPD: true,
    col: 0, row: 7,
    connects: [],
  },
  {
    id: 'cpd-programming',
    title: 'Beginner Programme Design',
    shortTitle: 'Programming',
    description:
      'Periodisation and programme design for beginner Strongman athletes. Progression models and training frequency principles.',
    icon: '📊',
    status: 'locked',
    isCPD: true,
    col: 1, row: 7,
    connects: [],
  },
  {
    id: 'cpd-competition',
    title: 'Competition Day Coaching',
    shortTitle: 'Competition',
    description:
      'Preparing athletes for competition. Warm-up protocols, attempt selection, and coaching performance under pressure.',
    icon: '🏆',
    status: 'locked',
    isCPD: true,
    col: 2, row: 7,
    connects: [],
  },
  {
    id: 'cpd-troubleshoot',
    title: 'Event Troubleshooting',
    shortTitle: 'Troubleshoot',
    description:
      'Diagnosing and correcting common technical errors across all six core Strongman events. A coach\'s reference guide.',
    icon: '🔧',
    status: 'locked',
    isCPD: true,
    col: 3, row: 7,
    connects: [],
  },
  {
    id: 'cpd-youth',
    title: 'Youth Strength Foundations',
    shortTitle: 'Youth',
    description:
      'Adapting Strongman principles for youth athletes. Age-appropriate loading, safeguarding, and session design.',
    icon: '⭐',
    status: 'locked',
    isCPD: true,
    col: 4, row: 7,
    connects: [],
  },
];

const NODE_MAP = new Map<string, SkillNode>(NODES.map(n => [n.id, n]));

/* ═══════════════════════════════════════════════════════ LAYOUT ══ */

const CW   = 180;   // column width  (5 cols → 900px canvas)
const RH   = 150;   // row height
const NS   = 26;    // node half-size — diamond: 52×52 visual footprint
const COLS = 5;
const CANVAS_W = COLS * CW;  // 900

// CPD separator sits below the Level 1 tree
const L1_LAST_ROW    = 5;
const CPD_SEP_Y      = L1_LAST_ROW * RH + RH + 24;   // 924
const CPD_SEP_H      = 64;
const CPD_NODE_CY    = CPD_SEP_Y + CPD_SEP_H + 80;   // centre y of CPD nodes
const CANVAS_H       = CPD_NODE_CY + 90;               // total SVG height

/* ─── Position helpers ──────────────────────────────── */
function cx(n: SkillNode): number {
  return n.col * CW + CW / 2;
}
function cy(n: SkillNode): number {
  return n.isCPD ? CPD_NODE_CY : n.row * RH + RH / 2;
}
function diamond(px: number, py: number, s: number): string {
  return `${px},${py - s} ${px + s},${py} ${px},${py + s} ${px - s},${py}`;
}

/* ═══════════════════════════════════════════════════ STAR FIELD ══ */

// Deterministic pseudo-random — same output every render, no Date/Math.random
function pr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.abs(x - Math.floor(x));
}
const STARS = Array.from({ length: 64 }, (_, i) => ({
  x: pr(i * 7 + 1)   * CANVAS_W,
  y: pr(i * 13 + 2)  * CANVAS_H,
  r: pr(i * 3 + 3)   * 1.4 + 0.3,
  o: pr(i * 11 + 4)  * 0.22 + 0.04,
}));

/* ═══════════════════════════════════════════════════ LEGEND DATA ═ */
const LEGEND = [
  { label: 'Completed',   stroke: '#A41C64', fill: 'rgba(164,28,100,0.2)'  },
  { label: 'In Progress', stroke: '#E19A47', fill: 'rgba(225,154,71,0.18)' },
  { label: 'Available',   stroke: 'rgba(255,255,255,0.5)', fill: 'rgba(255,255,255,0.06)' },
  { label: 'Locked',      stroke: 'rgba(255,255,255,0.12)', fill: 'rgba(255,255,255,0.03)' },
] as const;

/* ═══════════════════════════════════════════════════ PROGRESS CALC */
const L1_NODES       = NODES.filter(n => !n.isCPD);
const COMPLETED_CNT  = L1_NODES.filter(n => n.status === 'completed').length;
const TOTAL_CNT      = L1_NODES.length;
const PROGRESS_PCT   = Math.round((COMPLETED_CNT / TOTAL_CNT) * 100);
const IN_PROGRESS    = NODES.find(n => n.status === 'in-progress');
const NEXT_AVAILABLE = NODES.find(n => !n.isCPD && n.status === 'available');
const NEXT_NODE      = IN_PROGRESS ?? NEXT_AVAILABLE ?? null;

/* ═══════════════════════════════════════════════ SVG DEFS COMPONENT */
function TreeDefs() {
  return (
    <defs>
      {/* ── Nebula atmosphere ─────────────────────────────────── */}
      <radialGradient id="nb1" cx="28%" cy="18%" r="45%">
        <stop offset="0%"   stopColor="#A41C64" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#A41C64" stopOpacity="0"    />
      </radialGradient>
      <radialGradient id="nb2" cx="72%" cy="65%" r="38%">
        <stop offset="0%"   stopColor="#2D1060" stopOpacity="0.11" />
        <stop offset="100%" stopColor="#2D1060" stopOpacity="0"    />
      </radialGradient>
      <radialGradient id="nb3" cx="50%" cy="95%" r="30%">
        <stop offset="0%"   stopColor="#A41C64" stopOpacity="0.09" />
        <stop offset="100%" stopColor="#A41C64" stopOpacity="0"    />
      </radialGradient>
      <radialGradient id="nb4" cx="15%" cy="55%" r="25%">
        <stop offset="0%"   stopColor="#A41C64" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#A41C64" stopOpacity="0"    />
      </radialGradient>

      {/* ── Node fills ────────────────────────────────────────── */}
      <radialGradient id="fill-done" cx="35%" cy="30%" r="70%">
        <stop offset="0%"   stopColor="#C0246E" />
        <stop offset="100%" stopColor="#6B0F3D" />
      </radialGradient>
      <radialGradient id="fill-prog" cx="35%" cy="30%" r="70%">
        <stop offset="0%"   stopColor="#261506" />
        <stop offset="100%" stopColor="#150B03" />
      </radialGradient>

      {/* ── Connection line gradient ───────────────────────────── */}
      <linearGradient id="line-active" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#A41C64" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C0246E" stopOpacity="0.6" />
      </linearGradient>

      {/* ── Glow filters ──────────────────────────────────────── */}
      <filter id="glow-m" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-a" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-sel" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-line" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  );
}

/* ═══════════════════════════════════════════════ CONNECTION LINES ═ */
function ConnectionLines() {
  const segments: React.ReactNode[] = [];

  for (const node of NODES) {
    for (const tid of node.connects) {
      const tgt = NODE_MAP.get(tid);
      if (!tgt) continue;

      const x1 = cx(node), y1 = cy(node);
      const x2 = cx(tgt),  y2 = cy(tgt);

      const bothDone = node.status === 'completed' && tgt.status === 'completed';
      const halfLit  = node.status === 'completed' &&
                       (tgt.status === 'in-progress' || tgt.status === 'available');

      let stroke  = 'rgba(255,255,255,0.07)';
      let sw      = 1;
      let dash: string | undefined = '5 7';
      let filter: string | undefined;
      let opacity = 1;

      if (bothDone) {
        stroke  = 'url(#line-active)';
        sw      = 2;
        dash    = undefined;
        filter  = 'url(#glow-line)';
        opacity = 0.85;
      } else if (halfLit) {
        stroke  = 'rgba(164,28,100,0.45)';
        sw      = 1.5;
        dash    = '3 5';
        opacity = 0.8;
      }

      segments.push(
        <line
          key={`${node.id}→${tid}`}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={dash}
          opacity={opacity}
          filter={filter}
          strokeLinecap="round"
        />
      );
    }
  }
  return <>{segments}</>;
}

/* ═══════════════════════════════════════════════════ DIAMOND NODE ═ */
interface DiamondProps {
  node: SkillNode;
  isSelected: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}

function DiamondNode({ node, isSelected, reducedMotion, onClick }: DiamondProps) {
  const px = cx(node);
  const py = cy(node);
  const isCPD = !!node.isCPD;

  // ── Per-state visual tokens ─────────────────────────
  let fill    = '#0A0A14';
  let stroke  = 'rgba(255,255,255,0.1)';
  let sw      = 1;
  let opacity = 1;
  let filterId: string | undefined;
  let innerRing = false;
  let innerStroke = 'transparent';

  if (isCPD) {
    fill    = '#090910';
    stroke  = 'rgba(164,28,100,0.22)';
    sw      = 1;
    opacity = 0.42;
  } else {
    switch (node.status) {
      case 'completed':
        fill        = 'url(#fill-done)';
        stroke      = '#A41C64';
        sw          = 2;
        filterId    = isSelected ? 'glow-sel' : 'glow-m';
        innerRing   = true;
        innerStroke = 'rgba(255,255,255,0.18)';
        break;
      case 'in-progress':
        fill        = 'url(#fill-prog)';
        stroke      = '#E19A47';
        sw          = 2;
        filterId    = isSelected ? 'glow-sel' : 'glow-a';
        innerRing   = true;
        innerStroke = 'rgba(225,154,71,0.35)';
        break;
      case 'available':
        fill     = '#111120';
        stroke   = 'rgba(255,255,255,0.4)';
        sw       = 1.5;
        filterId = isSelected ? 'glow-sel' : undefined;
        break;
      case 'locked':
        fill    = '#0A0A12';
        stroke  = 'rgba(255,255,255,0.07)';
        sw      = 1;
        opacity = 0.4;
        break;
    }
  }

  if (isSelected && !filterId) filterId = 'glow-sel';

  const tipColour =
    node.status === 'completed'   ? '#C0246E'
    : node.status === 'in-progress' ? '#E19A47'
    : isSelected                    ? 'rgba(255,255,255,0.7)'
    : 'transparent';

  const labelColour = (node.status === 'locked' || isCPD)
    ? 'rgba(255,255,255,0.25)'
    : 'rgba(255,255,255,0.82)';

  const isClickable = !(node.status === 'locked' && !isCPD);

  return (
    <g
      onClick={onClick}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      opacity={opacity}
      filter={filterId ? `url(#${filterId})` : undefined}
    >
      {/* Pulse ring — in-progress, animated via SVG */}
      {node.status === 'in-progress' && !reducedMotion && (
        <polygon
          points={diamond(px, py, NS + 11)}
          fill="none"
          stroke="#E19A47"
          strokeWidth={1}
        >
          <animate attributeName="opacity"
            values="0.55;0;0.55" dur="2.4s"
            repeatCount="indefinite" />
        </polygon>
      )}

      {/* Outer diamond */}
      <polygon
        points={diamond(px, py, NS)}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeDasharray={isCPD ? '3 4' : undefined}
      />

      {/* Inner decorative ring */}
      {innerRing && (
        <polygon
          points={diamond(px, py, NS - 7)}
          fill="none"
          stroke={innerStroke}
          strokeWidth={1}
        />
      )}

      {/* Diamond tip accent dots — selected or completed */}
      {(isSelected || node.status === 'completed' || node.status === 'in-progress') && (
        <>
          <circle cx={px}      cy={py - NS} r={2.5} fill={tipColour} opacity={0.9} />
          <circle cx={px + NS} cy={py}      r={2.5} fill={tipColour} opacity={0.9} />
          <circle cx={px}      cy={py + NS} r={2.5} fill={tipColour} opacity={0.9} />
          <circle cx={px - NS} cy={py}      r={2.5} fill={tipColour} opacity={0.9} />
        </>
      )}

      {/* Icon */}
      <text
        x={px} y={py + 5}
        textAnchor="middle"
        fontSize={13}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {node.icon}
      </text>

      {/* Short label below node */}
      <text
        x={px} y={py + NS + 18}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight="600"
        fill={labelColour}
        letterSpacing="0.04em"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {node.shortTitle}
      </text>

      {/* Lock mark — locked (non-CPD) nodes */}
      {node.status === 'locked' && !isCPD && (
        <text
          x={px + NS - 6} y={py - NS + 8}
          textAnchor="middle"
          fontSize={8}
          opacity={0.5}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          🔒
        </text>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════ CPD SEPARATOR SVG */
function CPDSeparator() {
  const y = CPD_SEP_Y;
  const h = CPD_SEP_H;
  const mid = y + h / 2;

  return (
    <g>
      {/* Tinted band */}
      <rect x={0} y={y} width={CANVAS_W} height={h} fill="rgba(164,28,100,0.028)" />
      {/* Top rule */}
      <line x1={24} y1={y} x2={CANVAS_W - 24} y2={y}
        stroke="rgba(164,28,100,0.22)" strokeWidth={1} strokeDasharray="5 7" />
      {/* Bottom rule */}
      <line x1={24} y1={y + h} x2={CANVAS_W - 24} y2={y + h}
        stroke="rgba(164,28,100,0.12)" strokeWidth={1} strokeDasharray="5 7" />
      {/* Centre text */}
      <text x={CANVAS_W / 2} y={mid - 6}
        textAnchor="middle" fontSize={9.5} fontWeight="700"
        fill="rgba(255,255,255,0.18)" letterSpacing="0.14em"
      >
        CPD — CONTINUING PROFESSIONAL DEVELOPMENT
      </text>
      <text x={CANVAS_W / 2} y={mid + 11}
        textAnchor="middle" fontSize={8} fontWeight="600"
        fill="rgba(164,28,100,0.55)" letterSpacing="0.1em"
      >
        UNLOCKS AFTER LEVEL 1 ASSESSMENT
      </text>
    </g>
  );
}

/* ════════════════════════════════════════════════ PROGRESS RING SVG */
function ProgressRing({ pct }: { pct: number }) {
  const size  = 60;
  const sw    = 4.5;
  const r     = (size - sw * 2) / 2;
  const circ  = 2 * Math.PI * r;
  const arc   = (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#A41C64" />
          <stop offset="100%" stopColor="#E19A47" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      {/* Arc */}
      <circle cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke="url(#rg)"
        strokeWidth={sw}
        strokeDasharray={`${arc} ${circ - arc}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      {/* Label */}
      <text x={size/2} y={size/2 + 4}
        textAnchor="middle"
        fontSize={12} fontWeight="800" fill="#fff"
      >{pct}%</text>
    </svg>
  );
}

/* ════════════════════════════════════════════ SIDEBAR NODE DETAIL ═ */
function SidebarNodeDetail({
  node,
  onClose,
}: {
  node: SkillNode;
  onClose: () => void;
}) {
  const STATUS_LABEL: Record<NodeStatus, string> = {
    'completed':   'Completed',
    'in-progress': 'In Progress',
    'available':   'Available',
    'locked':      'Locked',
  };
  const STATUS_COLOUR: Record<NodeStatus, string> = {
    'completed':   '#A41C64',
    'in-progress': '#E19A47',
    'available':   'rgba(255,255,255,0.55)',
    'locked':      'rgba(255,255,255,0.22)',
  };

  const isCPD  = !!node.isCPD;
  const colour = isCPD ? 'rgba(164,28,100,0.6)' : STATUS_COLOUR[node.status];

  return (
    <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flex: 1, overflowY: 'auto' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 38, height: 38,
              background: node.status === 'completed' ? 'radial-gradient(circle, #C0246E, #6B0F3D)' : '#111120',
              border: `1px solid ${colour}55`,
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', flexShrink: 0,
            }}
          >
            {node.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, lineHeight: 1.35, marginBottom: '5px' }}>
              {node.title}
            </div>
            <span style={{
              background: `${colour}22`,
              border: `1px solid ${colour}44`,
              color: colour,
              borderRadius: '4px',
              padding: '1px 8px',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap' as const,
            }}>
              {isCPD ? 'CPD — Locked' : STATUS_LABEL[node.status]}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
            width: 26, height: 26,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginLeft: '8px',
          }}
        >
          ×
        </button>
      </div>

      {/* Description */}
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, marginBottom: '14px' }}>
        {node.description}
      </p>

      {isCPD && (
        <p style={{ fontSize: '10px', color: 'rgba(164,28,100,0.7)', marginBottom: '14px', lineHeight: 1.5 }}>
          Complete your Level 1 assessment to unlock CPD content.
        </p>
      )}

      {node.category && !isCPD && (
        <div style={{ marginBottom: '14px' }}>
          <span style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}>
            {node.category}
          </span>
        </div>
      )}

      {/* CTA */}
      {node.status === 'completed' && (
        <Link to="/dashboard" style={{
          display: 'block', textAlign: 'center',
          background: 'rgba(164,28,100,0.14)',
          border: '1px solid rgba(164,28,100,0.35)',
          color: '#A41C64',
          padding: '9px 12px', borderRadius: '8px',
          fontWeight: 600, fontSize: '12px', textDecoration: 'none',
        }}>Review Lesson</Link>
      )}
      {node.status === 'in-progress' && (
        <Link to="/dashboard" style={{
          display: 'block', textAlign: 'center',
          background: 'linear-gradient(135deg, #A41C64, #C0246E)',
          color: '#fff',
          padding: '9px 12px', borderRadius: '8px',
          fontWeight: 700, fontSize: '12px', textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(164,28,100,0.4)',
        }}>Continue Learning →</Link>
      )}
      {node.status === 'available' && (
        <Link to="/dashboard" style={{
          display: 'block', textAlign: 'center',
          background: 'linear-gradient(135deg, #A41C64, #C0246E)',
          color: '#fff',
          padding: '9px 12px', borderRadius: '8px',
          fontWeight: 700, fontSize: '12px', textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(164,28,100,0.4)',
        }}>Start Lesson →</Link>
      )}
      {(node.status === 'locked' || isCPD) && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.2)',
          padding: '9px 12px', borderRadius: '8px',
          fontSize: '12px', fontWeight: 600,
        }}>
          🔒 Complete prerequisites first
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════ SIDEBAR ═ */
interface SidebarProps {
  user: { firstName: string; lastName: string } | null;
  selectedNode: SkillNode | null;
  onCloseNode: () => void;
}

function ProgressSidebar({ user, selectedNode, onCloseNode }: SidebarProps) {
  const fn = user?.firstName ?? 'Learner';
  const ln = user?.lastName  ?? '';
  const initials = `${fn[0] ?? '?'}${(ln[0] ?? '')}`;

  return (
    <aside className="st-sidebar" style={{
      width: 292,
      flexShrink: 0,
      background: '#09090F',
      borderLeft: '1px solid rgba(164,28,100,0.14)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>

      {/* ── Learner header ──────────────────────────────── */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(160deg, rgba(164,28,100,0.10) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '16px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #C0246E, #7A1349)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: '0 0 14px rgba(164,28,100,0.45)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{fn} {ln}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9.5px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Enrolled Learner
            </div>
          </div>
        </div>

        {/* Pathway badge */}
        <div style={{
          background: 'rgba(164,28,100,0.10)',
          border: '1px solid rgba(164,28,100,0.22)',
          borderRadius: '8px',
          padding: '10px 12px',
        }}>
          <div style={{ color: 'rgba(164,28,100,0.8)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>
            Active Pathway
          </div>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>Coaching Level 1</div>
          <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '10px' }}>Fundamentals of Coaching Strongman</div>
        </div>
      </div>

      {/* ── Progress ring + stats ───────────────────────── */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
      }}>
        <ProgressRing pct={PROGRESS_PCT} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '9px' }}>
            Overall Progress
          </div>
          {[
            { label: 'Lessons',
              value: `${COMPLETED_CNT} / ${TOTAL_CNT}`,
              colour: '#E19A47',
            },
            { label: 'Certificate',
              value: 'In Progress',
              badge: true,
              badgeStyle: { background: 'rgba(234,179,8,0.14)', border: '1px solid rgba(234,179,8,0.3)', color: '#EAB308' },
            },
            { label: 'CPD',
              value: 'Locked',
              badge: true,
              badgeStyle: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.28)' },
            },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{row.label}</span>
              {row.badge ? (
                <span style={{ ...(row.badgeStyle as React.CSSProperties), borderRadius: '4px', padding: '1px 7px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {row.value}
                </span>
              ) : (
                <span style={{ color: row.colour ?? '#fff', fontSize: '11px', fontWeight: 700 }}>{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Node detail or Next Up ───────────────────────── */}
      {selectedNode ? (
        <SidebarNodeDetail node={selectedNode} onClose={onCloseNode} />
      ) : NEXT_NODE ? (
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Next Up
          </div>
          <div style={{
            background: 'rgba(164,28,100,0.08)',
            border: '1px solid rgba(164,28,100,0.2)',
            borderRadius: '10px',
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: '16px', marginBottom: '7px' }}>{NEXT_NODE.icon}</div>
            <div style={{ color: 'rgba(164,28,100,0.8)', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {NEXT_NODE.category ?? 'Lesson'}
            </div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, lineHeight: 1.4 }}>
              {NEXT_NODE.title}
            </div>
            <div style={{ color: NEXT_NODE.status === 'in-progress' ? '#E19A47' : 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>
              {NEXT_NODE.status === 'in-progress' ? '● In progress' : '○ Available now'}
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px', marginTop: '10px', lineHeight: 1.6 }}>
            Click any node on the constellation to view details.
          </p>
        </div>
      ) : null}

      {/* ── Legend ──────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Legend
        </div>
        {LEGEND.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
            {/* Mini diamond */}
            <svg width={14} height={14} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
              <polygon points="7,1 13,7 7,13 1,7"
                fill={item.fill}
                stroke={item.stroke}
                strokeWidth={1.5}
              />
            </svg>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── CTAs ────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px', marginTop: 'auto' }}>
        <Link to="/dashboard" style={{
          display: 'block',
          background: 'linear-gradient(135deg, #A41C64, #C0246E)',
          color: '#fff',
          padding: '12px',
          borderRadius: '10px',
          fontWeight: 700, fontSize: '13px',
          textDecoration: 'none',
          textAlign: 'center',
          boxShadow: '0 4px 22px rgba(164,28,100,0.42)',
          marginBottom: '10px',
        }}>
          Continue Learning →
        </Link>
        <Link to="/dashboard" style={{
          display: 'block',
          color: 'rgba(255,255,255,0.28)',
          fontSize: '11px',
          textDecoration: 'none',
          textAlign: 'center',
        }}>
          ← Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════ MOBILE HINT ═ */
function MobileProgress() {
  return (
    <div className="st-mobile-bar" style={{
      display: 'none', // shown via CSS on narrow screens
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      background: '#09090F',
      borderBottom: '1px solid rgba(164,28,100,0.14)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Coaching L1</div>
        <div style={{
          height: 6, width: 80,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 999, overflow: 'hidden',
        }}>
          <div style={{
            width: `${PROGRESS_PCT}%`, height: '100%',
            background: 'linear-gradient(90deg, #A41C64, #E19A47)',
            borderRadius: 999,
          }} />
        </div>
        <span style={{ color: '#E19A47', fontSize: '11px', fontWeight: 700 }}>{PROGRESS_PCT}%</span>
      </div>
      <Link to="/dashboard" style={{
        background: 'linear-gradient(135deg, #A41C64, #C0246E)',
        color: '#fff', padding: '6px 12px',
        borderRadius: '6px', fontSize: '11px',
        fontWeight: 700, textDecoration: 'none',
      }}>Continue</Link>
    </div>
  );
}

/* ════════════════════════════════════════════════════ MAIN PAGE ═══ */
export default function SkillTree() {
  const { user } = useAuth();
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const selectedNode = selectedId ? (NODE_MAP.get(selectedId) ?? null) : null;

  const handleClick = useCallback((node: SkillNode) => {
    setSelectedId(prev => prev === node.id ? null : node.id);
  }, []);

  return (
    <>
      {/* ── Global styles for this page only ── */}
      <style>{`
        .st-sidebar    { display: flex; }
        .st-mobile-bar { display: none; }
        @media (max-width: 720px) {
          .st-sidebar    { display: none !important; }
          .st-mobile-bar { display: flex !important; }
        }
      `}</style>

      <div style={{
        background: '#06060F',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}>
        <Navbar />

        {/* ── Page body (below navbar) ─────────────────── */}
        <div style={{
          display: 'flex',
          flex: 1,
          paddingTop: 64,
          height: '100vh',
          overflow: 'hidden',
        }}>

          {/* ── Canvas column ─────────────────────────── */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}>

            {/* Title bar */}
            <div style={{
              background: '#09090F',
              borderBottom: '1px solid rgba(164,28,100,0.14)',
              padding: '0 20px',
              height: 46,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11.5px', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>›</span>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11.5px' }}>Coaching Pathway</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>›</span>
                <span style={{ color: '#fff', fontSize: '11.5px', fontWeight: 600 }}>Skill Tree</span>
              </div>
              <div style={{
                background: 'rgba(164,28,100,0.12)',
                border: '1px solid rgba(164,28,100,0.28)',
                color: '#A41C64',
                borderRadius: '5px',
                padding: '3px 10px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                Level 1 · {PROGRESS_PCT}% Complete
              </div>
            </div>

            {/* Mobile progress bar */}
            <MobileProgress />

            {/* Scrollable SVG canvas */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              background: '#06060F',
            }}>
              <svg
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                style={{ display: 'block', minWidth: CANVAS_W }}
                aria-label="Coaching Level 1 skill constellation"
                role="img"
              >
                <TreeDefs />

                {/* Nebula atmosphere layers */}
                <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="url(#nb1)" />
                <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="url(#nb2)" />
                <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="url(#nb3)" />
                <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="url(#nb4)" />

                {/* Star field */}
                {STARS.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
                ))}

                {/* Connection lines — rendered under nodes */}
                <ConnectionLines />

                {/* CPD separator band */}
                <CPDSeparator />

                {/* Nodes */}
                {NODES.map(node => (
                  <DiamondNode
                    key={node.id}
                    node={node}
                    isSelected={selectedId === node.id}
                    reducedMotion={reducedMotion}
                    onClick={() => handleClick(node)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <ProgressSidebar
            user={user}
            selectedNode={selectedNode}
            onCloseNode={() => setSelectedId(null)}
          />
        </div>
      </div>
    </>
  );
}
