import { Link } from 'react-router-dom';

interface CourseAccessOverviewProps {
  interestType: string;
}

const BLOCKS: { heading: string; copy: string }[] = [
  {
    heading: 'What you can preview',
    copy: 'Public visitors can view the course overview, pathway information, module titles and the learning structure before registering interest.',
  },
  {
    heading: 'What the learner pathway unlocks',
    copy: 'Approved learners get access to full lessons, course documents, coursework, assessment guidance, tutor-supported learning and the certificate pathway.',
  },
  {
    heading: 'How assessment works',
    copy: 'Learners complete coursework and assessment tasks. Submissions are reviewed by EducateStrong assessors. Certificate issuing remains managed by EducateStrong.',
  },
  {
    heading: 'What happens after you register interest',
    copy: 'EducateStrong reviews the enquiry, confirms the right pathway, explains payment or booking steps, and grants access once approved.',
  },
];

// Explains the soft-paywall model on course pages: what a public visitor
// can see now, what the learner pathway unlocks, and why. Shown only to
// visitors who haven't unlocked the course yet — an enrolled learner has
// already answered these questions.
export default function CourseAccessOverview({ interestType }: CourseAccessOverviewProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="es-label mb-3">How access works</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
            What you can access, and when
          </h2>
          <p className="text-es-muted leading-relaxed mb-8">
            This course preview shows the structure. Full lessons, templates, documents and assessment
            support sit inside the learner pathway — kept behind tutor-guided access so every learner gets
            the same standard of support and review.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {BLOCKS.map(block => (
              <div key={block.heading}>
                <h3 className="font-bold text-white text-sm mb-1.5">{block.heading}</h3>
                <p className="text-es-muted text-sm leading-relaxed">{block.copy}</p>
              </div>
            ))}
          </div>

          <div className="es-card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white text-sm mb-0.5">Ready to follow the full coaching pathway?</p>
              <p className="text-es-muted text-xs">Register your interest and the EducateStrong team will guide you through the next step.</p>
            </div>
            <Link
              to={`/register-interest?type=${encodeURIComponent(interestType)}`}
              className="btn-primary text-xs py-2.5 px-5 flex-shrink-0"
            >
              Register Interest
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
