interface CourseQualificationProps {
  heading: string;
  copy: string;
  detail?: string;
}

export default function CourseQualification({ heading, copy, detail }: CourseQualificationProps) {
  return (
    <section style={{ background: '#050506', borderBottom: '1px solid rgba(194,24,106,0.08)' }} className="py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Accreditation badge */}
          <div className="inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-8"
            style={{ background: 'rgba(164,28,100,0.1)', border: '1px solid rgba(164,28,100,0.3)' }}>
            <svg className="w-4 h-4" style={{ color: '#A41C64' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-sm font-bold" style={{ color: '#A41C64' }}>Active IQ Accredited</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-5" style={{ letterSpacing: '-0.03em' }}>{heading}</h2>
          <p className="text-es-muted leading-relaxed mb-5">{copy}</p>
          {detail && (
            <p className="text-sm text-es-muted leading-relaxed border-l-2 pl-4"
              style={{ borderColor: '#A41C64' }}>
              {detail}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
