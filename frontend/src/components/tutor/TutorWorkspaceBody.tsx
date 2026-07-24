import Navbar from '../layout/Navbar';
import EmailVerificationBanner from '../layout/EmailVerificationBanner';
import { WorkspaceSectionCard, WorkspaceActionCard } from '../workspace/WorkspaceSectionCard';
import { FolderIcon, ResourcesIcon, NotesIcon, ChartIcon, ProfileIcon } from '../workspace/icons';

/*
 * Tutor Workspace foundation — shared between the real /tutor page and
 * /portal-preview/tutor. `basePath` controls where "Assigned Courses
 * and Groups" and "Tutor Profile" link to ("/tutor" for real,
 * "/portal-preview/tutor" for preview), so the preview never sends a
 * visitor into a real protected route. `showVerificationBanner`
 * defaults to false and must be passed explicitly by the real page
 * only — the preview must never reflect a real logged-in user's
 * verification state, so it simply never passes this prop.
 */
export default function TutorWorkspaceBody({ basePath, showVerificationBanner }: { basePath: string; showVerificationBanner?: boolean }) {
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
          {showVerificationBanner && <EmailVerificationBanner />}
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Tutor Workspace
          </p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome to your Tutor Workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, maxWidth: '560px' }}>
            Your hub for teaching, session management, and learner support.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>

          <WorkspaceSectionCard
            icon={<FolderIcon />}
            title="Assigned Courses and Groups"
            emptyState="No assigned courses or groups yet."
            helper="Course title, learner group and next session will appear here."
            linkTo={`${basePath}/courses`}
            linkLabel="View courses & groups"
          />

          <WorkspaceSectionCard
            icon={<ResourcesIcon />}
            title="Teaching Resources"
            emptyState="Teaching resources will appear once assigned."
            helper="Session materials and course documents will be available here."
          />

          <WorkspaceSectionCard
            icon={<NotesIcon />}
            title="Session Notes and Learner Feedback"
            emptyState="No session notes yet."
            helper="Add and review tutor notes and learner feedback here."
          />

          <WorkspaceSectionCard
            icon={<ChartIcon />}
            title="Learner Progress"
            emptyState="Progress will appear once learners are connected."
            helper="Track learner progress through your assigned courses here."
          />

        </div>

        <WorkspaceActionCard
          icon={<ProfileIcon />}
          title="Tutor Profile"
          description="Manage your tutor details and teaching areas."
          actionLabel="Open Tutor Profile"
          to={`${basePath}/profile`}
        />
      </div>
    </div>
  );
}
