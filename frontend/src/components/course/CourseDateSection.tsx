import { Link } from 'react-router-dom';

interface CourseDateSectionProps {
  heading: string;
  copy: string;
  subCopy: string;
  contactEmail: string;
  courseTitle?: string;
  interestType: string;
}

export default function CourseDateSection({ heading, copy, subCopy, interestType }: CourseDateSectionProps) {
  const registerHref = `/register-interest?type=${encodeURIComponent(interestType)}`;
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14">
      <div className="es-container-wide">
        <div className="max-w-2xl">
          <p className="es-label mb-3">Dates</p>
          <h2 className="text-2xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          <p className="text-es-muted leading-relaxed mb-3">{copy}</p>
          <p className="text-xs text-es-subtle leading-relaxed mb-8">{subCopy}</p>
          <Link to={registerHref} className="btn-primary text-sm inline-block">Register Interest</Link>
          <p className="text-xs text-es-subtle mt-4">No payment required at this stage. You will be contacted directly when a course date is confirmed.</p>
        </div>
      </div>
    </section>
  );
}
