interface CourseQualificationProps {
  heading: string;
  copy: string;
  detail?: string;
}

export default function CourseQualification({ heading, copy, detail }: CourseQualificationProps) {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Accreditation badge */}
          <div className="inline-flex items-center gap-2 border border-amber-300 bg-amber-50 rounded-lg px-4 py-2 mb-8">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="text-sm font-semibold text-amber-700">Active IQ Accredited</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{heading}</h2>
          <p className="text-gray-700 leading-relaxed mb-5">{copy}</p>
          {detail && (
            <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-amber-300 pl-4">
              {detail}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
