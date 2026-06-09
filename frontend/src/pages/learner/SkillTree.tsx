/**
 * SkillTree — LMS coaching pathway skill tree.
 * Route: /dashboard/pathway (protected)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

/* ── Types ───────────────────────────────────────────────────────────── */
type NodeStatus = 'completed' | 'in-progress' | 'available' | 'locked';

interface SkillNode {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  status: NodeStatus;
  lessonRef?: string;
  x: number;
  y: number;
  connections: string[];
  isCPD?: boolean;
}

/* ── Node data ──────────────────────────────────────────────────────── */
const NODES: SkillNode[] = [
  // Row 0 — Foundation
  {
    id: 'foundation',
    title: 'Level 1 Foundation',
    shortTitle: 'Foundation',
    description: 'Your entry point into the Strongman coaching pathway. Introduction to the programme, tutors, and expectations.',
    icon: '🏋️',
    status: 'completed',
    x: 2, y: 0,
    connections: ['intro', 'screening'],
  },

  // Row 1
  {
    id: 'intro',
    title: 'Introduction to Strongman Coaching',
    shortTitle: 'Intro',
    description: 'History, philosophy, and coaching principles of Strongman. What makes it different from other strength sports.',
    icon: '📋',
    status: 'completed',
    x: 1, y: 1,
    connections: ['session'],
  },
  {
    id: 'screening',
    title: 'Athlete Screening & Safety',
    shortTitle: 'Screening',
    description: 'How to assess readiness, screen for injury risk, and build safe session environments for Strongman athletes.',
    icon: '🛡️',
    status: 'completed',
    x: 3, y: 1,
    connections: ['session'],
  },

  // Row 2
  {
    id: 'session',
    title: 'Session Structure',
    shortTitle: 'Sessions',
    description: 'Planning, delivery, and review of Strongman training sessions. Warm-up protocols and coaching flow.',
    icon: '📅',
    status: 'in-progress',
    x: 2, y: 2,
    connections: ['log', 'axle', 'deadlift'],
  },

  // Row 3 — Events
  {
    id: 'log',
    title: 'Log Press Fundamentals',
    shortTitle: 'Log Press',
    description: 'Technique, loading progressions, and coaching cues for the log press — the signature Strongman overhead event.',
    icon: '🪵',
    status: 'available',
    lessonRef: 'log-press',
    x: 0, y: 3,
    connections: ['practical'],
  },
  {
    id: 'axle',
    title: 'Axle Press Fundamentals',
    shortTitle: 'Axle Press',
    description: 'Axle press mechanics, grip differences, and how to coach the continental clean for axle bar events.',
    icon: '⚡',
    status: 'available',
    lessonRef: 'axle-press',
    x: 1, y: 3,
    connections: ['practical'],
  },
  {
    id: 'deadlift',
    title: 'Deadlift Fundamentals',
    shortTitle: 'Deadlift',
    description: 'Strongman deadlift variations including the silver dollar, car deadlift, and frame deadlift — technique and coaching cues.',
    icon: '🔩',
    status: 'locked',
    x: 2, y: 3,
    connections: ['practical'],
  },
  {
    id: 'farmer',
    title: 'Farmer Walk Fundamentals',
    shortTitle: 'Farmer Walk',
    description: 'Grip, turn mechanics, and speed work for farmer walks. Foot placement and coaching for competition performance.',
    icon: '🚶',
    status: 'locked',
    x: 3, y: 3,
    connections: ['yoke'],
  },
  {
    id: 'yoke',
    title: 'Yoke Fundamentals',
    shortTitle: 'Yoke',
    description: 'Load placement, leg drive, and visual cue techniques for the yoke. Common errors and correction strategies.',
    icon: '⚖️',
    status: 'locked',
    x: 4, y: 3,
    connections: ['stones'],
  },

  // Row 4
  {
    id: 'stones',
    title: 'Atlas Stones Fundamentals',
    shortTitle: 'Atlas Stones',
    description: 'The pinnacle Strongman event. Tacky application, lap mechanics, and safe loading progressions for the atlas stone.',
    icon: '🪨',
    status: 'locked',
    x: 3, y: 4,
    connections: ['practical'],
  },
  {
    id: 'practical',
    title: 'Practical Coaching Skills',
    shortTitle: 'Practical',
    description: 'On-floor coaching delivery, communication styles, feedback loops, and real-time athlete support during training.',
    icon: '🎯',
    status: 'locked',
    x: 1, y: 4,
    connections: ['assessment'],
  },

  // Row 5 — Assessment
  {
    id: 'assessment',
    title: 'Assessment Preparation',
    shortTitle: 'Assessment',
    description: 'Preparing for the formal assessment. Portfolio requirements, practical demonstration, and written components.',
    icon: '📜',
    status: 'locked',
    x: 2, y: 5,
    connections: [],
  },

  // CPD nodes — row 7
  {
    id: 'cpd-cues',
    title: 'Coaching Cues Masterclass',
    shortTitle: 'Cues CPD',
    description: 'Advanced cueing strategies for Strongman events. Verbal, visual, and tactile coaching cues for performance gains.',
    icon: '💡',
    status: 'locked',
    isCPD: true,
    x: 0, y: 7,
    connections: [],
  },
  {
    id: 'cpd-programming',
    title: 'Beginner Programme Design',
    shortTitle: 'Programming',
    description: 'Periodisation and programme design for beginner Strongman athletes. Progression models and training frequency.',
    icon: '📊',
    status: 'locked',
    isCPD: true,
    x: 1, y: 7,
    connections: [],
  },
  {
    id: 'cpd-competition',
    title: 'Competition Day Coaching',
    shortTitle: 'Competition',
    description: 'Preparing athletes for competition. Warm-up protocols, attempt selection, and coaching under pressure.',
    icon: '🏆',
    status: 'locked',
    isCPD: true,
    x: 2, y: 7,
    connections: [],
  },
  {
    id: 'cpd-troubleshoot',
    title: 'Event Troubleshooting',
    shortTitle: 'Troubleshoot',
    description: 'Diagnosing and correcting common technical errors across all six core Strongman events.',
    icon: '🔧',
    status: 'locked',
    isCPD: true,
    x: 3, y: 7,
    connections: [],
  },
  {
    id: 'cpd-youth',
    title: 'Youth Strength Foundations',
    shortTitle: 'Youth',
    description: 'Adapting Strongman principles for youth athletes. Age-appropriate loading, safety considerations, and session design.',
    icon: '⭐',
    status: 'locked',
    isCPD: true,
    x: 4, y: 7,
    connections: [],
  },
];

/* ── Layout constants ─────────────────────────────────────────────── */
const COL_WIDTH = 180;
const ROW_HEIGHT = 140;
const NODE_RADIUS = 40; // half of 80px diameter
const CANVAS_COLS = 5;
const CANVAS_ROWS = 8; // rows 0–7
const CANVAS_WIDTH = CANVAS_COLS * COL_WIDTH;   // 900
const CANVAS_HEIGHT = CANVAS_ROWS * ROW_HEIGHT; // 1120

/* ── Helpers ────────────────────────────────────────────────────────── */
function nodeCenter(node: SkillNode): { cx: number; cy: number } {
  return {
    cx: node.x * COL_WIDTH + COL_WIDTH / 2,
    cy: node.y * ROW_HEIGHT + ROW_HEIGHT / 2,
  };
}

function nodeLeft(node: SkillNode): number {
  return node.x * COL_WIDTH + COL_WIDTH / 2 - NODE_RADIUS;
}

function nodeTop(node: SkillNode): number {
  return node.y * ROW_HEIGHT + ROW_HEIGHT / 2 - NODE_RADIUS;
}

function nodeBg(node: SkillNode): string {
  if (node.isCPD) return '#0A0A12';
  switch (node.status) {
    case 'completed':    return 'radial-gradient(circle at 35% 35%, #A41C64, #7A1349)';
    case 'in-progress':  return 'radial-gradient(circle at 35% 35%, #E19A47, #B87932)';
    case 'available':    return '#1A1A2A';
    case 'locked':       return '#111118';
  }
}

function nodeBorder(node: SkillNode): string {
  if (node.isCPD)       return '1px dashed rgba(164,28,100,0.3)';
  switch (node.status) {
    case 'completed':   return '2px solid #A41C64';
    case 'in-progress': return '2px solid #E19A47';
    case 'available':   return '2px solid rgba(255,255,255,0.4)';
    case 'locked':      return '1px solid rgba(255,255,255,0.1)';
  }
}

function nodeGlow(node: SkillNode): string {
  switch (node.status) {
    case 'completed':   return '0 0 24px rgba(164,28,100,0.55)';
    case 'in-progress': return '0 0 24px rgba(225,154,71,0.55)';
    default:            return 'none';
  }
}

function nodeOpacity(node: SkillNode): number {
  if (node.isCPD) return 0.4;
  return node.status === 'locked' ? 0.5 : 1;
}

function nodeTextColour(node: SkillNode): string {
  if (node.status === 'locked' || node.isCPD) return 'rgba(255,255,255,0.3)';
  return 'rgba(255,255,255,0.85)';
}

/* ── SVG Lines ───────────────────────────────────────────────────────── */
function ConnectionLines({ reducedMotion: _rm }: { reducedMotion: boolean }) {
  const nodeMap = new Map<string, SkillNode>(NODES.map(n => [n.id, n]));

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {NODES.flatMap(node =>
        node.connections.map(targetId => {
          const target = nodeMap.get(targetId);
          if (!target) return null;
          const { cx: x1, cy: y1 } = nodeCenter(node);
          const { cx: x2, cy: y2 } = nodeCenter(target);
          const isActive = node.status === 'completed' && target.status === 'completed';
          return (
            <line
              key={`${node.id}-${targetId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? '#A41C64' : 'rgba(255,255,255,0.1)'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? undefined : '4 4'}
              opacity={isActive ? 0.6 : 1}
            />
          );
        })
      )}
    </svg>
  );
}

/* ── Single Node ─────────────────────────────────────────────────────── */
function SkillNodeDot({
  node,
  isSelected,
  reducedMotion,
  onClick,
}: {
  node: SkillNode;
  isSelected: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}) {
  const pulseStyle: React.CSSProperties =
    node.status === 'in-progress' && !reducedMotion
      ? {
          animation: 'nodeRipple 2s ease-out infinite',
        }
      : {};

  return (
    <div
      style={{
        position: 'absolute',
        left: nodeLeft(node),
        top: nodeTop(node),
        width: NODE_RADIUS * 2,
        height: NODE_RADIUS * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: node.status === 'locked' && !node.isCPD ? 'default' : 'pointer',
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={onClick}
    >
      {/* Pulse ring for in-progress */}
      {node.status === 'in-progress' && !reducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '2px solid rgba(225,154,71,0.4)',
            ...pulseStyle,
          }}
        />
      )}

      {/* Circle */}
      <div
        style={{
          width: NODE_RADIUS * 2,
          height: NODE_RADIUS * 2,
          borderRadius: '50%',
          background: nodeBg(node),
          border: isSelected ? '2px solid #fff' : nodeBorder(node),
          boxShadow: isSelected ? '0 0 0 3px rgba(255,255,255,0.2), ' + nodeGlow(node) : nodeGlow(node),
          opacity: nodeOpacity(node),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'border 0.2s, box-shadow 0.2s, transform 0.15s',
          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
          position: 'relative',
        }}
      >
        {node.status === 'locked' && !node.isCPD && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '10px', opacity: 0.5 }}>🔒</span>
        )}
        {node.icon}
      </div>

      {/* Label below */}
      <div
        style={{
          marginTop: '8px',
          fontSize: '10px',
          fontWeight: 600,
          color: nodeTextColour(node),
          textAlign: 'center',
          maxWidth: COL_WIDTH - 12,
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {node.shortTitle}
      </div>
    </div>
  );
}

/* ── CPD Separator Band ─────────────────────────────────────────────── */
function CPDSeparator() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 6 * ROW_HEIGHT,
        left: 0,
        width: '100%',
        height: ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        borderTop: '1px dashed rgba(164,28,100,0.2)',
        borderBottom: '1px dashed rgba(164,28,100,0.2)',
        background: 'rgba(164,28,100,0.03)',
        zIndex: 2,
      }}
    >
      <span style={{ fontSize: '14px', opacity: 0.5 }}>🔒</span>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        CPD — Unlocks after Level 1 Completion
      </span>
    </div>
  );
}

/* ── Detail Panel ─────────────────────────────────────────────────── */
function DetailPanel({
  node,
  onClose,
}: {
  node: SkillNode;
  onClose: () => void;
}) {
  const statusColour: Record<NodeStatus, string> = {
    completed: '#A41C64',
    'in-progress': '#E19A47',
    available: 'rgba(255,255,255,0.6)',
    locked: 'rgba(255,255,255,0.25)',
  };
  const statusLabel: Record<NodeStatus, string> = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    available: 'Available',
    locked: 'Locked',
  };

  const colour = statusColour[node.status];

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10,10,20,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(164,28,100,0.25)',
        padding: '20px 24px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      {/* Icon + info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1, minWidth: '260px' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: nodeBg(node),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            border: nodeBorder(node),
          }}
        >
          {node.icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>
              {node.title}
            </h3>
            <span
              style={{
                background: `${colour}22`,
                border: `1px solid ${colour}55`,
                color: colour,
                borderRadius: '4px',
                padding: '1px 8px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {statusLabel[node.status]}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
            {node.description}
          </p>
          {node.isCPD && (
            <p style={{ color: 'rgba(164,28,100,0.7)', fontSize: '11px', marginTop: '6px' }}>
              CPD module — available after Level 1 completion
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {node.status === 'completed' && (
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              background: 'rgba(164,28,100,0.2)',
              border: '1px solid rgba(164,28,100,0.4)',
              color: '#A41C64',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Review →
          </Link>
        )}
        {node.status === 'in-progress' && (
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #A41C64, #C0246E)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Continue →
          </Link>
        )}
        {node.status === 'available' && (
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #A41C64, #C0246E)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Start Lesson →
          </Link>
        )}
        {(node.status === 'locked' || node.isCPD) && (
          <button
            disabled
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.25)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'not-allowed',
            }}
          >
            🔒 Locked
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            width: 36,
            height: 36,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ── Progress Sidebar ────────────────────────────────────────────────── */
function ProgressSidebar({ user }: { user: { firstName: string; lastName: string } | null }) {
  const firstName = user?.firstName ?? 'Learner';
  const lastName = user?.lastName ?? '';

  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        background: '#0E0E1A',
        borderLeft: '1px solid rgba(164,28,100,0.15)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Learner info */}
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #A41C64, #7A1349)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {firstName[0]}{lastName[0]}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{firstName} {lastName}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Learner</div>
          </div>
        </div>
      </div>

      {/* Pathway progress */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Pathway
        </div>
        <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
          Coaching Level 1
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '16px' }}>
          Fundamentals of Coaching Strongman
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Progress</span>
            <span style={{ color: '#E19A47', fontSize: '11px', fontWeight: 700 }}>45%</span>
          </div>
          <div
            style={{
              height: 6,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '45%',
                height: '100%',
                background: 'linear-gradient(90deg, #E19A47, #C07A32)',
                borderRadius: '999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Lesson count */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#E19A47', fontSize: '20px', fontWeight: 800 }}>5</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>Completed</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: '20px', alignSelf: 'center' }}>/</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px', fontWeight: 800 }}>11</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>Total Lessons</div>
          </div>
        </div>
      </div>

      {/* Certificate status */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Certificate
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Level 1 Certificate</div>
          <span
            style={{
              background: 'rgba(234,179,8,0.15)',
              border: '1px solid rgba(234,179,8,0.3)',
              color: '#EAB308',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            IN PROGRESS
          </span>
        </div>
      </div>

      {/* CPD status */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          CPD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', opacity: 0.5 }}>🔒</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', lineHeight: 1.5 }}>
            Locked — complete Level 1 first
          </span>
        </div>
      </div>

      {/* Next lesson */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Next Up
        </div>
        <div
          style={{
            background: '#131320',
            border: '1px solid rgba(164,28,100,0.2)',
            borderRadius: '10px',
            padding: '12px 14px',
          }}
        >
          <div style={{ color: 'rgba(164,28,100,0.8)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Event Module
          </div>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            Log Press Fundamentals
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 24px', marginTop: 'auto' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'block',
            background: 'linear-gradient(135deg, #A41C64, #C0246E)',
            color: '#fff',
            padding: '14px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(164,28,100,0.4)',
            transition: 'opacity 0.2s',
          }}
        >
          Continue Learning →
        </Link>
      </div>
    </div>
  );
}

/* ── Canvas title bar ─────────────────────────────────────────────── */
const LEGEND: { label: string; colour: string; bg: string; dash?: boolean }[] = [
  { label: 'Completed', colour: '#A41C64', bg: 'rgba(164,28,100,0.2)' },
  { label: 'In Progress', colour: '#E19A47', bg: 'rgba(225,154,71,0.2)' },
  { label: 'Available', colour: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.07)' },
  { label: 'Locked', colour: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.04)' },
];

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function SkillTree() {
  const { user } = useAuth();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const selectedNode = NODES.find(n => n.id === selectedNodeId) ?? null;

  function handleNodeClick(node: SkillNode) {
    setSelectedNodeId(prev => (prev === node.id ? null : node.id));
  }

  return (
    <>
      <style>{`
        @keyframes nodeRipple {
          0%   { box-shadow: 0 0 0 0 rgba(225,154,71,0.5); }
          70%  { box-shadow: 0 0 0 14px rgba(225,154,71,0); }
          100% { box-shadow: 0 0 0 0 rgba(225,154,71,0); }
        }
      `}</style>

      <div
        style={{
          background: '#080810',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#fff',
        }}
      >
        <Navbar />

        {/* Main layout below navbar */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            paddingTop: 64,
            overflow: 'hidden',
          }}
        >
          {/* ── Left: Skill Tree Canvas ─────────────────────────────── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            {/* Title bar */}
            <div
              style={{
                background: '#0E0E18',
                borderBottom: '1px solid rgba(164,28,100,0.12)',
                padding: '0 24px',
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                gap: '16px',
              }}
            >
              {/* Breadcrumb + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
                  Coaching Pathway
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>—</span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>Level 1</span>
                <span
                  style={{
                    background: 'rgba(164,28,100,0.15)',
                    border: '1px solid rgba(164,28,100,0.3)',
                    color: '#A41C64',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Skill Tree
                </span>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {LEGEND.map(item => (
                  <span
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: item.bg,
                      border: `1px solid ${item.colour}44`,
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      color: item.colour,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: item.colour,
                        flexShrink: 0,
                      }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Scrollable canvas + sticky detail panel */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Canvas */}
              <div
                style={{
                  position: 'relative',
                  width: CANVAS_WIDTH,
                  minWidth: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT,
                  minHeight: 'calc(100vh - 120px)',
                  margin: '0 auto',
                  padding: '16px 0',
                }}
              >
                {/* SVG connection lines (rendered behind nodes) */}
                <ConnectionLines reducedMotion={reducedMotion} />

                {/* CPD separator band */}
                <CPDSeparator />

                {/* Nodes */}
                {NODES.map(node => (
                  <SkillNodeDot
                    key={node.id}
                    node={node}
                    isSelected={selectedNodeId === node.id}
                    reducedMotion={reducedMotion}
                    onClick={() => handleNodeClick(node)}
                  />
                ))}
              </div>

              {/* Detail panel — sticky at bottom of scroll container */}
              {selectedNode && (
                <DetailPanel
                  node={selectedNode}
                  onClose={() => setSelectedNodeId(null)}
                />
              )}
            </div>
          </div>

          {/* ── Right: Progress Sidebar ─────────────────────────────── */}
          <ProgressSidebar user={user} />
        </div>
      </div>
    </>
  );
}
