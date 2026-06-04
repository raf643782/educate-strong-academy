interface CourseDateSectionProps {
  heading: string;
  copy: string;
  subCopy: string;
  contactEmail: string;
  courseTitle?: string;
}

export default function CourseDateSection({ heading, copy, subCopy, contactEmail, courseTitle = 'this course' }: CourseDateSectionProps) {
  const registerHref = `mailto:${contactEmail}?subject=Register%20Interest%20—%20${encodeURIComponent(courseTitle)}`;
  return (
    <section style={{ background: '#111111', borderBottom: '1px solid #2C2C2C' }} className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="es-label mb-3">Dates</p>
          <h2 className="text-2xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          <p className="text-es-muted leading-relaxed mb-3">{copy}</p>
          <p className="text-xs text-es-subtle leading-relaxed mb-8">{subCopy}</p>
          <a href={registerHref} className="btn-primary text-sm inline-block">Register Interest</a>
          <p className="text-xs text-es-subtle mt-4">No payment required at this stage. You will be contacted directly when a course date is confirmed.</p>
        </div>
      </div>
    </section>
  );
}
