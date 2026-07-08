import Navbar from '../layout/Navbar';
import { WorkspaceSectionCard, WorkspaceActionCard } from '../workspace/WorkspaceSectionCard';
import { UsersIcon, ChartIcon, FolderIcon, AlertIcon, ResourcesIcon, NotesIcon, ProfileIcon } from '../workspace/icons';

/*
 * Coach Workspace foundation — shared between the real /coach page and
 * /portal-preview/coach. `basePath` controls where the Coach Profile
 * action links to ("/coach" for real, "/portal-preview/coach" for
 * preview), so the preview never sends a visitor into a real protected
 * route.
 *
 * These are honest empty states, not fake data. When EducateStrong has
 * real coaches with real assigned learners, only the copy inside each
 * card changes — this shell stays the same.
 */
export default function CoachWorkspaceBody({ basePath }: { basePath: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050506', color: '#fff' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% -20%, rgba(164,28,100,0.16) 0%, transparent 52%), #050506',
        borderBottom: '1px solid rgba(194,24,106,0.08)',
        paddingTop: 'calc(var(--navbar-height,72px) + 24px)',
        paddingBottom: '24px',
      }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Coach Workspace
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome to your Coach Workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, maxWidth: '560px' }}>
            Your hub for managing students, tracking progress, and accessing coaching resources.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>

          <WorkspaceSectionCard
            icon={<UsersIcon />}
            title="Assigned Students"
            emptyState="No assigned students yet."
            helper="Once learners are assigned to you, you'll see their name, course, progress and last activity here."
          />

          <WorkspaceSectionCard
            icon={<ChartIcon />}
            title="Student Course Progress"
            emptyState="Progress will appear once learners are assigned."
            helper="Track completion percentage, modules completed and coursework status for each learner."
          />

          <WorkspaceSectionCard
            icon={<FolderIcon />}
            title="Assigned Courses or Programmes"
            emptyState="No assigned courses yet."
            helper="Course title, cohort, learner count and next session will appear here."
          />

          <WorkspaceSectionCard
            icon={<AlertIcon />}
            title="Learner Alerts or Support Flags"
            emptyState="No active learner alerts."
            helper="Missed coursework, low progress and support needs will be flagged here."
          />

          <WorkspaceSectionCard
            icon={<ResourcesIcon />}
            title="Coaching Resources"
            emptyState="Resources will appear once assigned by EducateStrong."
            helper="Documents, checklists and session materials will be available here."
          />

          <WorkspaceSectionCard
            icon={<NotesIcon />}
            title="Notes and Feedback"
            emptyState="No notes yet."
            helper="Session notes, coach feedback and learner updates will be tracked here."
          />

        </div>

        <WorkspaceActionCard
          icon={<ProfileIcon />}
          title="Coach Profile"
          description="Manage how you appear to learners and in the public coach directory."
          actionLabel="Open Coach Profile"
          to={`${basePath}/profile`}
        />
      </div>
    </div>
  );
}
