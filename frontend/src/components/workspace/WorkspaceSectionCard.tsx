import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
 * Shared foundation card for Coach/Tutor workspace overview sections.
 * Used by both the real workspace pages and their /portal-preview
 * equivalents (via CoachWorkspaceBody / TutorWorkspaceBody), so any
 * visual change here applies to both automatically.
 *
 * Design intent: when real data exists, only the emptyState/helper text
 * gets replaced with real content — the card shell stays the same.
 */
interface WorkspaceSectionCardProps {
  icon: ReactNode;
  title: string;
  emptyState: string;
  helper: string;
  /** Optional — renders a link at the bottom of the card, e.g. for
   * sections that need their own dedicated sub-page. */
  linkTo?: string;
  linkLabel?: string;
}

export function WorkspaceSectionCard({ icon, title, emptyState, helper, linkTo, linkLabel }: WorkspaceSectionCardProps) {
  return (
    <div style={{ background: '#151519', border: '1px solid rgba(194,24,106,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#A41C64', flexShrink: 0, display: 'flex' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '6px' }}>{emptyState}</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', lineHeight: 1.6, margin: linkTo ? '0 0 14px' : 0 }}>{helper}</p>
        {linkTo && (
          <Link to={linkTo} style={{ fontSize: '12px', fontWeight: 700, color: '#A41C64', textDecoration: 'none' }}>
            {linkLabel ?? 'View'} →
          </Link>
        )}
      </div>
    </div>
  );
}

/*
 * Distinct "action" card style for Coach/Tutor Profile — visually
 * different from the empty-state section cards so it clearly reads as
 * something to go DO, not something to wait on.
 */
interface WorkspaceActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  to: string;
}

export function WorkspaceActionCard({ icon, title, description, actionLabel, to }: WorkspaceActionCardProps) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        background: 'linear-gradient(135deg, rgba(164,28,100,0.14), rgba(124,58,237,0.1))',
        border: '1px solid rgba(164,28,100,0.3)',
        borderRadius: '14px',
        padding: '20px',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(164,28,100,0.6)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(164,28,100,0.3)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ color: '#fff', flexShrink: 0, display: 'flex' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{title}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 14px' }}>{description}</p>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{actionLabel} →</span>
    </Link>
  );
}
