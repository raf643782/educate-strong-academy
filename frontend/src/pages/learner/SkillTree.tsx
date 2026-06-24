/**
 * SkillTree - Coaching Pathway Level 1
 * Route: /dashboard/pathway
 *
 * The pathway diagram is intentionally SVG coordinate driven. The supplied
 * reference image uses a fixed visual composition, so the nodes, connectors,
 * CPD band, and labels below are positioned from the canonical 1100 x 820
 * viewBox rather than through normal document layout.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type SkillNodeStatus = 'completed' | 'in-progress' | 'locked' | 'cpd-locked';
type SkillNodeType = 'foundation' | 'lesson' | 'skill' | 'assessment' | 'cpd';

interface SkillNode {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  type: SkillNodeType;
  status: SkillNodeStatus;
  progress?: number;
  x: number;
  y: number;
  icon: string;
  duration?: string;
  lessonCount?: number;
  lessonLink?: string;
}

const PALETTE = {
  page: '#050506',
  canvas: '#08080A',
  deep: '#0B0B0E',
  panel: '#101014',
  panelElevated: '#151519',
  text: '#F5F5F7',
  secondary: '#B8B8BE',
  muted: '#75757D',
  magenta: '#C2186A',
  magentaBright: '#F02C93',
  amber: '#F2A93B',
  lockedGrey: '#4D4D55',
  lockedDark: '#17171B',
} as const;

const LEARNER = {
  name: '',
  role: 'Learner',
  pathway: 'Coaching Pathway Level 1',
  progress: 0,
  lessonsCompleted: 0,
  totalLessons: 0,
  totalTime: '—',
  currentModule: '',
  currentModuleProgress: 0,
  nextLesson: '',
  nextLessonNumber: 0,
  nextLessonDuration: '',
  nextLessonLink: '/dashboard',
  certEarned: false,
};

const NODES: SkillNode[] = [
  { id: 'cpd-mobility', x: 430, y: 145, icon: 'runner', type: 'cpd', status: 'cpd-locked', title: 'Mobility for Strongman', description: 'Evidence-based mobility protocols for Strongman athletes.', duration: '3h 20m', lessonCount: 12 },
  { id: 'cpd-programming', x: 620, y: 145, icon: 'clipboard', type: 'cpd', status: 'cpd-locked', title: 'Programming Essentials', description: 'Periodisation and block programming for Strongman training cycles.', duration: '4h 15m', lessonCount: 15 },
  { id: 'cpd-analysis', x: 810, y: 145, icon: 'barchart', type: 'cpd', status: 'cpd-locked', title: 'Event Analysis', description: 'Video analysis methodology for Strongman events.', duration: '2h 45m', lessonCount: 10 },

  { id: 'foundation', x: 620, y: 255, icon: 'foundation', type: 'foundation', status: 'locked', title: 'Foundation', description: "Core principles of Strongman coaching. Sport history, culture, and the coach's role in athlete development.", duration: '2h 10m', lessonCount: 8 },
  { id: 'intro', x: 620, y: 335, icon: 'coach', type: 'lesson', status: 'locked', title: 'Introduction to Strongman Coaching', description: 'Coaching communication frameworks, athlete relationships, and professional standards.', duration: '3h 05m', lessonCount: 11 },
  { id: 'screening', x: 620, y: 415, icon: 'shield', type: 'lesson', status: 'locked', title: 'Athlete Screening and Safety', description: 'PAR-Q, injury history, movement screening, and safe load progression protocols.', duration: '2h 40m', lessonCount: 9 },
  { id: 'session', x: 620, y: 505, icon: 'whistle', type: 'lesson', status: 'locked', title: 'Session Structure', description: 'Building effective Strongman training sessions. Warm-up protocols, exercise sequencing, and coaching flow.', duration: '3h 50m', lessonCount: 14 },

  { id: 'log-press', x: 210, y: 585, icon: 'log', type: 'skill', status: 'locked', title: 'Log Press', subtitle: 'Fundamentals', description: 'Log clean mechanics, overhead lockout, and loading progressions.', duration: '1h 20m', lessonCount: 5 },
  { id: 'axle-press', x: 360, y: 585, icon: 'axle', type: 'skill', status: 'locked', title: 'Axle Press', subtitle: 'Fundamentals', description: 'Axle bar grip mechanics, continental clean technique, and push press cues.', duration: '55m', lessonCount: 4 },
  { id: 'deadlift', x: 510, y: 585, icon: 'deadlift', type: 'skill', status: 'locked', title: 'Deadlift', subtitle: 'Fundamentals', description: 'Silver dollar, car deadlift, and frame variations. Technique and rules.', duration: '1h 10m', lessonCount: 4 },
  { id: 'farmers-walk', x: 660, y: 585, icon: 'farmers', type: 'skill', status: 'locked', title: "Farmer's Walk", subtitle: 'Fundamentals', description: 'Grip loading, turn mechanics, and pacing strategies for performance.', duration: '50m', lessonCount: 3 },
  { id: 'yoke', x: 810, y: 585, icon: 'yoke', type: 'skill', status: 'locked', title: 'Yoke', subtitle: 'Fundamentals', description: 'Load placement, leg drive mechanics, and visual cuing strategies.', duration: '55m', lessonCount: 3 },
  { id: 'atlas-stones', x: 960, y: 585, icon: 'stone', type: 'skill', status: 'locked', title: 'Atlas Stones', subtitle: 'Fundamentals', description: 'Tacky application, lap mechanics, and safe loading progressions.', duration: '1h 15m', lessonCount: 5 },

  { id: 'practical', x: 620, y: 675, icon: 'users', type: 'assessment', status: 'locked', title: 'Practical Coaching Skills', description: 'Practical session delivery, communication under pressure, and real-time athlete feedback.', duration: '4h 30m', lessonCount: 16 },
  { id: 'assessment', x: 620, y: 755, icon: 'medal', type: 'assessment', status: 'locked', title: 'Assessment Preparation', description: 'Preparing for the Level 1 certificate assessment. Theory test and practical walkthrough.', duration: '2h 00m', lessonCount: 7 },
];

const EVENT_IDS = ['log-press', 'axle-press', 'deadlift', 'farmers-walk', 'yoke', 'atlas-stones'];
const HEX_POINTS = '42,2 78,20 78,44 42,62 6,44 6,20';
const HEX_CX = 42;
const HEX_CY = 32;

const byId = (id: string) => NODES.find((node) => node.id === id)!;

const DISPLAY_Y: Record<string, number> = {
  'cpd-mobility': 145,
  'cpd-programming': 145,
  'cpd-analysis': 145,
  foundation: 255,
  intro: 315,
  screening: 375,
  session: 430,
  'log-press': 525,
  'axle-press': 525,
  deadlift: 525,
  'farmers-walk': 525,
  yoke: 525,
  'atlas-stones': 525,
  practical: 650,
  assessment: 730,
};

const displayY = (node: SkillNode) => DISPLAY_Y[node.id] ?? node.y;

interface PathIconDef {
  d: string;
  fill?: boolean;
}

const PATH_ICONS: Record<string, PathIconDef> = {
  runner: { d: 'M13 5.5A1.7 1.7 0 1 0 13 2.1A1.7 1.7 0 0 0 13 5.5ZM8 22L10.4 16.2L13.4 18.5V22H16V17L12.4 13.7L13.6 8.8L17 12H20V9.3H16.2L13.1 6.2C12.2 5.5 10.7 5.6 10 6.7L7.4 10.8L5 12.1V15L7.8 13.7L9.8 10.7L8.8 15.8L6 22H8Z', fill: true },
  clipboard: { d: 'M8.5 4H6C4.9 4 4 4.9 4 6V21C4 22.1 4.9 23 6 23H18C19.1 23 20 22.1 20 21V6C20 4.9 19.1 4 18 4H15.5M8.5 4C8.5 5.4 9.7 6.5 12 6.5C14.3 6.5 15.5 5.4 15.5 4M8.5 4C8.5 2.9 9.4 2 10.5 2H13.5C14.6 2 15.5 2.9 15.5 4M8 13H16M8 17H13M8 10H16' },
  barchart: { d: 'M6 20V13M12 20V5M18 20V9M4 20H20' },
  foundation: { d: 'M4 20H20M6 18V10H18V18M5 10L12 5L19 10M9 18V13H15V18' },
  coach: { d: 'M3 5H21V17H3V5ZM12 5V17M7 10H10M7 13H12M15.5 11.5L18 9M18 9V13M18 9H14.5' },
  shield: { d: 'M12 3L5 6.2V11.5C5 16 7.9 19.6 12 21C16.1 19.6 19 16 19 11.5V6.2L12 3ZM9 12L11.2 14.2L16 9.4' },
  whistle: { d: 'M9.2 15.5A5.2 5.2 0 1 0 9.2 5.1A5.2 5.2 0 0 0 9.2 15.5ZM9.2 10.3H21M9.2 7.2V10.3M16.6 7.2L18.4 5.8' },
  users: { d: 'M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21M9 11C11.2 11 13 9.2 13 7S11.2 3 9 3 5 4.8 5 7 6.8 11 9 11ZM23 21V19C23 17.1 21.7 15.5 20 15.1M16 3.1C17.7 3.6 19 5.2 19 7S17.7 10.4 16 10.9' },
  medal: { d: 'M12 15C15.3 15 18 12.3 18 9S15.3 3 12 3 6 5.7 6 9 8.7 15 12 15ZM12 15L9.5 22L12 20.5L14.5 22L12 15' },
};

function ScaledPathIcon({ icon, cx, cy, color, size = 19, opacity = 1 }: { icon: string; cx: number; cy: number; color: string; size?: number; opacity?: number }) {
  const def = PATH_ICONS[icon] ?? PATH_ICONS.shield;
  const scale = size / 24;
  const ox = cx - size / 2;
  const oy = cy - size / 2;

  return (
    <path
      d={def.d}
      fill={def.fill ? color : 'none'}
      stroke={def.fill ? 'none' : color}
      strokeWidth={def.fill ? 0 : 1.8 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      transform={`translate(${ox},${oy}) scale(${scale})`}
    />
  );
}

function EventGlyph({ icon, color, locked = false }: { icon: string; color: string; locked?: boolean }) {
  const stroke = locked ? 'rgba(255,255,255,0.55)' : color;
  const fill = locked ? 'rgba(255,255,255,0.22)' : 'rgba(245,245,247,0.82)';

  if (icon === 'log') {
    return (
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="21" y="25" width="35" height="14" rx="7" fill={fill} transform="rotate(-18 38.5 32)" />
        <line x1="14" y1="32" x2="62" y2="32" />
        <circle cx="18" cy="32" r="5" fill={PALETTE.panel} />
        <circle cx="58" cy="32" r="5" fill={PALETTE.panel} />
      </g>
    );
  }

  if (icon === 'axle') {
    return (
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="15" y1="32" x2="69" y2="32" />
        <rect x="20" y="24" width="6" height="16" rx="2" fill={fill} />
        <rect x="58" y="24" width="6" height="16" rx="2" fill={fill} />
        <rect x="28" y="27" width="6" height="10" rx="1.5" fill={fill} />
        <rect x="50" y="27" width="6" height="10" rx="1.5" fill={fill} />
      </g>
    );
  }

  if (icon === 'deadlift') {
    return (
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="15" y1="32" x2="69" y2="32" />
        {[22, 28, 34, 50, 56, 62].map((x) => (
          <rect key={x} x={x} y={19} width="4" height="26" rx="1.5" fill={fill} />
        ))}
      </g>
    );
  }

  if (icon === 'farmers') {
    return (
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 25H38V45H25V32C25 28.1 26.3 25 28 25Z" fill={fill} />
        <path d="M46 25H56C57.7 25 59 28.1 59 32V45H46V25Z" fill={fill} />
        <path d="M31 25V19H35V25M49 25V19H53V25" />
      </g>
    );
  }

  if (icon === 'yoke') {
    return (
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20H64M24 20V48M60 20V48M24 30H60M19 48H31M53 48H65" />
        <rect x="34" y="28" width="16" height="5" rx="2" fill={fill} />
      </g>
    );
  }

  if (icon === 'stone') {
    return (
      <g>
        <circle cx="42" cy="32" r="18" fill="url(#stone-texture)" stroke={stroke} strokeWidth="2" />
        <circle cx="34" cy="25" r="2.2" fill="rgba(255,255,255,0.28)" />
        <circle cx="49" cy="39" r="1.8" fill="rgba(0,0,0,0.28)" />
      </g>
    );
  }

  return <ScaledPathIcon icon={icon} cx={42} cy={32} color={stroke} />;
}

function LockGlyph({ x = 0, y = 0, color = 'rgba(245,245,247,0.68)' }: { x?: number; y?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="4" y="8" width="16" height="13" rx="2.5" fill={color} />
      <path d="M7.5 8V6.2C7.5 3.7 9.5 1.8 12 1.8S16.5 3.7 16.5 6.2V8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function MiniNavIcon({ type }: { type: string }) {
  const props = { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'dashboard') return <svg {...props}><path d="M3 11L12 3L21 11" /><path d="M5 10V21H19V10" /><path d="M9 21V14H15V21" /></svg>;
  if (type === 'courses') return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5Z" /></svg>;
  if (type === 'pathway') return <svg {...props}><path d="M5 5H12V19H5Z" /><path d="M12 7L19 4V18L12 21" /><path d="M8.5 8H10M8.5 12H10M15 9H17M15 13H17" /></svg>;
  if (type === 'hub') return <svg {...props}><path d="M9 18H15" /><path d="M10 22H14" /><path d="M12 2A7 7 0 0 0 8 14C9 15 9.5 16 9.5 18H14.5C14.5 16 15 15 16 14A7 7 0 0 0 12 2Z" /></svg>;
  return <svg {...props}><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 2V6M16 2V6M8 10H16M8 14H13" /></svg>;
}

function BrandMark() {
  return (
    <div className="sk-brand">
      <svg width="50" height="58" viewBox="0 0 52 60" aria-hidden="true">
        <defs>
          <linearGradient id="brandShield" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#151519" />
            <stop offset="1" stopColor="#050506" />
          </linearGradient>
        </defs>
        <path d="M26 3L48 9V36C48 47 38 55 26 58C14 55 4 47 4 36V9L26 3Z" fill="url(#brandShield)" stroke="#F02C93" strokeWidth="2" />
        <path d="M26 8L43 13V35C43 43.5 35.4 50 26 52.5C16.6 50 9 43.5 9 35V13L26 8Z" fill="none" stroke="rgba(245,245,247,0.76)" strokeWidth="1.1" />
        <circle cx="26" cy="18" r="3.2" fill="#F5F5F7" />
        <path d="M26 22L20 29M26 22L32 29M22 28L19 42M30 28L33 42M19 32H33M22 42H18M30 42H34" stroke="#F5F5F7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="sk-wordmark">
        <span>EDUCATE.STRONG</span>
        <small>ACADEMY</small>
      </div>
    </div>
  );
}

function LmsNav({ userName, userRole }: { userName: string; userRole: string }) {
  return (
    <nav className="sk-nav">
      <Link to="/dashboard" className="sk-logo-link" aria-label="Educate Strong Academy dashboard">
        <BrandMark />
      </Link>

      <div className="sk-nav-links">
        {[
          { label: 'Dashboard', to: '/dashboard', type: 'dashboard' },
          { label: 'Courses', to: '/courses', type: 'courses' },
          { label: 'Coaching Pathways', to: '/dashboard/pathway', type: 'pathway', active: true },
          { label: 'Knowledge Hub', to: '/knowledge', type: 'hub' },
          { label: 'Assessments', to: '/assessments', type: 'assessments' },
        ].map((item) => (
          <Link key={item.label} to={item.to} className={`sk-nav-link ${item.active ? 'is-active' : ''}`}>
            <MiniNavIcon type={item.type} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="sk-nav-actions">
        <div className="sk-search">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20L16.5 16.5" />
          </svg>
          <span>Search Academy</span>
        </div>
        <button className="sk-bell" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" />
            <path d="M13.7 21A2 2 0 0 1 10.3 21" />
          </svg>
        </button>
        <div className="sk-top-profile">
          <div style={{ width: 45, height: 45, borderRadius: '999px', background: 'rgba(164,28,100,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', border: '1px solid rgba(255,255,255,0.16)', flexShrink: 0, letterSpacing: '0.04em' }}>
            {userName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() || '?'}
          </div>
          <div>
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>
          <svg viewBox="0 0 12 8" width="10" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M1 1L6 6L11 1" />
          </svg>
        </div>
      </div>
    </nav>
  );
}

function GymBackground() {
  const dust = [
    [90, 88, 1.2], [215, 156, 0.8], [340, 74, 1.1], [505, 180, 0.7], [690, 108, 1.3],
    [860, 162, 0.9], [1040, 96, 1.1], [1130, 250, 0.8], [148, 420, 0.7], [990, 470, 0.9],
    [720, 670, 0.8], [455, 718, 0.7], [1015, 760, 1.1], [600, 36, 0.7], [780, 42, 0.8],
  ];

  return (
    <div className="sk-gym" aria-hidden="true">
      <div className="sk-gym-base" />
      <div className="sk-smoke sk-smoke-one" />
      <div className="sk-smoke sk-smoke-two" />
      <svg className="sk-gym-svg" viewBox="0 0 1216 856" preserveAspectRatio="none">
        <defs>
          <filter id="gymNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <linearGradient id="metalFade" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="rgba(245,245,247,0.20)" />
            <stop offset="0.45" stopColor="rgba(245,245,247,0.08)" />
            <stop offset="1" stopColor="rgba(245,245,247,0.02)" />
          </linearGradient>
          <radialGradient id="stoneBg" cx="35%" cy="28%" r="72%">
            <stop stopColor="rgba(245,245,247,0.30)" />
            <stop offset="1" stopColor="rgba(245,245,247,0.035)" />
          </radialGradient>
        </defs>

        <rect width="1216" height="856" fill="url(#gymNoise)" opacity="0.105" />

        <g opacity="0.19">
          <rect x="32" y="112" width="28" height="618" rx="3" fill="url(#metalFade)" />
          <rect x="206" y="194" width="22" height="530" rx="3" fill="url(#metalFade)" />
          <rect x="48" y="322" width="176" height="16" rx="4" fill="rgba(245,245,247,0.16)" />
          <rect x="44" y="434" width="175" height="13" rx="4" fill="rgba(245,245,247,0.10)" />
          <rect x="22" y="688" width="86" height="15" rx="4" fill="rgba(245,245,247,0.16)" />
          <rect x="178" y="688" width="79" height="15" rx="4" fill="rgba(245,245,247,0.12)" />
          <text x="95" y="332" fill="rgba(245,245,247,0.32)" fontSize="10" fontWeight="800" letterSpacing="1.3" transform="rotate(8 95 332)">EDUCATE.STRONG</text>
          {[154, 180, 207, 234, 286, 340, 408, 485, 566, 646].map((y) => (
            <g key={y}>
              <circle cx="46" cy={y} r="4" fill="rgba(5,5,6,0.95)" />
              <circle cx="217" cy={y + 5} r="4" fill="rgba(5,5,6,0.95)" />
            </g>
          ))}
        </g>

        <g opacity="0.14">
          <rect x="1086" y="330" width="24" height="280" rx="3" fill="rgba(245,245,247,0.18)" />
          <rect x="1145" y="302" width="50" height="188" rx="22" fill="rgba(245,245,247,0.14)" transform="rotate(8 1170 396)" />
          <rect x="1148" y="367" width="46" height="8" rx="3" fill="rgba(5,5,6,0.62)" transform="rotate(8 1171 371)" />
          <rect x="1148" y="440" width="46" height="8" rx="3" fill="rgba(5,5,6,0.60)" transform="rotate(8 1171 444)" />
          <text x="1172" y="410" textAnchor="middle" fill="rgba(5,5,6,0.75)" fontSize="8" fontWeight="800" letterSpacing="1.5" transform="rotate(98 1172 410)">EDUCATE.STRONG</text>
        </g>

        <g opacity="0.18">
          <ellipse cx="42" cy="706" rx="46" ry="50" fill="url(#stoneBg)" />
          <ellipse cx="1192" cy="704" rx="58" ry="64" fill="url(#stoneBg)" />
          <ellipse cx="1130" cy="718" rx="34" ry="36" fill="url(#stoneBg)" opacity="0.65" />
          <g transform="translate(78 608)">
            {[0, 12, 24, 36, 48].map((x) => (
              <ellipse key={x} cx={x} cy="82" rx="24" ry="20" fill="rgba(245,245,247,0.12)" />
            ))}
            <rect x="0" y="24" width="10" height="60" rx="3" fill="rgba(245,245,247,0.13)" />
            <rect x="84" y="18" width="10" height="66" rx="3" fill="rgba(245,245,247,0.10)" />
          </g>
        </g>

        <g opacity="0.42">
          {dust.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="rgba(245,245,247,0.62)" />
          ))}
        </g>
      </svg>
      <div className="sk-row-glow" />
      <div className="sk-vignette" />
      <div className="sk-top-fade" />
      <div className="sk-bottom-fade" />
    </div>
  );
}

function SkillTreeSVG({ onNodeClick, selectedId, eventsExpanded, onToggleEvents }: { onNodeClick: (node: SkillNode) => void; selectedId: string | null; eventsExpanded: boolean; onToggleEvents: () => void }) {
  const foundationY = displayY(byId('foundation'));
  const introY = displayY(byId('intro'));
  const screeningY = displayY(byId('screening'));
  const sessionY = displayY(byId('session'));
  const eventY = displayY(byId('log-press'));
  const practicalY = displayY(byId('practical'));
  const assessmentY = displayY(byId('assessment'));
  const foundationBottom = foundationY + HEX_CY;
  const introTop = introY - HEX_CY;
  const introBottom = introY + HEX_CY;
  const screeningTop = screeningY - HEX_CY;
  const screeningBottom = screeningY + HEX_CY;
  const sessionTop = sessionY - HEX_CY;
  const sessionBottom = sessionY + HEX_CY;
  const eventTop = eventY - HEX_CY;
  const eventBottom = eventY + HEX_CY;
  const practicalTop = practicalY - HEX_CY;
  const practicalBottom = practicalY + HEX_CY;
  const assessmentTop = assessmentY - HEX_CY;
  const eventLineY = 476;

  const handleNodeClick = (node: SkillNode) => {
    if (node.id === 'session') onToggleEvents();
    onNodeClick(node);
  };

  function nodeFill(node: SkillNode) {
    if (node.status === 'completed') return `url(#completed-${node.id})`;
    if (node.status === 'in-progress') return `url(#active-${node.id})`;
    return '#111114';
  }

  function nodeStroke(node: SkillNode) {
    if (node.status === 'completed') return PALETTE.magentaBright;
    if (node.status === 'in-progress') return PALETTE.amber;
    if (node.status === 'cpd-locked') return 'rgba(240,44,147,0.36)';
    return 'rgba(255,255,255,0.24)';
  }

  function nodeOpacity(node: SkillNode) {
    if (node.status === 'locked') return 0.48;
    if (node.status === 'cpd-locked') return 0.62;
    return 1;
  }

  function nodeFilter(node: SkillNode) {
    if (node.status === 'completed') return 'url(#nodeGlowMagenta)';
    if (node.status === 'in-progress') return 'url(#nodeGlowAmber)';
    return undefined;
  }

  function iconColor(node: SkillNode) {
    if (node.status === 'in-progress') return PALETTE.amber;
    if (node.status === 'completed') return '#F5F5F7';
    return 'rgba(245,245,247,0.58)';
  }

  function renderNode(node: SkillNode) {
    const tx = node.x - HEX_CX;
    const ty = displayY(node) - HEX_CY;

    return (
      <g
        key={node.id}
        transform={`translate(${tx},${ty})`}
        className="sk-svg-node"
        onClick={() => handleNodeClick(node)}
        onKeyDown={(event) => event.key === 'Enter' && handleNodeClick(node)}
        role="button"
        tabIndex={0}
        aria-label={node.title}
      >
        {selectedId === node.id && (
          <ellipse cx={42} cy={32} rx={55} ry={42} fill="none" stroke={node.status === 'in-progress' ? 'rgba(242,169,59,0.55)' : 'rgba(240,44,147,0.48)'} strokeWidth="1.8" />
        )}

        {node.status === 'in-progress' && (
          <ellipse cx={42} cy={32} rx={57} ry={43} fill="rgba(242,169,59,0.13)" className="sk-node-pulse" />
        )}

        <g filter={nodeFilter(node)} opacity={nodeOpacity(node)}>
          <polygon points={HEX_POINTS} fill={nodeFill(node)} stroke={nodeStroke(node)} strokeWidth="2" strokeDasharray={node.status === 'cpd-locked' ? '6 5' : undefined} />
          {(node.status === 'completed' || node.status === 'in-progress') && (
            <polygon points="42,7 72,22 72,42 42,57 12,42 12,22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          )}
        </g>

        {EVENT_IDS.includes(node.id) || node.id === 'atlas-stones' ? (
          <EventGlyph icon={node.icon} color={iconColor(node)} locked={node.status === 'locked'} />
        ) : (
          <ScaledPathIcon icon={node.icon} cx={42} cy={30} color={iconColor(node)} size={node.status === 'cpd-locked' || node.status === 'locked' ? 17 : 20} opacity={node.status === 'locked' || node.status === 'cpd-locked' ? 0.74 : 1} />
        )}

        {node.status === 'completed' && (
          <g transform="translate(65,51)">
            <circle cx="0" cy="0" r="12" fill="#2B0B1E" stroke="#F02C93" strokeWidth="1.7" />
            <path d="M-5.2 0L-1.8 3.7L5.5 -4.1" fill="none" stroke="#F5F5F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {node.status === 'in-progress' && node.progress !== undefined && (
          <g transform="translate(92,32)">
            <circle cx="0" cy="0" r="28" fill="#0C0C10" stroke="#F2A93B" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#F2A93B" fontSize="12" fontWeight="800" fontFamily="Inter, system-ui, sans-serif">{node.progress}%</text>
          </g>
        )}

        {(node.status === 'locked' || node.status === 'cpd-locked') && (
          <LockGlyph x={node.status === 'cpd-locked' ? 66 : 70} y={node.status === 'cpd-locked' ? 37 : 43} />
        )}
      </g>
    );
  }

  function renderLabels() {
    return (
      <g className="sk-tree-labels" pointerEvents="none">
        {['cpd-mobility', 'cpd-programming', 'cpd-analysis'].map((id) => {
          const node = byId(id);
          return (
            <text key={id} x={node.x} y={displayY(node) + 51} textAnchor="middle" fill="#B8B8BE" opacity="0.8" fontSize="11" fontWeight="500">
              {node.title}
            </text>
          );
        })}

        {['foundation', 'intro', 'screening'].map((id) => {
          const node = byId(id);
          return (
            <text key={id} x={node.x + 74} y={displayY(node) + 4} fill="#F5F5F7" fontSize="15" fontWeight="600" dominantBaseline="middle">
              {node.title}
            </text>
          );
        })}

        <g>
          <text x="712" y={sessionY - 3} fill="#B8B8BE" fontSize="15" fontWeight="600">Session Structure</text>
          <text x="712" y={sessionY + 18} fill="#75757D" fontSize="12" fontWeight="500">Locked</text>
        </g>

        {eventsExpanded && EVENT_IDS.map((id) => {
          const node = byId(id);
          const y = displayY(node);
          return (
            <g key={id}>
              <text x={node.x} y={y + 52} textAnchor="middle" fill="#F5F5F7" fontSize="13" fontWeight="600">{node.title}</text>
              <text x={node.x} y={y + 69} textAnchor="middle" fill="#F5F5F7" fontSize="13" fontWeight="600">{node.subtitle}</text>
            </g>
          );
        })}

        {['practical', 'assessment'].map((id) => {
          const node = byId(id);
          const y = displayY(node);
          return (
            <g key={id} opacity="0.72">
              <text x={node.x + 74} y={y - 2} fill="#B8B8BE" fontSize="14" fontWeight="600">{node.title}</text>
              <text x={node.x + 74} y={y + 18} fill="#75757D" fontSize="12" fontWeight="500">Locked</text>
            </g>
          );
        })}
      </g>
    );
  }

  const visibleCompleted = NODES.filter((node) => node.status === 'completed' && (eventsExpanded || !EVENT_IDS.includes(node.id)));

  return (
    <svg className="sk-tree-svg" viewBox="0 0 1100 820" width="100%" height="100%" aria-label="Coaching Pathway Level 1 skill tree">
      <defs>
        {NODES.filter((node) => node.status === 'completed').map((node) => (
          <radialGradient key={node.id} id={`completed-${node.id}`} cx="35%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#5B1239" />
            <stop offset="100%" stopColor="#161016" />
          </radialGradient>
        ))}
        {NODES.filter((node) => node.status === 'in-progress').map((node) => (
          <radialGradient key={node.id} id={`active-${node.id}`} cx="35%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#5A3514" />
            <stop offset="100%" stopColor="#17120B" />
          </radialGradient>
        ))}
        <radialGradient id="stone-texture" cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#D4C6B8" />
          <stop offset="52%" stopColor="#746760" />
          <stop offset="100%" stopColor="#211C1D" />
        </radialGradient>
        <linearGradient id="completedToAmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F02C93" />
          <stop offset="100%" stopColor="#F2A93B" />
        </linearGradient>
        <filter id="nodeGlowMagenta" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4.8" result="blur" />
          <feFlood floodColor="#F02C93" floodOpacity="0.72" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlowAmber" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
          <feFlood floodColor="#F2A93B" floodOpacity="0.70" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lineGlow" x="-12%" y="-500%" width="124%" height="1100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="big" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="small" />
          <feMerge><feMergeNode in="big" /><feMergeNode in="small" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="360" y="70" width="600" height="145" rx="8" fill="rgba(255,255,255,0.026)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <LockGlyph x={484} y={82} color="rgba(245,245,247,0.64)" />
      <text x="660" y="94" textAnchor="middle" fill="#F5F5F7" opacity="0.8" fontSize="11" fontWeight="800" letterSpacing="1.6">CONTINUING PROFESSIONAL DEVELOPMENT (CPD)</text>
      <text x="660" y="113" textAnchor="middle" fill="#B8B8BE" opacity="0.86" fontSize="11">Locked until Level 1 completion</text>

      <line x1="472" y1="145" x2="578" y2="145" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeDasharray="6 6" />
      <line x1="662" y1="145" x2="768" y2="145" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeDasharray="6 6" />
      <line x1="620" y1="215" x2="620" y2="223" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 5" />

      <line x1="620" y1={foundationBottom} x2="620" y2={introTop} stroke="rgba(255,255,255,0.22)" strokeWidth="1.7" strokeDasharray="6 6" />
      <line x1="620" y1={introBottom} x2="620" y2={screeningTop} stroke="rgba(255,255,255,0.22)" strokeWidth="1.7" strokeDasharray="6 6" />
      <line x1="620" y1={screeningBottom} x2="620" y2={sessionTop} stroke="rgba(255,255,255,0.22)" strokeWidth="1.7" strokeDasharray="6 6" />

      {eventsExpanded && (
        <g>
          <line x1="620" y1={sessionBottom} x2="620" y2={eventLineY} stroke="rgba(255,255,255,0.22)" strokeWidth="1.7" strokeDasharray="6 6" />
          <path d={`M210 ${eventLineY}H960`} stroke="rgba(255,255,255,0.22)" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="6 6" />
          {EVENT_IDS.map((id) => {
            const node = byId(id);
            return <line key={id} x1={node.x} y1={eventLineY} x2={node.x} y2={eventTop} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="5 5" />;
          })}
        </g>
      )}

      <line x1="620" y1={eventsExpanded ? eventBottom : sessionBottom + 8} x2="620" y2={practicalTop} stroke="rgba(255,255,255,0.34)" strokeWidth="1.7" strokeDasharray="6 6" />
      <line x1="620" y1={practicalBottom} x2="620" y2={assessmentTop} stroke="rgba(255,255,255,0.30)" strokeWidth="1.7" strokeDasharray="6 6" />

      {NODES.filter((node) => node.status === 'locked').map(renderNode)}
      {NODES.filter((node) => node.status === 'cpd-locked').map(renderNode)}
      {visibleCompleted.map(renderNode)}
      {NODES.filter((node) => node.status === 'in-progress').map(renderNode)}
      {renderLabels()}
    </svg>
  );
}

function SidebarIcon({ type, color = PALETTE.magentaBright }: { type: string; color?: string }) {
  const props = { viewBox: '0 0 24 24', width: 31, height: 31, fill: 'none', stroke: color, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'lessons') return <svg {...props}><path d="M3 7L12 3L21 7L12 11L3 7Z" /><path d="M5 10V15L12 19L19 15V10" /></svg>;
  if (type === 'time') return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7V12L16 15" /></svg>;
  if (type === 'whistle') return <svg {...props} stroke={color}><circle cx="9.5" cy="12" r="5.3" /><path d="M9.5 6.8H21M9.5 9.6V12M16.5 8L18.2 6.5" /></svg>;
  if (type === 'play') return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M10 8.5L16 12L10 15.5V8.5Z" fill={color} stroke="none" /></svg>;
  if (type === 'cert') return <svg {...props}><circle cx="12" cy="8" r="5" /><path d="M8 13L6 22L12 18.5L18 22L16 13" /><path d="M9.5 8L11.3 9.8L15 6.2" /></svg>;
  return <svg {...props}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7A4 4 0 0 1 16 7V11" /></svg>;
}

function LearnerSidebar({ learner }: { learner: typeof LEARNER }) {
  const nameForInitials = learner.name || 'Your Coaching Pathway';
  const initials = nameForInitials
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase() || '?';

  const displayLabel = learner.name || 'Your Coaching Pathway';

  return (
    <aside className="sk-sidebar">
      <div className="sk-sidebar-head">
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(164,28,100,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff', flexShrink: 0, letterSpacing: '0.04em' }}>
          {initials}
        </div>
        <div>
          <h2>{displayLabel}</h2>
          <span>{learner.role}</span>
        </div>
      </div>

      <section className="sk-sidebar-section">
        <p className="sk-kicker">Pathway</p>
        <p className="sk-path-name">{learner.pathway}</p>
      </section>

      <section className="sk-sidebar-section">
        <p className="sk-kicker">Overall Progress</p>
        <p style={{ color: 'rgba(245,245,247,0.45)', fontSize: '13px', lineHeight: 1.6, marginTop: '8px' }}>
          No course activity has been recorded yet. Progress will appear once your course activity begins.
        </p>
      </section>

      <section className="sk-sidebar-section">
        <p className="sk-kicker">Certificate Status</p>
        <div className="sk-cert-row">
          <SidebarIcon type="cert" />
          <div>
            <strong>Not Yet Earned</strong>
            <span>Complete all lessons and pass the assessment to earn your certificate.</span>
          </div>
        </div>
      </section>

      <div className="sk-cpd-notice">
        <SidebarIcon type="lock" color="rgba(245,245,247,0.62)" />
        <p>Continuing Professional Development (CPD) is locked until you complete Coaching Pathway Level 1.</p>
      </div>
    </aside>
  );
}

function NodeDetailPanel({ node, onClose }: { node: SkillNode; onClose: () => void }) {
  const color = node.status === 'in-progress' ? PALETTE.amber : node.status === 'completed' ? PALETTE.magentaBright : PALETTE.secondary;
  const label = node.status === 'cpd-locked' ? 'CPD Locked' : node.status === 'in-progress' ? 'In Progress' : node.status === 'completed' ? 'Complete' : 'Locked';

  return (
    <div className="sk-detail-panel">
      <div>
        <div className="sk-detail-title">
          <strong>{node.title}{node.subtitle ? ` - ${node.subtitle}` : ''}</strong>
          <span style={{ color, borderColor: color }}>{label}</span>
          {node.duration && <em>{node.duration} | {node.lessonCount} lessons</em>}
        </div>
        <p>{node.description}</p>
        {node.status !== 'locked' && node.status !== 'cpd-locked' ? (
          <Link to={`/learn/${node.id}`} className={node.status === 'in-progress' ? 'sk-detail-action amber' : 'sk-detail-action'}>{node.status === 'in-progress' ? 'Continue' : 'Review Lessons'}</Link>
        ) : (
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '10px 0 0', fontStyle: 'italic' }}>Lesson links will appear when course content is published.</p>
        )}
      </div>
      <button onClick={onClose} aria-label="Close details">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 2L14 14M14 2L2 14" />
        </svg>
      </button>
    </div>
  );
}

export default function SkillTree() {
  const { user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Your Coaching Pathway';
  const displayRole = user ? (user.role.charAt(0) + user.role.slice(1).toLowerCase()) : LEARNER.role;
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [eventsExpanded, setEventsExpanded] = useState(true);

  return (
    <>
      <style>{`
        :root {
          --sk-page: ${PALETTE.page};
          --sk-canvas: ${PALETTE.canvas};
          --sk-deep: ${PALETTE.deep};
          --sk-panel: ${PALETTE.panel};
          --sk-panel-elevated: ${PALETTE.panelElevated};
          --sk-text: ${PALETTE.text};
          --sk-secondary: ${PALETTE.secondary};
          --sk-muted: ${PALETTE.muted};
          --sk-magenta: ${PALETTE.magenta};
          --sk-magenta-bright: ${PALETTE.magentaBright};
          --sk-amber: ${PALETTE.amber};
        }
        @keyframes skNodePulse {
          0%, 100% { opacity: 0.78; transform: scale(1); }
          50% { opacity: 0.16; transform: scale(1.38); }
        }
        @keyframes skDetailIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .sk-page-root {
          min-height: 100vh;
          background: var(--sk-page);
          color: var(--sk-text);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }
        .sk-nav {
          position: fixed;
          z-index: 100;
          inset: 0 0 auto 0;
          height: 80px;
          display: flex;
          align-items: center;
          gap: 34px;
          padding: 0 28px;
          background: rgba(5, 5, 6, 0.96);
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.02);
        }
        .sk-logo-link { text-decoration: none; color: inherit; flex: 0 0 286px; }
        .sk-brand { display: flex; align-items: center; gap: 10px; }
        .sk-wordmark span {
          display: block;
          color: #F5F5F7;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.055em;
          line-height: 1;
          text-shadow: 0 0 18px rgba(255,255,255,0.05);
        }
        .sk-wordmark small {
          display: block;
          margin-top: 6px;
          color: #F02C93;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.34em;
          text-align: right;
          line-height: 1;
        }
        .sk-nav-links {
          display: flex;
          align-items: stretch;
          justify-content: center;
          align-self: stretch;
          gap: 34px;
          flex: 1 1 auto;
        }
        .sk-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(245,245,247,0.72);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .sk-nav-link.is-active { color: #F02C93; }
        .sk-nav-link.is-active:after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: #F02C93;
          box-shadow: 0 0 18px rgba(240,44,147,0.45);
        }
        .sk-nav-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          flex: 0 0 auto;
        }
        .sk-search {
          width: 240px;
          height: 42px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.11);
          background: rgba(255,255,255,0.045);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          color: rgba(245,245,247,0.58);
        }
        .sk-search span { color: rgba(245,245,247,0.46); font-size: 14px; }
        .sk-bell {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.11);
          background: transparent;
          color: rgba(245,245,247,0.72);
          display: grid;
          place-items: center;
        }
        .sk-top-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(245,245,247,0.7);
        }
        .sk-top-profile img {
          width: 45px;
          height: 45px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 19%;
          filter: brightness(0.74) contrast(1.14) saturate(0.78);
          border: 1px solid rgba(255,255,255,0.16);
        }
        .sk-top-profile strong { display: block; color: #F5F5F7; font-size: 13px; font-weight: 800; line-height: 1.15; }
        .sk-top-profile span { display: block; margin-top: 4px; color: #F02C93; font-size: 12px; font-weight: 700; }
        .sk-main {
          padding-top: 80px;
          min-height: 100vh;
          display: flex;
          align-items: stretch;
        }
        .sk-left {
          position: relative;
          flex: 1 1 auto;
          min-width: 0;
          min-height: calc(100vh - 80px);
          overflow: hidden;
          background: #08080A;
        }
        .sk-gym, .sk-gym-base, .sk-gym-svg, .sk-smoke, .sk-vignette, .sk-top-fade, .sk-bottom-fade, .sk-row-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .sk-gym-base {
          background:
            radial-gradient(ellipse 60% 42% at 51% 60%, rgba(240,44,147,0.09) 0%, transparent 62%),
            radial-gradient(ellipse 44% 48% at 48% 24%, rgba(240,44,147,0.075) 0%, transparent 58%),
            linear-gradient(180deg, #09090B 0%, #050506 100%);
        }
        .sk-smoke {
          opacity: 0.18;
          mix-blend-mode: screen;
          filter: blur(18px);
        }
        .sk-smoke-one {
          background: radial-gradient(ellipse 50% 24% at 44% 38%, rgba(245,245,247,0.16), transparent 70%);
        }
        .sk-smoke-two {
          background: radial-gradient(ellipse 46% 22% at 48% 70%, rgba(240,44,147,0.16), transparent 68%);
        }
        .sk-gym-svg { width: 100%; height: 100%; }
        .sk-row-glow {
          top: 58%;
          height: 22%;
          background: radial-gradient(ellipse 70% 75% at 47% 45%, rgba(240,44,147,0.16) 0%, rgba(240,44,147,0.045) 48%, transparent 72%);
        }
        .sk-vignette {
          background:
            radial-gradient(ellipse 98% 92% at 50% 52%, transparent 22%, rgba(5,5,6,0.54) 72%, rgba(5,5,6,0.96) 100%),
            linear-gradient(90deg, rgba(5,5,6,0.3), transparent 13%, transparent 75%, rgba(5,5,6,0.88));
        }
        .sk-top-fade { height: 170px; bottom: auto; background: linear-gradient(180deg, rgba(5,5,6,0.92), transparent); }
        .sk-bottom-fade { top: auto; height: 170px; background: linear-gradient(0deg, rgba(5,5,6,0.96), transparent); }
        .sk-title-block {
          position: absolute;
          z-index: 3;
          top: 24px;
          left: 28px;
        }
        .sk-title-block h1 {
          margin: 0;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", Oswald, sans-serif;
          color: #F5F5F7;
          text-transform: uppercase;
          font-size: 42px;
          line-height: 0.96;
          letter-spacing: 0.055em;
          font-weight: 900;
          text-shadow: 0 0 18px rgba(255,255,255,0.04);
        }
        .sk-title-block p {
          margin: 11px 0 0;
          color: #B8B8BE;
          font-size: 14px;
          line-height: 1.35;
        }
        .sk-stage-scroll {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .sk-svg-stage {
          position: absolute;
          top: 24px;
          left: 0;
          width: 1130px;
          height: 842px;
        }
        .sk-tree-svg {
          display: block;
          overflow: visible;
          font-family: Inter, system-ui, sans-serif;
        }
        .sk-svg-node {
          cursor: pointer;
          outline: none;
        }
        .sk-svg-node:focus-visible polygon {
          stroke-width: 3;
        }
        .sk-node-pulse {
          animation: skNodePulse 2.5s ease-in-out infinite;
          transform-origin: 42px 32px;
        }
        .sk-tree-labels text {
          paint-order: stroke;
          stroke: rgba(5,5,6,0.78);
          stroke-width: 3px;
          stroke-linejoin: round;
        }
        .sk-sidebar-rail {
          position: sticky;
          top: 80px;
          z-index: 5;
          width: 456px;
          flex: 0 0 456px;
          height: calc(100vh - 80px);
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding-top: 22px;
          padding-left: 0;
          background: linear-gradient(90deg, rgba(5,5,6,0.1), #050506 28%);
        }
        .sk-sidebar {
          width: 420px;
          max-height: calc(100vh - 104px);
          overflow-y: auto;
          background: linear-gradient(180deg, rgba(20,20,24,0.94), rgba(11,11,14,0.96));
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 26px 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }
        .sk-sidebar-head {
          display: flex;
          align-items: center;
          gap: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .sk-sidebar-head img {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 18%;
          filter: brightness(0.72) contrast(1.16) saturate(0.72);
          border: 1px solid rgba(255,255,255,0.16);
        }
        .sk-sidebar h2 {
          margin: 0;
          font-size: 22px;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #F5F5F7;
        }
        .sk-sidebar-head span { display: block; margin-top: 7px; color: #F02C93; font-size: 14px; font-weight: 700; }
        .sk-sidebar-section {
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .sk-kicker {
          margin: 0 0 8px;
          color: rgba(184,184,190,0.74);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sk-kicker.amber { color: #F2A93B; }
        .sk-path-name {
          margin: 0;
          color: #F5F5F7;
          font-size: 16px;
          line-height: 1.3;
        }
        .sk-progress-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 13px;
        }
        .sk-progress-row strong {
          color: #F02C93;
          font-size: 33px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        .sk-progress-row span {
          color: #B8B8BE;
          font-size: 13px;
          line-height: 1.32;
          text-align: left;
          padding-top: 3px;
        }
        .sk-progress-track {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,0.12);
        }
        .sk-progress-track div {
          height: 100%;
          border-radius: inherit;
          background: #C2186A;
          box-shadow: 0 0 18px rgba(240,44,147,0.38);
        }
        .sk-stat-row {
          display: flex;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .sk-stat {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sk-stat span, .sk-module-row span, .sk-lesson-row span, .sk-cert-row span {
          display: block;
          color: #B8B8BE;
          font-size: 12px;
          line-height: 1.35;
        }
        .sk-stat strong {
          display: block;
          margin-top: 2px;
          color: #F5F5F7;
          font-size: 15px;
        }
        .sk-module-row, .sk-lesson-row, .sk-cert-row, .sk-cpd-notice {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sk-module-row strong, .sk-lesson-row strong, .sk-cert-row strong {
          display: block;
          color: #F5F5F7;
          font-size: 16px;
          margin-bottom: 3px;
          line-height: 1.2;
        }
        .sk-module-row span { color: #F2A93B; font-weight: 700; }
        .sk-cert-row { align-items: flex-start; }
        .sk-cert-row span { max-width: 260px; }
        .sk-cpd-notice {
          margin-top: 13px;
          padding: 13px 15px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.055));
          border: 1px solid rgba(255,255,255,0.08);
        }
        .sk-cpd-notice p {
          margin: 0;
          color: #D3D3D8;
          font-size: 12px;
          line-height: 1.35;
        }
        .sk-cta {
          margin-top: 13px;
          height: 52px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          background: linear-gradient(90deg, #B91563, #E02B83);
          color: white;
          text-decoration: none;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.05em;
          box-shadow: 0 14px 32px rgba(194,24,106,0.28), inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .sk-detail-panel {
          position: fixed;
          z-index: 180;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 19px 32px 22px;
          background: rgba(12,12,16,0.96);
          border-top: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 -18px 64px rgba(0,0,0,0.72);
          backdrop-filter: blur(18px);
          animation: skDetailIn 0.2s ease-out;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }
        .sk-detail-panel > div { max-width: 780px; }
        .sk-detail-title {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 11px;
        }
        .sk-detail-title strong { color: #F5F5F7; font-size: 16px; }
        .sk-detail-title span {
          border: 1px solid currentColor;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: rgba(255,255,255,0.05);
        }
        .sk-detail-title em {
          color: #75757D;
          font-style: normal;
          font-size: 13px;
        }
        .sk-detail-panel p {
          margin: 9px 0 13px;
          color: #B8B8BE;
          max-width: 620px;
          line-height: 1.45;
          font-size: 14px;
        }
        .sk-detail-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 20px;
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          background: linear-gradient(90deg, #B91563, #E02B83);
        }
        .sk-detail-action.amber {
          background: linear-gradient(90deg, #B97622, #F2A93B);
          color: #17120B;
        }
        .sk-detail-panel button {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(245,245,247,0.72);
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        @media (max-width: 1320px) {
          .sk-nav { gap: 20px; padding-left: 22px; padding-right: 22px; }
          .sk-logo-link { flex-basis: 270px; }
          .sk-nav-links { gap: 20px; }
          .sk-search { width: 210px; }
          .sk-sidebar-rail { width: 436px; flex-basis: 436px; }
        }
        @media (max-width: 1120px) {
          .sk-page-root { overflow: auto; }
          .sk-nav { position: sticky; overflow-x: auto; }
          .sk-nav-links { justify-content: flex-start; }
          .sk-nav-actions { margin-left: auto; }
          .sk-search { display: none; }
          .sk-main { display: block; }
          .sk-left { min-height: 900px; overflow-x: auto; }
          .sk-stage-scroll { overflow-x: auto; }
          .sk-svg-stage { min-width: 1130px; }
          .sk-sidebar-rail {
            position: relative;
            top: auto;
            width: 100%;
            height: auto;
            padding: 22px 20px 30px;
            background: #050506;
          }
          .sk-sidebar { width: min(420px, 100%); max-height: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sk-node-pulse, .sk-detail-panel { animation: none !important; }
        }
      `}</style>

      <div className="sk-page-root">
        <LmsNav userName={displayName} userRole={displayRole} />

        <main className="sk-main">
          <section className="sk-left">
            <GymBackground />
            <div className="sk-title-block">
              <h1>Coaching Pathway Level 1</h1>
              <p>Build the knowledge and practical skills to coach Strongman safely and effectively.</p>
            </div>
            <div className="sk-stage-scroll">
              <div className="sk-svg-stage">
                <SkillTreeSVG
                  onNodeClick={setSelectedNode}
                  selectedId={selectedNode?.id ?? null}
                  eventsExpanded={eventsExpanded}
                  onToggleEvents={() => setEventsExpanded((expanded) => !expanded)}
                />
              </div>
            </div>
          </section>

          <div className="sk-sidebar-rail">
            <LearnerSidebar learner={{ ...LEARNER, name: displayName, role: displayRole }} />
          </div>
        </main>

        {selectedNode && <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
      </div>
    </>
  );
}
