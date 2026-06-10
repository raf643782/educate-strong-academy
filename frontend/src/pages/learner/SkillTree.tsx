/**
 * SkillTree — Coaching Pathway Level 1
 * Full SVG coordinate-driven rewrite matching design screenshot.
 * Route: /dashboard/pathway  (ProtectedRoute)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════════ TYPES ═══ */

type SkillNodeStatus = 'completed' | 'in-progress' | 'available' | 'locked' | 'cpd-locked';
type SkillNodeType   = 'foundation' | 'lesson' | 'skill' | 'assessment' | 'cpd';

interface SkillNode {
  id          : string;
  title       : string;
  subtitle?   : string;
  description : string;
  type        : SkillNodeType;
  status      : SkillNodeStatus;
  progress?   : number;
  x           : number;
  y           : number;
  icon        : string;
  duration?   : string;
  lessonCount?: number;
  lessonLink? : string;
}

/* ═══════════════════════════════════════════════════════════ DATA ════ */

const LEARNER = {
  name               : 'James Mitchell',
  role               : 'Learner',
  pathway            : 'Coaching Pathway Level 1',
  progress           : 42,
  lessonsCompleted   : 42,
  totalLessons       : 100,
  totalTime          : '12h 35m',
  currentModule      : 'Session Structure',
  currentModuleProgress: 65,
  nextLesson         : 'Session Planning Principles',
  nextLessonNumber   : 18,
  nextLessonDuration : '25 min',
  nextLessonLink     : '/learn/level-1-coaching-strongman/lessons/18',
  certEarned         : false,
};

const NODES: SkillNode[] = [
  /* CPD row ─ y=145 */
  { id:'cpd-mobility',    x:430,  y:145, icon:'runner',   type:'cpd',        status:'cpd-locked', title:'Mobility for Strongman',          description:'Evidence-based mobility protocols for Strongman athletes.',          duration:'3h 20m', lessonCount:12 },
  { id:'cpd-programming', x:620,  y:145, icon:'clipboard',type:'cpd',        status:'cpd-locked', title:'Programming Essentials',          description:'Periodisation and block programming for Strongman training cycles.',  duration:'4h 15m', lessonCount:15 },
  { id:'cpd-analysis',    x:810,  y:145, icon:'barchart', type:'cpd',        status:'cpd-locked', title:'Event Analysis',                  description:'Video analysis methodology for Strongman events.',                   duration:'2h 45m', lessonCount:10 },
  /* Spine ─ y=255…505 */
  { id:'foundation', x:620, y:255, icon:'landmark', type:'foundation', status:'completed',   title:'Foundation',                        description:"Core principles of Strongman coaching. Sport history, culture, and the coach's role in athlete development.", duration:'2h 10m', lessonCount:8,  lessonLink:'/learn/level-1-coaching-strongman/lessons/1'  },
  { id:'intro',      x:620, y:335, icon:'present',  type:'lesson',     status:'completed',   title:'Introduction to Strongman Coaching', description:'Coaching communication frameworks, athlete relationships, and professional standards.',                          duration:'3h 05m', lessonCount:11, lessonLink:'/learn/level-1-coaching-strongman/lessons/9'  },
  { id:'screening',  x:620, y:415, icon:'shield',   type:'lesson',     status:'completed',   title:'Athlete Screening and Safety',       description:'PAR-Q, injury history, movement screening, and safe load progression protocols.',                                 duration:'2h 40m', lessonCount:9,  lessonLink:'/learn/level-1-coaching-strongman/lessons/20' },
  { id:'session',    x:620, y:505, icon:'whistle',  type:'lesson',     status:'in-progress', progress:65, title:'Session Structure',      description:'Building effective Strongman training sessions. Warm-up protocols, exercise sequencing, and coaching flow.',         duration:'3h 50m', lessonCount:14, lessonLink:'/learn/level-1-coaching-strongman/lessons/30' },
  /* Event row ─ y=585 */
  { id:'log-press',    x:210, y:585, icon:'dumbbell', type:'skill', status:'completed', title:'Log Press',    subtitle:'Fundamentals', description:'Log clean mechanics, overhead lockout, and loading progressions.',          duration:'1h 20m', lessonCount:5, lessonLink:'/learn/level-1-coaching-strongman/lessons/44' },
  { id:'axle-press',   x:360, y:585, icon:'dumbbell', type:'skill', status:'completed', title:'Axle Press',   subtitle:'Fundamentals', description:'Axle bar grip mechanics, continental clean technique, and push press cues.',  duration:'55m',   lessonCount:4, lessonLink:'/learn/level-1-coaching-strongman/lessons/49' },
  { id:'deadlift',     x:510, y:585, icon:'dumbbell', type:'skill', status:'completed', title:'Deadlift',     subtitle:'Fundamentals', description:'Silver dollar, car deadlift, and frame variations. Technique and rules.',     duration:'1h 10m', lessonCount:4, lessonLink:'/learn/level-1-coaching-strongman/lessons/53' },
  { id:'farmers-walk', x:660, y:585, icon:'milk',     type:'skill', status:'completed', title:"Farmer's Walk",subtitle:'Fundamentals', description:'Grip loading, turn mechanics, and pacing strategies for performance.',       duration:'50m',   lessonCount:3, lessonLink:'/learn/level-1-coaching-strongman/lessons/57' },
  { id:'yoke',         x:810, y:585, icon:'frame',    type:'skill', status:'completed', title:'Yoke',         subtitle:'Fundamentals', description:'Load placement, leg drive mechanics, and visual cuing strategies.',           duration:'55m',   lessonCount:3, lessonLink:'/learn/level-1-coaching-strongman/lessons/60' },
  { id:'atlas-stones', x:960, y:585, icon:'stone',    type:'skill', status:'completed', title:'Atlas Stones', subtitle:'Fundamentals', description:'Tacky application, lap mechanics, and safe loading progressions.',            duration:'1h 15m', lessonCount:5, lessonLink:'/learn/level-1-coaching-strongman/lessons/63' },
  /* Locked ─ y=675…755 */
  { id:'practical',  x:620, y:675, icon:'users', type:'assessment', status:'locked', title:'Practical Coaching Skills', description:'Practical session delivery, communication under pressure, and real-time athlete feedback.', duration:'4h 30m', lessonCount:16 },
  { id:'assessment', x:620, y:755, icon:'medal', type:'assessment', status:'locked', title:'Assessment Preparation',    description:'Preparing for the Level 1 certificate assessment. Theory test and practical walkthrough.',  duration:'2h 00m', lessonCount:7  },
];

const EVENT_IDS = ['log-press','axle-press','deadlift','farmers-walk','yoke','atlas-stones'];
const byId = (id: string) => NODES.find(n => n.id === id)!;

/* ════════════════════════════════════════════════ INLINE ICON PATHS ═ */

interface IconDef { d: string; stroke?: boolean }

const ICON_MAP: Record<string, IconDef> = {
  landmark : { d:'M3 21V9.5L12 4L21 9.5V21H3ZM7 21V14H11V21H7ZM13 21V14H17V21H13Z', stroke:false },
  present  : { d:'M2 4H22V17H2V4ZM12 4V17M2 4L12 1L22 4M7 10H17M7 13H13', stroke:true },
  shield   : { d:'M12 2L4 6V12C4 16.5 7.4 20.7 12 22C16.6 20.7 20 16.5 20 12V6L12 2ZM9 12L11 14L16 9', stroke:true },
  whistle  : { d:'M10 15A5 5 0 1 0 10 5A5 5 0 0 0 10 15ZM10 10H21M10 7V10M16.5 7.5L18 6', stroke:true },
  dumbbell : { d:'M6.5 5V19M17.5 5V19M3.5 8.5H6.5M17.5 8.5H20.5M3.5 15.5H6.5M17.5 15.5H20.5M6.5 10.5H17.5M6.5 13.5H17.5', stroke:true },
  milk     : { d:'M8 8V20H16V8M6 4H18L16 8H8L6 4ZM10 12H14M10 16H14', stroke:true },
  frame    : { d:'M3 5H7V19H3ZM17 5H21V19H17ZM7 9H17M7 15H17M7 12H17', stroke:true },
  stone    : { d:'M12 4C8.13 4 5 7.13 5 11C5 13.6 6.4 15.9 8.5 17.1L9 20H15L15.5 17.1C17.6 15.9 19 13.6 19 11C19 7.13 15.87 4 12 4Z', stroke:false },
  users    : { d:'M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21M9 11C11.2 11 13 9.2 13 7S11.2 3 9 3 5 4.8 5 7 6.8 11 9 11ZM23 21V19C23 17.1 21.7 15.5 20 15.1M16 3.1C17.7 3.6 19 5.2 19 7S17.7 10.4 16 10.9', stroke:true },
  medal    : { d:'M12 15C15.3 15 18 12.3 18 9S15.3 3 12 3 6 5.7 6 9 8.7 15 12 15ZM12 15L9.5 22L12 20.5L14.5 22L12 15', stroke:true },
  runner   : { d:'M13 5.5A1.5 1.5 0 1 0 13 2.5A1.5 1.5 0 0 0 13 5.5ZM8 22L10.5 16L13.5 18.5V22H16V17L12.5 14L13.5 9L17 12H20V9H16L13 6C12 5.5 10.5 5.5 10 6.5L7 11L5 12V15L7.5 14L9.5 11L8.5 16L6 22H8Z', stroke:false },
  clipboard: { d:'M9 3C9 3 9 5 12 5C15 5 15 3 15 3H18C19.1 3 20 3.9 20 5V21C20 22.1 19.1 23 18 23H6C4.9 23 4 22.1 4 21V5C4 3.9 4.9 3 6 3H9ZM9 13L11 15L15 11', stroke:true },
  barchart : { d:'M6 20V14M12 20V4M18 20V10', stroke:true },
  lock     : { d:'M7 11V7C7 4.24 9.24 2 12 2S17 4.24 17 7V11M5 11H19C19.6 11 20 11.4 20 12V21C20 21.6 19.6 22 19 22H5C4.4 22 4 21.6 4 21V12C4 11.4 4.4 11 5 11Z', stroke:true },
};

function NodeIcon({ icon, cx, cy, color, size = 17 }: { icon: string; cx: number; cy: number; color: string; size?: number }) {
  const def = ICON_MAP[icon] || ICON_MAP.stone;
  const scale = size / 24;
  const ox = cx - size / 2;
  const oy = cy - size / 2;
  return (
    <path
      d={def.d}
      fill={def.stroke ? 'none' : color}
      stroke={def.stroke ? color : 'none'}
      strokeWidth={def.stroke ? (1.6 / scale) : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={`translate(${ox.toFixed(1)},${oy.toFixed(1)}) scale(${scale.toFixed(4)})`}
    />
  );
}

/* ════════════════════════════════════════════════ GYM BACKGROUND ═════ */

function GymBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', userSelect: 'none',
      }}
    >
      {/* Base dark wash */}
      <div style={{ position:'absolute', inset:0, background:'#08080A' }} />

      {/* Magenta atmospheric glow — upper centre */}
      <div style={{
        position:'absolute', inset:0,
        background:[
          'radial-gradient(ellipse 65% 42% at 46% 18%, rgba(240,44,147,0.13) 0%, transparent 60%)',
          'radial-gradient(ellipse 44% 55% at 6%  62%, rgba(180,20,80,0.08)  0%, transparent 55%)',
          'radial-gradient(ellipse 38% 40% at 94% 70%, rgba(160,15,70,0.07)  0%, transparent 55%)',
        ].join(','),
      }} />

      {/* Chalk grain texture */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.045 }}>
        <filter id='bg-grain'>
          <feTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/>
          <feColorMatrix type='saturate' values='0'/>
        </filter>
        <rect width='100%' height='100%' filter='url(#bg-grain)'/>
      </svg>

      {/* LEFT power rack — prominent uprights */}
      <svg
        style={{ position:'absolute', left:0, top:0, bottom:0, opacity:0.13 }}
        width="130" height="100%" viewBox="0 0 130 700" preserveAspectRatio="xMinYMin meet"
      >
        {/* Left upright */}
        <rect x="10" y="0" width="14" height="680" rx="3" fill="white"/>
        {/* Right upright */}
        <rect x="96" y="0" width="14" height="680" rx="3" fill="white"/>
        {/* Top crossbar */}
        <rect x="10" y="0" width="100" height="14" rx="3" fill="white"/>
        {/* Safety bars */}
        <rect x="10" y="160" width="100" height="10" rx="2" fill="white" opacity="0.8"/>
        <rect x="10" y="290" width="100" height="10" rx="2" fill="white" opacity="0.7"/>
        <rect x="10" y="400" width="100" height="10" rx="2" fill="white" opacity="0.55"/>
        <rect x="10" y="510" width="100" height="10" rx="2" fill="white" opacity="0.4"/>
        {/* Bolt holes on uprights */}
        {[80,105,130,175,220,305,340,415,450,520].map(y2 => (
          <g key={y2}>
            <circle cx="17" cy={y2} r="4" fill="#08080A" opacity="0.9"/>
            <circle cx="103" cy={y2} r="4" fill="#08080A" opacity="0.9"/>
          </g>
        ))}
        {/* J-hooks */}
        <rect x="24" y="152" width="28" height="18" rx="3" fill="white" opacity="0.9"/>
        <rect x="68" y="152" width="28" height="18" rx="3" fill="white" opacity="0.9"/>
        {/* Foot base */}
        <rect x="0" y="664" width="44" height="16" rx="3" fill="white"/>
        <rect x="86" y="664" width="44" height="16" rx="3" fill="white"/>
        {/* EDUCATE.STRONG text on bar */}
        <text x="55" y="172" textAnchor="middle" fill="black" fontSize="6.5"
          fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="1.5" opacity="0.9">
          EDUCATE.STRONG
        </text>
      </svg>

      {/* Weight plates — bottom left */}
      <svg style={{ position:'absolute', bottom:0, left:'110px', opacity:0.07 }}
        width="160" height="90" viewBox="0 0 160 90">
        <ellipse cx="35" cy="60" rx="22" ry="14" fill="white"/>
        <ellipse cx="35" cy="60" rx="13"  ry="8"  fill="#08080A"/>
        <rect x="33" y="26" width="4" height="34" fill="white"/>
        <ellipse cx="85" cy="65" rx="18" ry="11" fill="white"/>
        <ellipse cx="85" cy="65" rx="10"  ry="6"  fill="#08080A"/>
        <rect x="83" y="35" width="4" height="30" fill="white"/>
        <ellipse cx="130" cy="68" rx="20" ry="12" fill="white"/>
        <ellipse cx="130" cy="68" rx="12"  ry="7"  fill="#08080A"/>
      </svg>

      {/* Atlas stone — bottom right large */}
      <div style={{
        position:'absolute', bottom:'28px', right:'72px',
        width:'96px', height:'96px', borderRadius:'50%',
        background:'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 65%, transparent)',
        opacity:0.10,
      }}/>
      {/* Atlas stone — bottom right small */}
      <div style={{
        position:'absolute', bottom:'18px', right:'162px',
        width:'66px', height:'66px', borderRadius:'50%',
        background:'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.18), rgba(255,255,255,0.03) 65%, transparent)',
        opacity:0.08,
      }}/>

      {/* RIGHT sandbag / barrel */}
      <svg style={{ position:'absolute', right:'14px', top:'180px', opacity:0.09 }}
        width="52" height="320" viewBox="0 0 52 320">
        <rect x="10" y="0" width="32" height="300" rx="16" fill="white"/>
        <ellipse cx="26" cy="10" rx="16" ry="8" fill="white"/>
        {/* straps */}
        <rect x="8" y="80" width="36" height="6" rx="3" fill="#08080A" opacity="0.6"/>
        <rect x="8" y="150" width="36" height="6" rx="3" fill="#08080A" opacity="0.6"/>
        <rect x="8" y="220" width="36" height="6" rx="3" fill="#08080A" opacity="0.6"/>
        {/* text on barrel */}
        <text x="26" y="130" textAnchor="middle" fill="#08080A" fontSize="5.5"
          fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="1.2"
          transform="rotate(90,26,130)" opacity="0.8">
          EDUCATE.STRONG
        </text>
      </svg>

      {/* Magenta glow wash behind event row area (roughly 55-70% down) */}
      <div style={{
        position:'absolute', left:0, right:0, top:'56%', height:'22%',
        background:'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(240,44,147,0.09) 0%, transparent 70%)',
      }}/>

      {/* Edge vignette */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 22%, rgba(8,8,10,0.92) 100%)',
      }}/>
      {/* Top fade */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'120px',
        background:'linear-gradient(#08080A, transparent)' }}/>
      {/* Bottom fade */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'80px',
        background:'linear-gradient(transparent, #08080A)' }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════ CUSTOM LMS NAV ═════ */

function LmsNav({ userName, userRole }: { userName: string; userRole: string }) {
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:80,
      background:'rgba(5,5,6,0.94)',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      backdropFilter:'blur(16px)',
      display:'flex', alignItems:'center',
      padding:'0 28px',
      gap:32,
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{
        display:'flex', alignItems:'center', gap:10,
        textDecoration:'none', flexShrink:0,
      }}>
        <div style={{
          width:38, height:38,
          background:'linear-gradient(135deg,#B91563,#E02B83)',
          borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 0 1px rgba(240,44,147,0.4)',
        }}>
          <svg viewBox="0 0 24 24" width="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L4 7V13C4 17.4 7.5 21.5 12 23C16.5 21.5 20 17.4 20 13V7L12 2Z"/>
          </svg>
        </div>
        <div>
          <div style={{ color:'#F5F5F7', fontWeight:800, fontSize:'0.9rem', letterSpacing:'0.03em', lineHeight:1.1 }}>
            EDUCATE<span style={{ color:'#F02C93' }}>.</span>STRONG
          </div>
          <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.6rem', letterSpacing:'0.15em', fontWeight:600 }}>
            ACADEMY
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, justifyContent:'center' }}>
        {[
          { label:'Dashboard',         to:'/dashboard'         },
          { label:'Courses',           to:'/courses'           },
          { label:'Coaching Pathways', to:'/dashboard/pathway', active:true },
          { label:'Knowledge Hub',     to:'/knowledge'         },
          { label:'Assessments',       to:'/assessments'       },
        ].map(({ label, to, active }) => (
          <Link key={label} to={to} style={{
            position:'relative',
            color: active ? '#F02C93' : 'rgba(255,255,255,0.58)',
            textDecoration:'none',
            fontSize:'0.875rem',
            fontWeight: active ? 600 : 500,
            padding:'8px 14px',
            letterSpacing:'0.01em',
            transition:'color 0.15s',
          }}>
            {label}
            {active && (
              <span style={{
                position:'absolute', bottom:-1, left:14, right:14,
                height:2, background:'#F02C93',
                borderRadius:2,
              }}/>
            )}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
        {/* Search */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:8, padding:'7px 12px',
          width:176,
        }}>
          <svg viewBox="0 0 24 24" width="14" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color:'rgba(255,255,255,0.30)', fontSize:'0.78rem' }}>Search Academy</span>
        </div>

        {/* Bell */}
        <button style={{
          width:36, height:36, borderRadius:'50%',
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer',
        }}>
          <svg viewBox="0 0 24 24" width="16" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Avatar + name */}
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{
            width:36, height:36, borderRadius:'50%',
            background:'linear-gradient(135deg,#3a1a2a,#5a1a3a)',
            border:'2px solid rgba(240,44,147,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#F5F5F7', fontSize:'0.72rem', fontWeight:700,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ color:'#F5F5F7', fontSize:'0.82rem', fontWeight:600, lineHeight:1.2 }}>{userName}</div>
            <div style={{ color:'#F02C93', fontSize:'0.68rem', fontWeight:500 }}>{userRole}</div>
          </div>
          <svg viewBox="0 0 12 8" width="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
            <path d="M1 1l5 5 5-5"/>
          </svg>
        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════════ SVG SKILL TREE ═════ */

function SkillTreeSVG({
  onNodeClick,
  selectedId,
  eventsExpanded,
  onToggleEvents,
}: {
  onNodeClick     : (n: SkillNode) => void;
  selectedId      : string | null;
  eventsExpanded  : boolean;
  onToggleEvents  : () => void;
}) {
  // Hex geometry helpers
  const HEX_PTS  = '42,2 78,20 78,44 42,62 6,44 6,20';
  const HEX_CX   = 42;
  const HEX_CY   = 32;
  const HEX_W    = 84;
  // const HEX_H = 64;

  // Vertical positions derived
  const foundationBottom = 255 + HEX_CY; // 287
  const introTop         = 335 - HEX_CY; // 303
  const introBottom      = 335 + HEX_CY; // 367
  const screenTop        = 415 - HEX_CY; // 383
  const screenBottom     = 415 + HEX_CY; // 447
  const sessionTop       = 505 - HEX_CY; // 473
  const sessionBottom    = 505 + HEX_CY; // 537
  const eventTop         = 585 - HEX_CY; // 553
  const eventBottom      = 585 + HEX_CY; // 617
  const practicalTop     = 675 - HEX_CY; // 643
  const practicalBottom  = 675 + HEX_CY; // 707
  const assessmentTop    = 755 - HEX_CY; // 723
  const HBAR_Y           = 545;          // horizontal event bar Y

  function hexFill(n: SkillNode) {
    if (n.status === 'completed')   return `url(#grad-${n.id})`;
    if (n.status === 'in-progress') return `url(#grad-${n.id})`;
    return '#111114';
  }
  function hexStroke(n: SkillNode) {
    if (n.status === 'completed')   return '#F02C93';
    if (n.status === 'in-progress') return '#F2A93B';
    if (n.status === 'available')   return 'rgba(255,255,255,0.74)';
    if (n.status === 'cpd-locked')  return 'rgba(240,44,147,0.36)';
    return 'rgba(255,255,255,0.24)';
  }
  function hexDash(n: SkillNode) {
    return n.status === 'cpd-locked' ? '6 5' : undefined;
  }
  function hexOpacity(n: SkillNode) {
    if (n.status === 'locked')      return 0.48;
    if (n.status === 'cpd-locked')  return 0.62;
    return 1;
  }
  function iconColor(n: SkillNode) {
    if (n.status === 'completed')   return '#F5F5F7';
    if (n.status === 'in-progress') return '#F2A93B';
    return '#85858B';
  }
  function glowFilter(n: SkillNode) {
    if (n.status === 'completed')   return 'url(#glow-magenta)';
    if (n.status === 'in-progress') return 'url(#glow-amber)';
    return undefined;
  }

  function renderHexNode(n: SkillNode) {
    const tx = n.x - HEX_CX;
    const ty = n.y - HEX_CY;
    const isInteractive = n.status !== 'locked' && n.status !== 'cpd-locked';
    const isSession     = n.id === 'session';

    return (
      <g
        key={n.id}
        transform={`translate(${tx},${ty})`}
        onClick={() => {
          if (isSession) onToggleEvents();
          if (isInteractive) onNodeClick(n);
        }}
        style={{ cursor: isInteractive ? 'pointer' : 'default' }}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={n.title}
        onKeyDown={e => e.key === 'Enter' && isInteractive && onNodeClick(n)}
      >
        {/* Selection ring */}
        {selectedId === n.id && (
          <ellipse cx={HEX_CX} cy={HEX_CY} rx={52} ry={42}
            fill="none"
            stroke={n.status === 'in-progress' ? 'rgba(242,169,59,0.4)' : 'rgba(240,44,147,0.4)'}
            strokeWidth="1.5"/>
        )}

        {/* Pulse ring for in-progress */}
        {n.status === 'in-progress' && (
          <ellipse cx={HEX_CX} cy={HEX_CY} rx={54} ry={43}
            fill="rgba(242,169,59,0.08)"
            className="sk-pulse"/>
        )}

        {/* Hex polygon with glow */}
        <g filter={glowFilter(n)} opacity={hexOpacity(n)}>
          <polygon
            points={HEX_PTS}
            fill={hexFill(n)}
            stroke={hexStroke(n)}
            strokeWidth="2"
            strokeDasharray={hexDash(n)}
          />
        </g>

        {/* Icon */}
        <NodeIcon icon={n.icon} cx={HEX_CX} cy={HEX_CY - 2} color={iconColor(n)} size={n.status === 'locked' || n.status === 'cpd-locked' ? 15 : 17}/>

        {/* Completed check badge */}
        {n.status === 'completed' && (
          <g transform="translate(65,51)">
            <circle cx="0" cy="0" r="11" fill="#2B0B1E" stroke="#F02C93" strokeWidth="1.5"/>
            <path d="M-4.5,0.5 L-1.5,3.5 L4.5,-3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        )}

        {/* 65% badge for in-progress — sits to the right of the hex */}
        {n.status === 'in-progress' && n.progress !== undefined && (
          <g transform={`translate(${HEX_W + 26},${HEX_CY})`}>
            <circle cx="0" cy="0" r="26" fill="#0E0E12" stroke="#F2A93B" strokeWidth="2"/>
            <text x="0" y="5" textAnchor="middle" fill="#F2A93B"
              fontSize="12" fontWeight="700" fontFamily="system-ui,sans-serif">
              {n.progress}%
            </text>
          </g>
        )}

        {/* Lock icon for locked / cpd-locked */}
        {(n.status === 'locked' || n.status === 'cpd-locked') && (
          <g transform={`translate(${HEX_CX - 6},${HEX_CY + 10})`} opacity="0.55">
            <rect x="0" y="5" width="12" height="9" rx="1.5" fill="white"/>
            <path d="M2.5 5V3.5A3 3 0 0 1 9.5 3.5V5" fill="none" stroke="white" strokeWidth="1.4"/>
          </g>
        )}
      </g>
    );
  }

  /* ── Node labels ──────────────────────────────────────────────────── */
  function renderLabels() {
    return (
      <g style={{ pointerEvents:'none' }}>
        {/* CPD node labels (below node) */}
        {['cpd-mobility','cpd-programming','cpd-analysis'].map(id => {
          const n = byId(id);
          return (
            <text key={id} x={n.x} y={n.y + HEX_CY + 18}
              textAnchor="middle" fill="#8A8A92" fontSize="10"
              fontFamily="system-ui,sans-serif" fontWeight="500">
              {n.title}
            </text>
          );
        })}

        {/* Spine node labels — to the right, title only */}
        {['foundation','intro','screening'].map(id => {
          const n = byId(id);
          return (
            <text key={id} x={n.x + HEX_CX + 22} y={n.y + 5}
              fill="#F4F4F6" fontSize="14" fontWeight="600"
              fontFamily="system-ui,sans-serif" dominantBaseline="middle">
              {n.title}
            </text>
          );
        })}

        {/* Session Structure label (amber) */}
        {(() => {
          const n = byId('session');
          return (
            <g>
              {/* label starts after the 65% badge */}
              <text x={n.x + HEX_CX + 22 + 56} y={n.y - 3}
                fill="#F2A93B" fontSize="13.5" fontWeight="700"
                fontFamily="system-ui,sans-serif">
                Session Structure
              </text>
              <text x={n.x + HEX_CX + 22 + 56} y={n.y + 14}
                fill="#F2A93B" fontSize="10.5" fontWeight="500"
                fontFamily="system-ui,sans-serif">
                In Progress
              </text>
            </g>
          );
        })()}

        {/* Event row labels (below each hex, two lines) */}
        {EVENT_IDS.map(id => {
          const n = byId(id);
          return (
            <g key={id}>
              <text x={n.x} y={n.y + HEX_CY + 17}
                textAnchor="middle" fill="#F4F4F6" fontSize="11.5" fontWeight="600"
                fontFamily="system-ui,sans-serif">
                {n.title}
              </text>
              <text x={n.x} y={n.y + HEX_CY + 31}
                textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontWeight="400"
                fontFamily="system-ui,sans-serif">
                {n.subtitle}
              </text>
            </g>
          );
        })}

        {/* Locked node labels — to the right */}
        {['practical','assessment'].map(id => {
          const n = byId(id);
          return (
            <g key={id}>
              <text x={n.x + HEX_CX + 22} y={n.y - 3}
                fill="#B8B8BE" fontSize="13.5" fontWeight="600"
                fontFamily="system-ui,sans-serif" opacity="0.65">
                {n.title}
              </text>
              <text x={n.x + HEX_CX + 22} y={n.y + 14}
                fill="#7A7A82" fontSize="10" fontWeight="500"
                fontFamily="system-ui,sans-serif" opacity="0.65">
                Locked
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 1100 820"
      width="100%"
      style={{ display:'block', overflow:'visible' }}
      aria-label="Coaching Pathway Level 1 skill tree"
    >
      {/* ── DEFS ────────────────────────────────────────────────── */}
      <defs>
        {/* Radial gradients for each completed node */}
        {NODES.filter(n => n.status === 'completed').map(n => (
          <radialGradient key={n.id} id={`grad-${n.id}`} cx="35%" cy="28%" r="75%">
            <stop offset="0%"   stopColor="#5B1239"/>
            <stop offset="100%" stopColor="#161016"/>
          </radialGradient>
        ))}
        {/* In-progress gradient */}
        {NODES.filter(n => n.status === 'in-progress').map(n => (
          <radialGradient key={n.id} id={`grad-${n.id}`} cx="35%" cy="28%" r="75%">
            <stop offset="0%"   stopColor="#5A3514"/>
            <stop offset="100%" stopColor="#17120B"/>
          </radialGradient>
        ))}
        {/* Completed-to-inprogress spine connector gradient */}
        <linearGradient id="spine-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F02C93"/>
          <stop offset="100%" stopColor="#F2A93B"/>
        </linearGradient>
        {/* Magenta glow filter */}
        <filter id="glow-magenta" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/>
          <feFlood floodColor="#F02C93" floodOpacity="0.75" result="clr"/>
          <feComposite in="clr" in2="blur" operator="in" result="shadow"/>
          <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Amber glow filter */}
        <filter id="glow-amber" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/>
          <feFlood floodColor="#F2A93B" floodOpacity="0.72" result="clr"/>
          <feComposite in="clr" in2="blur" operator="in" result="shadow"/>
          <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Horizontal bar glow */}
        <filter id="glow-bar" x="-5%" y="-500%" width="110%" height="1100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur1"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── CPD LOCKED BAND ─────────────────────────────────────── */}
      <rect x="330" y="60" width="620" height="152" rx="10"
        fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      {/* Lock icon */}
      <g transform="translate(392,87)">
        <rect x="0" y="5" width="13" height="10" rx="1.5" fill="#D7D7DD" opacity="0.65"/>
        <path d="M3 5V3A3.5 3.5 0 0 1 10 3V5" fill="none" stroke="#D7D7DD" strokeWidth="1.4" opacity="0.65"/>
      </g>
      <text x="640" y="93" textAnchor="middle" fill="#D7D7DD" fontSize="11" fontWeight="700"
        letterSpacing="1.8" fontFamily="system-ui,sans-serif">
        CONTINUING PROFESSIONAL DEVELOPMENT (CPD)
      </text>
      <text x="640" y="111" textAnchor="middle" fill="#A0A0A8" fontSize="10"
        fontFamily="system-ui,sans-serif">
        Locked until Level 1 completion
      </text>
      {/* CPD dashed connectors */}
      <line x1={430+42} y1="145" x2={620-42} y2="145"
        stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1={620+42} y1="145" x2={810-42} y2="145"
        stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 4"/>

      {/* ── CPD BAND → FOUNDATION connector ─────────────────────── */}
      <line x1="620" y1="212" x2="620" y2="223"
        stroke="rgba(240,44,147,0.22)" strokeWidth="1.5" strokeDasharray="4 3"/>

      {/* ── VERTICAL SPINE CONNECTORS ────────────────────────────── */}
      {/* Foundation → Intro (completed→completed) */}
      <line x1="620" y1={foundationBottom} x2="620" y2={introTop}
        stroke="#F02C93" strokeWidth="3" filter="url(#glow-magenta)" opacity="0.75"/>
      {/* Intro → Screening (completed→completed) */}
      <line x1="620" y1={introBottom} x2="620" y2={screenTop}
        stroke="#F02C93" strokeWidth="3" filter="url(#glow-magenta)" opacity="0.75"/>
      {/* Screening → Session (completed→in-progress, gradient) */}
      <line x1="620" y1={screenBottom} x2="620" y2={sessionTop}
        stroke="url(#spine-grad)" strokeWidth="3"/>

      {/* ── SESSION → EVENT ROW ──────────────────────────────────── */}
      {eventsExpanded && (
        <>
          {/* Short drop from session bottom */}
          <line x1="620" y1={sessionBottom} x2="620" y2={HBAR_Y}
            stroke="#F02C93" strokeWidth="3"/>
          {/* Main horizontal magenta glow bar */}
          <line x1="210" y1={HBAR_Y} x2="960" y2={HBAR_Y}
            stroke="#F02C93" strokeWidth="5" filter="url(#glow-bar)" opacity="0.95"/>
          {/* Per-node drops to event hexes */}
          {EVENT_IDS.map(id => {
            const n = byId(id);
            return (
              <line key={id} x1={n.x} y1={HBAR_Y} x2={n.x} y2={eventTop}
                stroke="#F02C93" strokeWidth="2.5"/>
            );
          })}
        </>
      )}

      {/* ── EVENT ROW → PRACTICAL (dashed) ──────────────────────── */}
      <line x1="620" y1={eventsExpanded ? eventBottom : sessionBottom + 8}
            x2="620" y2={practicalTop}
        stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 4"/>
      {/* Practical → Assessment (dashed) */}
      <line x1="620" y1={practicalBottom} x2="620" y2={assessmentTop}
        stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 4"/>

      {/* ── NODE RENDERING ORDER (bottom first for z-stacking) ───── */}
      {/* Locked nodes first */}
      {NODES.filter(n => n.status === 'locked').map(renderHexNode)}
      {/* CPD nodes */}
      {NODES.filter(n => n.status === 'cpd-locked').map(renderHexNode)}
      {/* Completed nodes */}
      {eventsExpanded
        ? NODES.filter(n => n.status === 'completed').map(renderHexNode)
        : NODES.filter(n => n.status === 'completed' && !EVENT_IDS.includes(n.id)).map(renderHexNode)
      }
      {/* In-progress (on top) */}
      {NODES.filter(n => n.status === 'in-progress').map(renderHexNode)}

      {/* ── LABELS ──────────────────────────────────────────────── */}
      {renderLabels()}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════ SIDEBAR ═════ */

function LearnerSidebar({ learner }: { learner: typeof LEARNER }) {
  const initials = learner.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return (
    <aside style={{
      width:'100%',
      background:'linear-gradient(180deg,rgba(20,20,24,0.97),rgba(11,11,14,0.98))',
      border:'1px solid rgba(255,255,255,0.10)',
      borderRadius:14,
      padding:'28px 24px',
      boxShadow:'0 20px 60px rgba(0,0,0,0.50)',
      display:'flex', flexDirection:'column', gap:0,
      height:'100%', overflowY:'auto',
    }}>

      {/* ─ Avatar + Name ─ */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.10)' }}>
        <div style={{
          width:72, height:72, borderRadius:'50%', flexShrink:0,
          background:'linear-gradient(135deg,#3a1525,#5a1a35)',
          border:'2.5px solid rgba(240,44,147,0.35)',
          boxShadow:'0 0 0 4px rgba(240,44,147,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#F5F5F7', fontWeight:800, fontSize:'1.2rem',
        }}>
          {initials}
        </div>
        <div>
          <div style={{ color:'#F5F5F7', fontWeight:700, fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
            {learner.name}
          </div>
          <span style={{
            display:'inline-block', marginTop:4,
            color:'#F02C93', fontSize:'0.78rem', fontWeight:600,
          }}>
            {learner.role}
          </span>
        </div>
      </div>

      {/* ─ Pathway ─ */}
      <div style={{ marginBottom:18 }}>
        <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>
          Pathway
        </div>
        <div style={{ color:'#F5F5F7', fontSize:'0.92rem', fontWeight:600 }}>
          {learner.pathway}
        </div>
      </div>

      {/* ─ Overall Progress ─ */}
      <div style={{ marginBottom:18, paddingBottom:18, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
          Overall Progress
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ color:'#C2186A', fontWeight:900, fontSize:'2.4rem', letterSpacing:'-0.05em', lineHeight:1 }}>
            {learner.progress}%
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.82rem', fontWeight:600 }}>
              {learner.lessonsCompleted} of {learner.totalLessons} lessons
            </div>
            <div style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.72rem' }}>completed</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, borderRadius:6, background:'rgba(255,255,255,0.13)', overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:6,
            width:`${learner.progress}%`,
            background:'#C2186A',
            transition:'width 0.6s ease',
          }}/>
        </div>
        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
          {[
            { icon:'📚', val: String(learner.lessonsCompleted), label:'Lessons Completed' },
            { icon:'⏱', val: learner.totalTime,                 label:'Total Learning Time' },
          ].map(({ icon, val, label }) => (
            <div key={label} style={{
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:10, padding:'10px 12px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <span style={{ fontSize:'0.85rem' }}>{icon}</span>
              </div>
              <div style={{ color:'#F5F5F7', fontWeight:800, fontSize:'1rem', letterSpacing:'-0.02em' }}>{val}</div>
              <div style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.7rem', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ Current Module ─ */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:'#F2A93B', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
          Current Module
        </div>
        <div style={{
          background:'rgba(242,169,59,0.07)', border:'1px solid rgba(242,169,59,0.18)',
          borderRadius:10, padding:'12px 14px',
          display:'flex', alignItems:'center', gap:12,
        }}>
          {/* whistle icon in amber */}
          <div style={{
            width:42, height:42, borderRadius:10, flexShrink:0,
            background:'rgba(242,169,59,0.12)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#F2A93B" strokeWidth="2" strokeLinecap="round">
              <circle cx="10" cy="10" r="5"/><path d="M10 5h11M10 8v2M15.5 7.5L17 6"/>
            </svg>
          </div>
          <div>
            <div style={{ color:'#F5F5F7', fontWeight:700, fontSize:'0.9rem' }}>{learner.currentModule}</div>
            <div style={{ color:'#F2A93B', fontSize:'0.8rem', marginTop:2 }}>
              In Progress ({learner.currentModuleProgress}%)
            </div>
          </div>
        </div>
      </div>

      {/* ─ Next Recommended Lesson ─ */}
      <div style={{ marginBottom:18, paddingBottom:18, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
          Next Recommended Lesson
        </div>
        <div style={{
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:10, padding:'12px 14px',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{
            width:32, height:32, borderRadius:'50%', flexShrink:0,
            background:'rgba(240,44,147,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg viewBox="0 0 12 14" width="12" fill="#F02C93"><path d="M2 1l9 6-9 6V1z"/></svg>
          </div>
          <div>
            <div style={{ color:'rgba(255,255,255,0.82)', fontWeight:600, fontSize:'0.88rem' }}>
              {learner.nextLesson}
            </div>
            <div style={{ color:'rgba(255,255,255,0.36)', fontSize:'0.75rem', marginTop:2 }}>
              Lesson {learner.nextLessonNumber} · {learner.nextLessonDuration}
            </div>
          </div>
        </div>
      </div>

      {/* ─ Certificate Status ─ */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
          Certificate Status
        </div>
        <div style={{
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:10, padding:'12px 14px',
          display:'flex', alignItems:'flex-start', gap:12,
        }}>
          <div style={{
            width:38, height:38, borderRadius:'50%', flexShrink:0,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg viewBox="0 0 24 24" width="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8">
              <circle cx="12" cy="8" r="5"/><path d="M8 13.5L6 21L12 19L18 21L16 13.5"/>
            </svg>
          </div>
          <div>
            <div style={{ color:'rgba(255,255,255,0.52)', fontWeight:600, fontSize:'0.88rem' }}>
              Not Yet Earned
            </div>
            <div style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.75rem', marginTop:3, lineHeight:1.45 }}>
              Complete all lessons and pass the assessment to earn your certificate.
            </div>
          </div>
        </div>
      </div>

      {/* ─ CPD Locked box ─ */}
      <div style={{ marginBottom:22 }}>
        <div style={{
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)',
          borderRadius:10, padding:'12px 14px',
          display:'flex', alignItems:'flex-start', gap:10,
        }}>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" style={{ marginTop:1, flexShrink:0 }}>
            <rect x="5" y="11" width="14" height="11" rx="2"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          </svg>
          <div style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.78rem', lineHeight:1.5 }}>
            Continuing Professional Development (CPD) is locked until you complete Coaching Pathway Level 1.
          </div>
        </div>
      </div>

      {/* ─ CTA ─ */}
      <Link to={LEARNER.nextLessonLink} style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        height:52, borderRadius:8,
        background:'linear-gradient(90deg,#B91563,#E02B83)',
        boxShadow:'0 4px 24px rgba(240,44,147,0.38)',
        color:'white', fontWeight:800, fontSize:'0.88rem',
        letterSpacing:'0.08em', textTransform:'uppercase',
        textDecoration:'none',
        transition:'transform 0.15s, box-shadow 0.15s',
        marginBottom:12,
      }}>
        CONTINUE LEARNING
        <svg viewBox="0 0 20 20" width="18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 10h12M10 4l6 6-6 6"/>
        </svg>
      </Link>

      <Link to="/dashboard" style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'rgba(255,255,255,0.28)', fontSize:'0.78rem', gap:4,
        textDecoration:'none',
      }}>
        ← Back to Dashboard
      </Link>
    </aside>
  );
}

/* ═══════════════════════════════════════════════ BOTTOM DETAIL PANEL ═ */

function NodeDetailPanel({ node, onClose }: { node: SkillNode; onClose: () => void }) {
  const statusMeta = {
    completed    : { label:'Complete',    bg:'rgba(240,44,147,0.15)',  color:'#F02C93'  },
    'in-progress': { label:'In Progress', bg:'rgba(242,169,59,0.15)',  color:'#F2A93B'  },
    available    : { label:'Available',   bg:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)' },
    locked       : { label:'Locked',      bg:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.3)' },
    'cpd-locked' : { label:'CPD — Locked',bg:'rgba(240,44,147,0.08)', color:'rgba(240,44,147,0.6)'  },
  } as const;
  const s = statusMeta[node.status];

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:200,
      background:'rgba(12,12,16,0.96)',
      borderTop:'1px solid rgba(255,255,255,0.12)',
      backdropFilter:'blur(20px)',
      boxShadow:'0 -16px 60px rgba(0,0,0,0.75)',
      padding:'20px 32px 24px',
      animation:'sk-slide-up 0.22s ease-out',
    }}>
      <div style={{ maxWidth:760, display:'flex', alignItems:'flex-start', gap:20 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontWeight:700, fontSize:'1rem', color:'#F5F5F7', letterSpacing:'-0.015em' }}>
              {node.title}{node.subtitle ? ` — ${node.subtitle}` : ''}
            </span>
            <span style={{
              fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
              padding:'3px 10px', borderRadius:20,
              background:s.bg, color:s.color,
            }}>
              {s.label}
            </span>
            {node.duration && (
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>
                {node.duration} · {node.lessonCount} lessons
              </span>
            )}
          </div>
          <p style={{ color:'rgba(255,255,255,0.42)', fontSize:'0.88rem', lineHeight:1.55, maxWidth:520, margin:'0 0 16px' }}>
            {node.description}
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {node.status === 'completed' && node.lessonLink && (
              <Link to={node.lessonLink} style={{
                background:'linear-gradient(135deg,#B91563,#E02B83)', color:'white',
                padding:'9px 22px', borderRadius:8, fontWeight:600, fontSize:'0.85rem',
                textDecoration:'none',
              }}>Review Lessons</Link>
            )}
            {node.status === 'in-progress' && node.lessonLink && (
              <Link to={node.lessonLink} style={{
                background:'linear-gradient(135deg,#C8792A,#F2A93B)', color:'#1a0c00',
                padding:'9px 22px', borderRadius:8, fontWeight:600, fontSize:'0.85rem',
                textDecoration:'none',
              }}>Continue →</Link>
            )}
            {node.status === 'available' && node.lessonLink && (
              <Link to={node.lessonLink} style={{
                border:'1px solid rgba(255,255,255,0.22)', color:'white',
                padding:'9px 22px', borderRadius:8, fontWeight:600, fontSize:'0.85rem',
                textDecoration:'none', background:'transparent',
              }}>Start Module</Link>
            )}
            {(node.status === 'locked' || node.status === 'cpd-locked') && (
              <span style={{
                border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.22)',
                padding:'9px 22px', borderRadius:8, fontSize:'0.85rem',
                background:'rgba(255,255,255,0.03)',
              }}>🔒 Locked</span>
            )}
          </div>
        </div>
        <button onClick={onClose} style={{
          flexShrink:0, width:34, height:34, borderRadius:'50%',
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'rgba(255,255,255,0.45)', cursor:'pointer',
        }} aria-label="Close">
          <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════ PAGE ROOT ══ */

export default function SkillTree() {
  const { user } = useAuth();

  const displayName = user ? `${user.firstName} ${user.lastName}` : LEARNER.name;
  const displayRole = user ? (user.role.charAt(0) + user.role.slice(1).toLowerCase()) : LEARNER.role;

  const [selectedNode,   setSelectedNode]   = useState<SkillNode | null>(null);
  const [eventsExpanded, setEventsExpanded] = useState(true);

  return (
    <>
      {/* ── Global keyframes ─────────────────────────────────── */}
      <style>{`
        @keyframes sk-pulse {
          0%,100% { opacity:0.9; transform:scale(1);    }
          50%      { opacity:0.1; transform:scale(1.45); }
        }
        .sk-pulse {
          animation: sk-pulse 2.4s ease-in-out infinite;
          transform-origin: 42px 32px;
        }
        @keyframes sk-slide-up {
          from { transform:translateY(100%); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sk-pulse { animation:none !important; opacity:0.35 !important; }
          [style*="sk-slide-up"] { animation:none !important; }
        }
      `}</style>

      {/* Full viewport wrapper */}
      <div style={{ minHeight:'100vh', background:'#050506', display:'flex', flexDirection:'column' }}>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <LmsNav userName={displayName} userRole={displayRole}/>

        {/* ── Main content (below 80px nav) ────────────────────── */}
        <div style={{
          display:'flex', flex:1, paddingTop:80,
          minHeight:0, alignItems:'flex-start',
        }}>

          {/* ── LEFT CANVAS ─────────────────────────────────────── */}
          <div style={{
            flex:1, position:'relative',
            minHeight:'calc(100vh - 80px)',
            overflowY:'auto', overflowX:'hidden',
          }}>
            <GymBackground/>

            {/* Page title */}
            <div style={{ position:'relative', zIndex:10, padding:'28px 32px 0' }}>
              <h1 style={{
                margin:0,
                fontFamily: 'Impact, "Anton", "Oswald", system-ui, sans-serif',
                fontSize:'clamp(2.1rem, 3vw, 3.25rem)',
                fontWeight:900,
                textTransform:'uppercase',
                letterSpacing:'0.08em',
                color:'#F7F7F7',
                lineHeight:1.05,
              }}>
                Coaching Pathway Level 1
              </h1>
              <p style={{
                margin:'8px 0 0',
                color:'#C8C8CE', fontSize:'0.97rem', fontWeight:400, lineHeight:1.5,
              }}>
                Build the knowledge and practical skills to coach Strongman safely and effectively.
              </p>
            </div>

            {/* SVG tree canvas */}
            <div style={{ position:'relative', zIndex:10, padding:'4px 8px 60px' }}>
              <SkillTreeSVG
                onNodeClick={setSelectedNode}
                selectedId={selectedNode?.id ?? null}
                eventsExpanded={eventsExpanded}
                onToggleEvents={() => setEventsExpanded(p => !p)}
              />
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
          <div style={{
            width:390, flexShrink:0,
            padding:'24px 20px 24px 0',
            height:'calc(100vh - 80px)',
            position:'sticky', top:80,
            overflowY:'auto',
          }} className="hidden-on-mobile-sk">
            <LearnerSidebar learner={{ ...LEARNER, name: displayName, role: displayRole }}/>
          </div>
        </div>

        {/* ── Mobile sidebar (below tree) ──────────────────────── */}
        <div style={{
          borderTop:'1px solid rgba(255,255,255,0.07)',
          padding:'20px',
        }} className="mobile-only-sk">
          <LearnerSidebar learner={{ ...LEARNER, name: displayName, role: displayRole }}/>
        </div>

        {/* ── Bottom detail panel ───────────────────────────────── */}
        {selectedNode && (
          <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)}/>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .mobile-only-sk { display: none !important; }
        }
        @media (max-width: 1023px) {
          .hidden-on-mobile-sk { display: none !important; }
        }
      `}</style>
    </>
  );
}
