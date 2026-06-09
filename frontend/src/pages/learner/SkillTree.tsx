/**
 * SkillTree — Level 1 Coaching Pathway · LMS Skill Tree
 * Route: /dashboard/pathway  (ProtectedRoute)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

/* ══════════════════════════════════════════════════════════ TYPES ══ */

type NodeStatus = 'completed' | 'in-progress' | 'available' | 'locked' | 'cpd-locked';
type NodeType   = 'foundation' | 'skill' | 'assessment' | 'cpd';

interface SkillNode {
  id: string;
  title: string;
  subtitle?: string;
  type: NodeType;
  status: NodeStatus;
  icon: string;
  progress?: number;
  description?: string;
  duration?: string;
  lessonCount?: number;
  lessonLink?: string;
  subSkills?: SkillNode[];
}

interface LearnerStats {
  name: string;
  role: string;
  pathway: string;
  progressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  totalTime: string;
  currentModule: string;
  currentModuleProgress: number;
  nextLessonTitle: string;
  nextLessonNumber: number;
  nextLessonDuration: string;
  nextLessonLink: string;
  certEarned: boolean;
  cpdLocked: boolean;
}

/* ══════════════════════════════════════════════════════════ DATA ═══ */

const CPD_NODES: SkillNode[] = [
  {
    id: 'cpd-mobility', title: 'Mobility for Strongman',
    type: 'cpd', status: 'cpd-locked', icon: '🧘',
    description: 'Evidence-based mobility protocols for Strongman athletes. Thoracic, hip, and shoulder mobility for safe heavy loading.',
    duration: '3h 20m', lessonCount: 12,
  },
  {
    id: 'cpd-programming', title: 'Programming Essentials',
    type: 'cpd', status: 'cpd-locked', icon: '📋',
    description: 'Periodisation and block programming for Strongman training cycles. Competition prep and long-term athlete development.',
    duration: '4h 15m', lessonCount: 15,
  },
  {
    id: 'cpd-analysis', title: 'Event Analysis',
    type: 'cpd', status: 'cpd-locked', icon: '📊',
    description: 'Video analysis methodology for Strongman events. Technique breakdowns and corrective coaching frameworks.',
    duration: '2h 45m', lessonCount: 10,
  },
];

const EVENT_SUB_SKILLS: SkillNode[] = [
  {
    id: 'log-press', title: 'Log Press Fundamentals',
    type: 'skill', status: 'completed', icon: '🪵',
    description: 'Log clean mechanics, overhead lockout, and loading progressions for new athletes.',
    duration: '1h 20m', lessonCount: 5,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/44',
  },
  {
    id: 'axle-press', title: 'Axle Press Fundamentals',
    type: 'skill', status: 'completed', icon: '⚡',
    description: 'Axle bar grip mechanics, continental clean technique, and coaching cues for the push press.',
    duration: '55m', lessonCount: 4,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/49',
  },
  {
    id: 'deadlift', title: 'Deadlift Fundamentals',
    type: 'skill', status: 'completed', icon: '🔩',
    description: 'Silver dollar, car deadlift, and frame variations. Technique cues and competition rule coaching.',
    duration: '1h 10m', lessonCount: 4,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/53',
  },
  {
    id: 'farmers-walk', title: "Farmer's Walk Fundamentals",
    type: 'skill', status: 'completed', icon: '🚶',
    description: 'Grip loading, turn mechanics, and pacing strategies. Foot placement for competition performance.',
    duration: '50m', lessonCount: 3,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/57',
  },
  {
    id: 'yoke', title: 'Yoke Fundamentals',
    type: 'skill', status: 'completed', icon: '⚖',
    description: 'Load placement, leg drive mechanics, and visual cuing strategies. Error correction analysis.',
    duration: '55m', lessonCount: 3,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/60',
  },
  {
    id: 'atlas-stones', title: 'Atlas Stones Fundamentals',
    type: 'skill', status: 'completed', icon: '🪨',
    description: 'Tacky application, lap mechanics, and safe loading progressions. The pinnacle Strongman event.',
    duration: '1h 15m', lessonCount: 5,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/63',
  },
];

const MAIN_NODES: SkillNode[] = [
  {
    id: 'foundation', title: 'Foundation',
    subtitle: 'Fundamentals of Coaching Strongman',
    type: 'foundation', status: 'completed', icon: '🏛',
    description: "Core principles of Strongman coaching. Sport history, culture, and the coach's role in athlete development.",
    duration: '2h 10m', lessonCount: 8,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/1',
  },
  {
    id: 'intro', title: 'Introduction to Strongman Coaching',
    subtitle: 'Coaching philosophy & communication',
    type: 'foundation', status: 'completed', icon: '🏃',
    description: 'Coaching communication frameworks, athlete relationships, and professional standards.',
    duration: '3h 05m', lessonCount: 11,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/9',
  },
  {
    id: 'screening', title: 'Athlete Screening and Safety',
    subtitle: 'Pre-participation screening protocols',
    type: 'foundation', status: 'completed', icon: '🛡',
    description: 'PAR-Q, injury history, movement screening, and safe load progression protocols.',
    duration: '2h 40m', lessonCount: 9,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/20',
  },
  {
    id: 'session', title: 'Session Structure',
    subtitle: 'Session planning & delivery',
    type: 'foundation', status: 'in-progress', progress: 65, icon: '📝',
    description: 'Building effective Strongman training sessions. Warm-up protocols, exercise sequencing, and coaching flow.',
    duration: '3h 50m', lessonCount: 14,
    lessonLink: '/learn/level-1-coaching-strongman/lessons/30',
    subSkills: EVENT_SUB_SKILLS,
  },
  {
    id: 'practical', title: 'Practical Coaching Skills',
    subtitle: 'Live coaching assessment preparation',
    type: 'assessment', status: 'locked', icon: '👥',
    description: 'Practical session delivery. Communication under pressure, athlete management, and real-time feedback.',
    duration: '4h 30m', lessonCount: 16,
  },
  {
    id: 'assessment', title: 'Assessment Preparation',
    subtitle: 'Certificate assessment guide',
    type: 'assessment', status: 'locked', icon: '🏅',
    description: 'Preparing for the Level 1 certificate assessment. Theory test guidance and practical walkthrough.',
    duration: '2h 00m', lessonCount: 7,
  },
];

const MOCK_LEARNER: LearnerStats = {
  name: 'James Mitchell', role: 'Learner',
  pathway: 'Coaching Pathway Level 1',
  progressPercent: 42, lessonsCompleted: 42, totalLessons: 100,
  totalTime: '12h 35m',
  currentModule: 'Session Structure', currentModuleProgress: 65,
  nextLessonTitle: 'Session Planning Principles',
  nextLessonNumber: 18, nextLessonDuration: '25 min',
  nextLessonLink: '/learn/level-1-coaching-strongman/lessons/18',
  certEarned: false, cpdLocked: true,
};

/* ══════════════════════════════════════════════════ GYM BACKGROUND ═ */

function GymBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Base + magenta gym lighting */}
      <div className="absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 80% 50% at 38% 22%, rgba(164,28,100,0.18) 0%, transparent 55%)',
          'radial-gradient(ellipse 50% 65% at 8% 58%, rgba(164,28,100,0.08) 0%, transparent 55%)',
          'radial-gradient(ellipse 40% 40% at 92% 68%, rgba(164,28,100,0.10) 0%, transparent 50%)',
          '#080810',
        ].join(', '),
      }} />

      {/* Chalk-dust grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.055 }}>
        <filter id="sk-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sk-grain)" />
      </svg>

      {/* Chalk scratch lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent, transparent 130px, rgba(255,255,255,0.006) 130px, rgba(255,255,255,0.006) 131px)',
          'repeating-linear-gradient(90deg, transparent, transparent 210px, rgba(255,255,255,0.004) 210px, rgba(255,255,255,0.004) 211px)',
        ].join(', '),
      }} />

      {/* Power rack / yoke uprights — left */}
      <svg className="absolute left-0 bottom-0" width="110" height="520" viewBox="0 0 110 520" style={{ opacity: 0.10 }}>
        <rect x="10" y="0" width="13" height="475" rx="3" fill="white" />
        <rect x="87" y="0" width="13" height="475" rx="3" fill="white" />
        <rect x="10" y="0" width="90" height="13" rx="3" fill="white" />
        <rect x="10" y="145" width="90" height="9" rx="2" fill="white" opacity="0.7" />
        <rect x="10" y="255" width="90" height="9" rx="2" fill="white" opacity="0.65" />
        <rect x="10" y="360" width="90" height="9" rx="2" fill="white" opacity="0.5" />
        <rect x="0" y="462" width="38" height="18" rx="3" fill="white" />
        <rect x="72" y="462" width="38" height="18" rx="3" fill="white" />
        {[90, 112, 134, 195, 217, 305, 327, 410].map(y => (
          <g key={y}>
            <circle cx="16.5" cy={y} r="3.5" fill="#080810" opacity="0.85" />
            <circle cx="93.5" cy={y} r="3.5" fill="#080810" opacity="0.85" />
          </g>
        ))}
        <rect x="23" y="137" width="24" height="17" rx="3" fill="white" opacity="0.8" />
        <rect x="63" y="137" width="24" height="17" rx="3" fill="white" opacity="0.8" />
      </svg>

      {/* Weight plates — bottom left */}
      <svg className="absolute bottom-0 left-32" width="150" height="80" viewBox="0 0 150 80" style={{ opacity: 0.06 }}>
        <ellipse cx="38" cy="58" rx="22" ry="14" fill="white" />
        <ellipse cx="38" cy="58" rx="13" ry="9" fill="#080810" />
        <rect x="36" y="26" width="4" height="32" fill="white" />
        <ellipse cx="88" cy="62" rx="18" ry="11" fill="white" />
        <ellipse cx="88" cy="62" rx="10" ry="7" fill="#080810" />
        <rect x="86" y="36" width="4" height="26" fill="white" />
        <ellipse cx="130" cy="60" rx="20" ry="12" fill="white" />
        <ellipse cx="130" cy="60" rx="11" ry="8" fill="#080810" />
      </svg>

      {/* Atlas stones — bottom right */}
      <div className="absolute" style={{
        bottom: '36px', right: '90px',
        width: '88px', height: '88px', borderRadius: '50%',
        background: 'radial-gradient(circle at 36% 32%, rgba(255,255,255,0.2), rgba(255,255,255,0.04) 60%, transparent)',
        opacity: 0.11,
      }} />
      <div className="absolute" style={{
        bottom: '22px', right: '168px',
        width: '62px', height: '62px', borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 34%, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 60%, transparent)',
        opacity: 0.09,
      }} />

      {/* Right rack silhouette */}
      <svg className="absolute right-0 bottom-0" width="80" height="360" viewBox="0 0 80 360" style={{ opacity: 0.07 }}>
        <rect x="8" y="30" width="10" height="305" rx="2" fill="white" />
        <rect x="62" y="30" width="10" height="305" rx="2" fill="white" />
        <rect x="8" y="30" width="64" height="10" rx="2" fill="white" />
        <rect x="8" y="170" width="64" height="8" rx="2" fill="white" opacity="0.6" />
        <rect x="0" y="325" width="28" height="14" rx="2" fill="white" />
        <rect x="52" y="325" width="28" height="14" rx="2" fill="white" />
      </svg>

      {/* Sandbag */}
      <div className="absolute" style={{
        bottom: '10px', right: '245px',
        width: '68px', height: '34px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.06)', opacity: 0.12,
      }} />

      {/* Edge vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 112% 112% at 50% 50%, transparent 26%, rgba(8,8,16,0.88) 100%)',
      }} />

      {/* Top/bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-28" style={{ background: 'linear-gradient(#080810, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(transparent, #080810)' }} />
    </div>
  );
}

/* ═════════════════════════════════════════════════════ HEX NODE ══════ */

// Flat-top hexagon points (0°, 60°, 120°, 180°, 240°, 300°)
function mkHexPts(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

interface HexNodeProps {
  node: SkillNode;
  size?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

function HexNode({ node, size = 64, onClick, isSelected }: HexNodeProps) {
  const isInteractive = node.status !== 'locked' && node.status !== 'cpd-locked';
  const cx = size / 2, cy = size / 2;
  const r = size * 0.445;
  const pts = mkHexPts(cx, cy, r);
  const gradId = `hg_${node.id}`;
  const fontSize = size >= 62 ? '1.5rem' : size >= 50 ? '1.25rem' : '1.05rem';

  const glowFilter = node.status === 'completed'
    ? 'drop-shadow(0 0 8px rgba(164,28,100,0.95)) drop-shadow(0 0 18px rgba(164,28,100,0.55))'
    : node.status === 'in-progress'
    ? 'drop-shadow(0 0 8px rgba(225,154,71,0.95)) drop-shadow(0 0 18px rgba(225,154,71,0.55))'
    : 'none';

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: size, height: size,
        cursor: isInteractive ? 'pointer' : 'default',
        opacity: node.status === 'locked' ? 0.42 : 1,
      }}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={node.title}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive && onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Pulse ring for in-progress */}
      {node.status === 'in-progress' && (
        <div
          className="absolute rounded-full"
          style={{
            inset: -(size * 0.2),
            background: 'rgba(225,154,71,0.13)',
            animation: 'skPulse 2.2s ease-in-out infinite',
          }}
        />
      )}

      {/* Selection halo */}
      {isSelected && (
        <div className="absolute" style={{
          inset: -(size * 0.1),
          border: `2px solid ${node.status === 'in-progress' ? 'rgba(225,154,71,0.45)' : 'rgba(164,28,100,0.45)'}`,
          borderRadius: '50%',
        }} />
      )}

      {/* Hex shape with glow */}
      <div style={{ filter: glowFilter, position: 'absolute', inset: 0 }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          <defs>
            {node.status === 'completed' && (
              <radialGradient id={gradId} cx="35%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#D4297A" />
                <stop offset="50%" stopColor="#A41C64" />
                <stop offset="100%" stopColor="#7A1348" />
              </radialGradient>
            )}
            {node.status === 'in-progress' && (
              <radialGradient id={gradId} cx="35%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#F7C55A" />
                <stop offset="50%" stopColor="#E19A47" />
                <stop offset="100%" stopColor="#BF7828" />
              </radialGradient>
            )}
          </defs>

          {/* Main hex polygon */}
          <polygon
            points={pts}
            fill={
              node.status === 'completed'   ? `url(#${gradId})` :
              node.status === 'in-progress' ? `url(#${gradId})` :
              node.status === 'available'   ? 'rgba(18,16,36,0.95)' :
              node.status === 'cpd-locked'  ? 'rgba(164,28,100,0.07)' :
              '#0a0a14'
            }
            stroke={
              node.status === 'available'  ? 'rgba(255,255,255,0.28)' :
              node.status === 'cpd-locked' ? 'rgba(164,28,100,0.42)' :
              node.status === 'completed'  ? 'rgba(212,41,122,0.45)' :
              node.status === 'in-progress'? 'rgba(247,197,90,0.45)' :
              'rgba(255,255,255,0.06)'
            }
            strokeWidth={1.5}
            strokeDasharray={node.status === 'cpd-locked' ? '5 3' : undefined}
          />
        </svg>
      </div>

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2, marginTop: node.status === 'in-progress' ? '-4px' : 0 }}>
        <span style={{
          fontSize,
          lineHeight: 1,
          filter: (node.status === 'locked' || node.status === 'cpd-locked')
            ? 'grayscale(1) brightness(0.28)'
            : 'drop-shadow(0 1px 6px rgba(0,0,0,0.7))',
        }}>
          {node.icon}
        </span>
      </div>

      {/* Progress % badge */}
      {node.status === 'in-progress' && node.progress !== undefined && (
        <div className="absolute font-black" style={{
          bottom: 0, right: -1, zIndex: 3,
          minWidth: 28, height: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', letterSpacing: '0.02em',
          background: '#E19A47', color: '#1a0800',
          padding: '0 5px', borderRadius: '9px',
          border: '1.5px solid #080810',
        }}>
          {node.progress}%
        </div>
      )}

      {/* Checkmark badge */}
      {node.status === 'completed' && (
        <div className="absolute flex items-center justify-center" style={{
          bottom: 0, right: 1, zIndex: 3,
          width: Math.round(size * 0.30), height: Math.round(size * 0.30),
          borderRadius: '50%',
          background: '#A41C64',
          border: '1.5px solid #080810',
        }}>
          <svg viewBox="0 0 10 8" width={Math.round(size * 0.145)} fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Lock icon */}
      {(node.status === 'locked' || node.status === 'cpd-locked') && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3, paddingTop: '20%' }}>
          <svg viewBox="0 0 20 24" width={Math.round(size * 0.28)} fill="none" style={{ opacity: 0.35 }}>
            <rect x="3" y="11" width="14" height="12" rx="2.5" fill="white" />
            <path d="M7 11V7a3 3 0 016 0v4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ CONNECTOR LINES ═════════ */

function GlowConnector({ from, to, height = 36 }: { from: NodeStatus; to?: NodeStatus; height?: number }) {
  const bothDone = from === 'completed' && to === 'completed';
  const toProgress = from === 'completed' && to === 'in-progress';

  if (bothDone) {
    return (
      <div style={{ width: 4, height, flexShrink: 0, margin: '0', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#A41C64', borderRadius: 2,
          filter: 'drop-shadow(0 0 4px rgba(164,28,100,1)) drop-shadow(0 0 10px rgba(164,28,100,0.6))',
        }} />
      </div>
    );
  }
  if (toProgress) {
    return (
      <div style={{ width: 4, height, flexShrink: 0, margin: '0', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #A41C64, #E19A47)',
          borderRadius: 2,
          filter: 'drop-shadow(0 0 4px rgba(164,28,100,0.7))',
        }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 1, height, flexShrink: 0, margin: '0',
      borderLeft: '1.5px dashed rgba(255,255,255,0.11)',
    }} />
  );
}

function CpdConnector({ height = 30 }: { height?: number }) {
  return (
    <div style={{
      width: 1, height, flexShrink: 0,
      borderLeft: '1.5px dashed rgba(164,28,100,0.28)',
    }} />
  );
}

/* ═══════════════════════════════════════════════ TREE CANVAS ═════════ */

interface CanvasProps {
  onNodeClick: (node: SkillNode) => void;
  selectedId: string | null;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

function SkillTreeCanvas({ onNodeClick, selectedId, expandedId, onToggleExpand }: CanvasProps) {
  return (
    <div
      className="relative flex flex-col items-center w-full"
      style={{ padding: '28px 20px 80px', minWidth: '420px', maxWidth: 640 }}
    >
      {/* ── CPD HEADER ─────────────────────────────────────────── */}
      <div className="w-full text-center mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-1" style={{
          background: 'rgba(164,28,100,0.07)',
          border: '1px dashed rgba(164,28,100,0.3)',
        }}>
          <svg viewBox="0 0 14 18" width={9} fill="none">
            <rect x="2" y="8" width="10" height="9" rx="1.5" fill="rgba(164,28,100,0.7)" />
            <path d="M5 8V5a2 2 0 014 0v3" stroke="rgba(164,28,100,0.7)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: 'rgba(164,28,100,0.7)' }}>
            Continuing Professional Development (CPD)
          </span>
        </div>
        <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Locked until Level 1 completion
        </p>
      </div>

      {/* ── CPD NODES ROW ──────────────────────────────────────── */}
      <div className="flex items-start justify-center gap-5 mb-1">
        {CPD_NODES.map((node) => (
          <div key={node.id} className="flex flex-col items-center gap-2">
            <HexNode
              node={node} size={52}
              isSelected={selectedId === node.id}
              onClick={() => onNodeClick(node)}
            />
            <span className="text-[9px] font-medium text-center leading-tight"
              style={{ color: 'rgba(255,255,255,0.22)', maxWidth: 68 }}>
              {node.title}
            </span>
          </div>
        ))}
      </div>

      <CpdConnector height={28} />

      {/* ── MAIN PATHWAY ───────────────────────────────────────── */}
      {MAIN_NODES.map((node, idx) => {
        const next = MAIN_NODES[idx + 1];
        const isLast = idx === MAIN_NODES.length - 1;
        const hasSubSkills = !!node.subSkills?.length;
        const isExpanded = hasSubSkills && expandedId === node.id;

        return (
          <div key={node.id} className="flex flex-col items-center w-full">

            {/* ── NODE ROW ─────────────────────────────────────── */}
            <div
              className="flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-200 cursor-pointer w-full"
              style={{
                maxWidth: 500,
                background: selectedId === node.id
                  ? 'rgba(255,255,255,0.055)'
                  : 'rgba(255,255,255,0.018)',
                border: selectedId === node.id
                  ? `1px solid ${node.status === 'in-progress' ? 'rgba(225,154,71,0.38)' : node.status === 'completed' ? 'rgba(164,28,100,0.38)' : 'rgba(255,255,255,0.1)'}`
                  : '1px solid rgba(255,255,255,0.055)',
                boxShadow: selectedId === node.id
                  ? node.status === 'completed' ? '0 4px 28px rgba(164,28,100,0.2)' : node.status === 'in-progress' ? '0 4px 28px rgba(225,154,71,0.18)' : 'none'
                  : 'none',
              }}
              onClick={() => {
                if (node.status !== 'locked') {
                  onNodeClick(node);
                  if (hasSubSkills) onToggleExpand(node.id);
                }
              }}
              role="button"
              tabIndex={node.status !== 'locked' ? 0 : undefined}
              onKeyDown={(e) => e.key === 'Enter' && node.status !== 'locked' && onNodeClick(node)}
            >
              <HexNode node={node} size={72} isSelected={selectedId === node.id} onClick={undefined} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-bold text-white leading-snug" style={{ letterSpacing: '-0.018em' }}>
                    {node.title}
                  </span>
                  {node.status === 'completed' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(164,28,100,0.18)', color: '#C0246E' }}>
                      Complete
                    </span>
                  )}
                  {node.status === 'in-progress' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(225,154,71,0.16)', color: '#E19A47' }}>
                      In Progress
                    </span>
                  )}
                  {node.status === 'locked' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.22)' }}>
                      Locked
                    </span>
                  )}
                </div>

                {node.subtitle && (
                  <p className="text-xs leading-snug mb-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    {node.subtitle}
                  </p>
                )}

                {node.status === 'in-progress' && node.progress !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[130px] h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${node.progress}%`, background: 'linear-gradient(90deg, #C8792A, #E19A47)', transition: 'width 0.5s ease' }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#E19A47' }}>
                      {node.progress}%
                    </span>
                  </div>
                )}
              </div>

              {hasSubSkills && (
                <div style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }}>
                  <svg viewBox="0 0 12 8" width={12} fill="none">
                    <path
                      d={isExpanded ? 'M1 6l5-4 5 4' : 'M1 2l5 4 5-4'}
                      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* ── EVENT SUB-SKILLS (children of Session Structure) ── */}
            {hasSubSkills && node.subSkills && isExpanded && (
              <div className="w-full" style={{ maxWidth: 600 }}>
                {/* Top bracket */}
                <div style={{ position: 'relative', height: 28 }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: '8%', right: '8%', height: 28,
                    borderLeft: '2px solid rgba(225,154,71,0.3)',
                    borderRight: '2px solid rgba(225,154,71,0.3)',
                    borderTop: '2px solid rgba(225,154,71,0.3)',
                    borderRadius: '6px 6px 0 0',
                  }} />
                </div>

                {/* 3-column event grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  padding: '0 4px',
                }}>
                  {node.subSkills.map(sub => (
                    <div
                      key={sub.id}
                      className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 cursor-pointer"
                      style={{
                        background: selectedId === sub.id ? 'rgba(164,28,100,0.1)' : 'rgba(255,255,255,0.025)',
                        border: selectedId === sub.id ? '1px solid rgba(164,28,100,0.32)' : '1px solid rgba(255,255,255,0.055)',
                        borderTop: `2.5px solid ${sub.status === 'completed' ? '#A41C64' : 'rgba(255,255,255,0.07)'}`,
                      }}
                      onClick={(e) => { e.stopPropagation(); onNodeClick(sub); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onNodeClick(sub)}
                    >
                      <HexNode node={sub} size={52} isSelected={selectedId === sub.id} />
                      <span className="text-center leading-snug" style={{
                        fontSize: '9.5px', fontWeight: 600,
                        color: sub.status === 'completed' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.32)',
                      }}>
                        {sub.title.replace(' Fundamentals', '')}
                        <br />
                        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>Fundamentals</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom converge line */}
                <div style={{ display: 'flex', justifyContent: 'center', height: 24 }}>
                  <div style={{ width: 2, height: 24, background: 'rgba(255,255,255,0.09)' }} />
                </div>
              </div>
            )}

            {/* Vertical connector to next node */}
            {!isLast && (
              <GlowConnector from={node.status} to={next?.status} height={32} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════ BOTTOM DETAIL PANEL ════════ */

function statusChip(status: NodeStatus) {
  const map = {
    completed:     { text: 'Complete',     bg: 'rgba(164,28,100,0.18)', colour: '#C0246E' },
    'in-progress': { text: 'In Progress',  bg: 'rgba(225,154,71,0.18)', colour: '#E19A47' },
    available:     { text: 'Available',    bg: 'rgba(255,255,255,0.08)', colour: 'rgba(255,255,255,0.65)' },
    locked:        { text: 'Locked',       bg: 'rgba(255,255,255,0.05)', colour: 'rgba(255,255,255,0.28)' },
    'cpd-locked':  { text: 'CPD — Locked', bg: 'rgba(164,28,100,0.1)',  colour: 'rgba(164,28,100,0.65)' },
  } as const;
  return map[status];
}

function BottomPanel({ node, onClose }: { node: SkillNode; onClose: () => void }) {
  const s = statusChip(node.status);
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #0e0e1c, #10101e)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -12px 60px rgba(0,0,0,0.8)',
        animation: 'skSlideUp 0.22s ease-out',
      }}
    >
      <div className="es-container" style={{ maxWidth: 720, padding: '18px 24px 22px' }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <HexNode node={node} size={50} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white" style={{ letterSpacing: '-0.018em' }}>
                  {node.title}
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
                  style={{ background: s.bg, color: s.colour }}>
                  {s.text}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {node.duration   && <span>⏱ {node.duration}</span>}
                {node.lessonCount && <span>📚 {node.lessonCount} lessons</span>}
                {node.type === 'cpd' && <span style={{ color: 'rgba(164,28,100,0.65)', fontWeight: 600 }}>CPD MODULE</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors"
            style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.35)' }}
            aria-label="Close"
          >
            <svg viewBox="0 0 14 14" width={12} fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {node.description && (
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.42)', maxWidth: 520 }}>
            {node.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          {node.status === 'completed' && node.lessonLink && (
            <Link to={node.lessonLink}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #A41C64, #C0246E)', boxShadow: '0 0 0 1px rgba(164,28,100,0.4), 0 4px 16px rgba(164,28,100,0.38)', color: '#fff' }}>
              Review Lessons
            </Link>
          )}
          {node.status === 'in-progress' && node.lessonLink && (
            <Link to={node.lessonLink}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #C8792A, #E19A47)', boxShadow: '0 0 0 1px rgba(225,154,71,0.4), 0 4px 16px rgba(225,154,71,0.32)', color: '#1a0c00' }}>
              Continue →
            </Link>
          )}
          {node.status === 'available' && node.lessonLink && (
            <Link to={node.lessonLink}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:bg-white/8"
              style={{ border: '1px solid rgba(255,255,255,0.22)' }}>
              Start Module
            </Link>
          )}
          {(node.status === 'locked' || node.status === 'cpd-locked') && (
            <span className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.22)' }}>
              🔒 Locked
            </span>
          )}
          <button onClick={onClose} className="text-xs hover:text-white/55 transition-colors ml-2"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            Dismiss ×
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ SIDEBAR ═════ */

function Sidebar({ learner }: { learner: LearnerStats }) {
  return (
    <aside style={{
      width: 300,
      background: 'rgba(8,8,20,0.97)',
      borderLeft: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 20px',
      backdropFilter: 'blur(18px)',
      minHeight: '100%',
    }}>
      {/* Learner header */}
      <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex-shrink-0 flex items-center justify-center rounded-full font-black text-sm text-white"
          style={{
            width: 48, height: 48,
            background: 'radial-gradient(circle at 35% 30%, #C0246E, #A41C64)',
            boxShadow: '0 0 0 2.5px rgba(164,28,100,0.4), 0 0 18px rgba(164,28,100,0.28)',
          }}>
          {learner.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="text-sm font-bold text-white" style={{ letterSpacing: '-0.015em' }}>
            {learner.name}
          </div>
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5"
            style={{ background: 'rgba(164,28,100,0.14)', color: '#A41C64' }}>
            {learner.role}
          </span>
        </div>
      </div>

      {/* Pathway */}
      <div className="mb-5">
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Pathway</div>
        <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.72)' }}>{learner.pathway}</div>
      </div>

      {/* Overall progress */}
      <div className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Overall Progress
        </div>
        <div className="flex items-end justify-between mb-2">
          <div className="text-3xl font-black" style={{ color: '#A41C64', letterSpacing: '-0.045em' }}>
            {learner.progressPercent}%
          </div>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {learner.lessonsCompleted} of {learner.totalLessons}
            </div>
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>lessons completed</div>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full" style={{ width: `${learner.progressPercent}%`, background: 'linear-gradient(90deg, #A41C64, #C0246E)', transition: 'width 0.7s ease' }} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { val: learner.lessonsCompleted, label: 'Lessons Completed' },
            { val: learner.totalTime,        label: 'Total Learning Time' },
          ].map(({ val, label }) => (
            <div key={label} className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-base font-black text-white" style={{ letterSpacing: '-0.03em' }}>{val}</div>
              <div className="text-[8.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current module */}
      <div className="mb-4">
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Current Module
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(225,154,71,0.07)', border: '1px solid rgba(225,154,71,0.16)' }}>
          <div className="flex items-start gap-2">
            <span style={{ fontSize: '1rem', lineHeight: 1, marginTop: 1 }}>📝</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white leading-snug">{learner.currentModule}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#E19A47' }}>
                In Progress ({learner.currentModuleProgress}%)
              </div>
              <div className="h-1 mt-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${learner.currentModuleProgress}%`, background: '#E19A47' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next lesson */}
      <div className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Next Recommended Lesson
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(164,28,100,0.2)' }}>
              <svg viewBox="0 0 10 12" width={8} fill="#A41C64"><path d="M2 1l7 5-7 5V1z" /></svg>
            </div>
            <div>
              <div className="text-xs font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>
                {learner.nextLessonTitle}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <span>Lesson {learner.nextLessonNumber}</span>
                <span>·</span>
                <span>{learner.nextLessonDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate status */}
      <div className="mb-4">
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Certificate Status
        </div>
        <div className="flex items-center gap-3 rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {learner.certEarned
              ? <span style={{ fontSize: '1.1rem' }}>🏅</span>
              : <svg viewBox="0 0 20 20" width={14} fill="rgba(255,255,255,0.2)">
                  <path d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" />
                </svg>
            }
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: learner.certEarned ? '#C0246E' : 'rgba(255,255,255,0.52)' }}>
              {learner.certEarned ? 'Certificate Earned' : 'Not Yet Earned'}
            </div>
            <div className="text-[9px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {learner.certEarned
                ? 'Active IQ Level 1 Coaching'
                : 'Complete all lessons and pass the assessment to earn your certificate.'}
            </div>
          </div>
        </div>
      </div>

      {/* CPD locked */}
      <div className="mb-6">
        <div className="flex items-start gap-2 rounded-xl p-3"
          style={{ background: 'rgba(164,28,100,0.05)', border: '1px dashed rgba(164,28,100,0.22)' }}>
          <svg viewBox="0 0 20 20" width={13} fill="rgba(164,28,100,0.55)" style={{ marginTop: 2, flexShrink: 0 }}>
            <path d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" />
          </svg>
          <div>
            <div className="text-[10px] font-bold" style={{ color: 'rgba(164,28,100,0.68)' }}>
              Continuing Professional Development (CPD)
            </div>
            <div className="text-[9px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Locked until you complete Coaching Pathway Level 1.
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning CTA */}
      <Link
        to={MOCK_LEARNER.nextLessonLink}
        className="flex items-center justify-center gap-2 w-full rounded-full py-4 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-100"
        style={{
          background: 'linear-gradient(135deg, #A41C64, #C0246E)',
          boxShadow: '0 0 0 1px rgba(164,28,100,0.55), 0 8px 32px rgba(164,28,100,0.52)',
          letterSpacing: '-0.01em',
        }}
      >
        Continue Learning
        <svg viewBox="0 0 20 20" width={16} fill="none">
          <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <Link
        to="/dashboard"
        className="flex items-center justify-center gap-1.5 w-full mt-3 text-xs hover:text-white/55 transition-colors"
        style={{ color: 'rgba(255,255,255,0.25)' }}
      >
        ← Back to Dashboard
      </Link>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════ PAGE ════ */

export default function SkillTree() {
  const { user } = useAuth();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('session');

  const learner: LearnerStats = {
    ...MOCK_LEARNER,
    name: user ? `${user.firstName} ${user.lastName}` : MOCK_LEARNER.name,
    role: user ? (user.role.charAt(0) + user.role.slice(1).toLowerCase()) : MOCK_LEARNER.role,
  };

  const toggleExpand = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  return (
    <>
      <style>{`
        @keyframes skPulse {
          0%, 100% { opacity: 0.85; transform: scale(1);    }
          50%       { opacity: 0.1;  transform: scale(1.55); }
        }
        @keyframes skSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes skPulse   { from, to { opacity: 0.45; transform: none; } }
          @keyframes skSlideUp { from, to { transform: none; opacity: 1; }   }
        }
      `}</style>

      <div className="flex flex-col" style={{ minHeight: '100vh', background: '#080810' }}>
        <Navbar />

        <div className="flex flex-1" style={{ paddingTop: 64, minHeight: 0 }}>

          {/* ── Tree canvas ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto relative" style={{ minHeight: 0 }}>
            <GymBackground />

            {/* Page header */}
            <div className="relative z-10 es-container pt-8 pb-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Link to="/dashboard" className="text-xs transition-colors hover:text-white/55"
                  style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Dashboard
                </Link>
                <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem' }}>›</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  Coaching Pathway Level 1
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
                Coaching Pathway Level 1
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Build the knowledge and practical skills to coach Strongman safely and effectively.
              </p>
            </div>

            <div className="relative z-10 flex justify-center">
              <SkillTreeCanvas
                onNodeClick={setSelectedNode}
                selectedId={selectedNode?.id ?? null}
                expandedId={expandedId}
                onToggleExpand={toggleExpand}
              />
            </div>
          </div>

          {/* ── Sidebar (desktop) ─────────────────────────────────── */}
          <div className="hidden lg:flex lg:flex-col flex-shrink-0" style={{ minHeight: 0 }}>
            <div className="flex-1 overflow-y-auto">
              <Sidebar learner={learner} />
            </div>
          </div>
        </div>

        {/* Mobile sidebar below tree */}
        <div className="lg:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Sidebar learner={learner} />
        </div>

        {/* Bottom detail panel */}
        {selectedNode && (
          <BottomPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </>
  );
}
